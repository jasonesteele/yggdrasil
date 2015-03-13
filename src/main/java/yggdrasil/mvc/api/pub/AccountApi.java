package yggdrasil.mvc.api.pub;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.mail.MessagingException;
import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import yggdrasil.dao.AccountVerificationDao;
import yggdrasil.dao.UserDao;
import yggdrasil.mail.MailService;
import yggdrasil.model.AccountVerification;
import yggdrasil.model.User;
import yggdrasil.mvc.UrlBuilder;
import yggdrasil.mvc.api.dto.ApiError;
import yggdrasil.mvc.api.dto.EmailResource;
import yggdrasil.mvc.api.dto.NewUserResource;
import yggdrasil.mvc.api.dto.UserResource;
import yggdrasil.mvc.exception.UserAlreadyVerifiedException;
import yggdrasil.mvc.exception.VerificationHoldoffException;

import com.wordnik.swagger.annotations.Api;
import com.wordnik.swagger.annotations.ApiOperation;
import com.wordnik.swagger.annotations.ApiResponse;
import com.wordnik.swagger.annotations.ApiResponses;

/**
 * REST controller for administration of user accounts.
 *
 * @author jason
 */
@RestController
@Transactional
@Api(value = "account", description = "Supports creation of new user accounts, verification and password reset requests")
@RequestMapping(value = "api/public/account")
@PreAuthorize("permitAll()")
public class AccountApi {
  @Resource
  private Environment env;

  @Resource
  private UserDao userDao;

  @Resource
  private AccountVerificationDao verificationDao;

  @Resource
  private MailService mailService;

  @Resource
  private PasswordEncoder encoder;

  @ApiOperation(value = "Create a new user account", notes = "Adds a new user.")
  @ApiResponses({
      @ApiResponse(code = 200, message = "Default success method.  Not returned by this method.", response = Void.class),
      @ApiResponse(code = 201, message = "User was added succesfully.  The Location header contains the URI of the newly created user.", response = UserResource.class) })
  @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Long> createNewUser(
      @RequestBody(required = true) final NewUserResource userResource,
      final HttpServletRequest request) throws MessagingException {
    final User newUser = new User();
    newUser.setUsername(userResource.getUsername());
    newUser.setEmail(userResource.getEmail());
    newUser.setEnabled(true);
    newUser.setPassword(encoder.encode(userResource.getPassword()));

    // Go ahead and log user in
    final Long userId = userDao.create(newUser);
    final User user = userDao.get(userId);

    final Authentication auth = new UsernamePasswordAuthenticationToken(user, null,
        user.getAuthorities());

    SecurityContextHolder.getContext().setAuthentication(auth);

    sendNewVerification(request, user);

    return new ResponseEntity<Long>(userId, HttpStatus.CREATED);
  }

  @ExceptionHandler(EntityNotFoundException.class)
  public @ResponseBody ApiError handleException(final EntityNotFoundException enfe,
      final HttpServletResponse response) {
    response.setStatus(HttpStatus.NOT_FOUND.value());
    response.setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE);
    return new ApiError("Account not found", enfe.toString());
  }

  @ExceptionHandler(MessagingException.class)
  public @ResponseBody ApiError handleException(final MessagingException uave,
      final HttpServletResponse response) {
    response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
    response.setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE);
    return new ApiError("Internal server error sending e-mail");
  }

  @ExceptionHandler(UserAlreadyVerifiedException.class)
  public @ResponseBody ApiError handleException(final UserAlreadyVerifiedException uave,
      final HttpServletResponse response) {
    response.setStatus(HttpStatus.FORBIDDEN.value());
    response.setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE);
    return new ApiError("Account is already verified", uave.toString());
  }

  @ExceptionHandler(VerificationHoldoffException.class)
  public @ResponseBody ApiError handleException(final VerificationHoldoffException vhe,
      final HttpServletResponse response) {
    response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
    response.setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE);
    final StringBuilder sb = new StringBuilder();
    if (vhe.getMinutes() < 1) {
      sb.append("Verification can not be resent for <1 minute");
    } else {
      sb.append(String.format("Verification can not be resent for %d minute%s", vhe.getMinutes(),
          vhe.getMinutes() == 1 ? "" : "s"));
    }
    return new ApiError(sb.toString(), vhe.toString());
  }

  @ApiOperation(value = "Request a new account verification be sent", notes = "Sends a new verification e-mail if the account is not currently verified.")
  @ApiResponses({
      @ApiResponse(code = 200, message = "Default success method.  Not returned by this method.", response = Void.class),
      @ApiResponse(code = 204, message = "Account verification sent.", response = Void.class),
      @ApiResponse(code = 403, message = "Account is already verified; verification can not be resent.", response = ApiError.class),
      @ApiResponse(code = 404, message = "No account with specified e-mail address could be found.", response = ApiError.class),
      @ApiResponse(code = 500, message = "Internal error sending e-mail with verification link. ", response = ApiError.class), })
  @RequestMapping(value = "/verify", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
  @SuppressWarnings("unchecked")
  public ResponseEntity<String> requestVerification(
      @RequestBody(required = true) final EmailResource emailResource,
      final HttpServletRequest request) throws UserAlreadyVerifiedException, MessagingException,
      VerificationHoldoffException {
    final User user = userDao.findByEmail(emailResource.getEmail());
    if (user.isEmailVerified()) {
      throw new UserAlreadyVerifiedException("User with e-mail " + emailResource.getEmail()
          + " has already been verified");
    }

    // Don't allow a new verification within a certain period from the last one
    // @formatter:off
    final List<AccountVerification> verifications =
        verificationDao.createCriteria()
          .add(Restrictions.eq("user.id", user.getId()))
          .addOrder(Order.desc("createdTime"))
          .setMaxResults(1)
          .list();
    // @formatter:on

    if (verifications.size() > 0) {
      final Date lastCreated = verifications.get(0).getCreatedTime();
      final Date now = new Date();
      final long holdOffMs = env.getProperty("mail.link.holdoff", Long.class, 30L) * 60000;
      if (lastCreated.getTime() > now.getTime() - holdOffMs) {
        throw new VerificationHoldoffException(
            (lastCreated.getTime() + holdOffMs - now.getTime()) / 60000);
      }
    }

    sendNewVerification(request, user);
    return new ResponseEntity<String>(HttpStatus.NO_CONTENT);
  }

  /**
   * Creates and send a new account verification request to a user.
   *
   * @param request
   *          HTTP servlet request for user requesting verification
   * @param user
   *          user account being verified
   * @throws MessagingException
   *           if there was an error sending the e-mail
   */
  private void sendNewVerification(final HttpServletRequest request, final User user)
      throws MessagingException {
    final String verificationKey = verificationDao.createVerification(user.getId(),
        env.getProperty("mail.link.validFor", Integer.class, 120));

    // @formatter:off
    final String url = new UrlBuilder(request)
      .absolute()
      .uri("/v/" + verificationKey)
      .toString();
    // @formatter:on

    final Map<String, Object> params = new HashMap<String, Object>();
    params.put("username", user.getUsername());
    params.put("verificationUrl", url.toString());
    mailService.sendEmailTemplate(user.getEmail(), "Account Verification", "verification", params);
  }
}
