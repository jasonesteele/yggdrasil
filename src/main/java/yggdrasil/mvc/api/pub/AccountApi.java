package yggdrasil.mvc.api.pub;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.mail.MessagingException;
import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;

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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import yggdrasil.dao.AccountVerificationDao;
import yggdrasil.dao.UserDao;
import yggdrasil.mail.MailService;
import yggdrasil.model.User;
import yggdrasil.mvc.UrlBuilder;
import yggdrasil.mvc.api.dto.ApiError;
import yggdrasil.mvc.api.dto.NewUserResource;
import yggdrasil.mvc.api.dto.UserResource;

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
    mailService.sendEmailTemplate(userResource.getEmail(), "Account Verification", "verification",
        params);

    return new ResponseEntity<Long>(userId, HttpStatus.CREATED);
  }

  @ExceptionHandler(EntityNotFoundException.class)
  @ResponseBody
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ApiError handleException(final MessagingException me) {
    return new ApiError("Unable to send verification e-mail", me.toString());
  }
}
