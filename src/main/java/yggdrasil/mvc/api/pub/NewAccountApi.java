package yggdrasil.mvc.api.pub;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import yggdrasil.dao.UserDao;
import yggdrasil.model.User;
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
@Api(value = "create-account", description = "Supports creation of new user accounts")
@RequestMapping(value = "api/public/newAccount", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("permitAll()")
public class NewAccountApi {
  /** Class logger. */
  private static final Logger log = LoggerFactory.getLogger(NewAccountApi.class);

  @Resource
  private UserDao userDao;

  @ApiOperation(value = "Create a new user account", notes = "Adds a new user.")
  @ApiResponses({
      @ApiResponse(code = 200, message = "Default success method.  Not returned by this method.", response = Void.class),
      @ApiResponse(code = 201, message = "User was added succesfully.  The Location header contains the URI of the newly created user.", response = UserResource.class) })
  @RequestMapping(method = RequestMethod.POST)
  public ResponseEntity<Long> createNewUser(
      @RequestBody(required = true) final NewUserResource userResource,
      final HttpServletRequest request) {
    // TODO: this should be injected into both UserDaoImpl and this API
    final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

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

    return new ResponseEntity<Long>(userId, HttpStatus.CREATED);
  }
}
