package yggdrasil.mvc.api.admin;

import java.util.UUID;

import javax.annotation.Resource;
import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import yggdrasil.dao.UserDao;
import yggdrasil.model.User;
import yggdrasil.mvc.resources.UserListResource;
import yggdrasil.mvc.resources.UserResource;

import com.wordnik.swagger.annotations.Api;
import com.wordnik.swagger.annotations.ApiOperation;
import com.wordnik.swagger.annotations.ApiParam;
import com.wordnik.swagger.annotations.ApiResponse;
import com.wordnik.swagger.annotations.ApiResponses;

/**
 * REST controller for user information.
 *
 * @author jason
 */
@RestController
@RequestMapping(value = "admin/api/account")
@Api(value = "User Accounts", description = "Administrative management of user accounts")
@Transactional
public class AccountApi {
  // TODO - exception handling
  // TODO - add validation

  @Resource
  private UserDao userDao;

  @ApiOperation(value = "Create a new user", notes = "Adds a new user with a random password.  id is ignored, if specified.")
  @ApiResponses({
      @ApiResponse(code = 200, message = "Default success method.  Not returned by this method.", response = Void.class),
      @ApiResponse(code = 201, message = "User was added succesfully.  The Location header contains the URI of the newly created user.", response = UserResource.class) })
  @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Void> addUser(
      @RequestBody(required = true) final UserResource userResource,
      final HttpServletRequest request) {
    final User user = new User();
    if (null != userResource.getUsername()) {
      user.setUsername(userResource.getUsername());
    }
    if (null != userResource.getEmail()) {
      user.setEmail(userResource.getEmail());
    }
    if (null != userResource.getIsEnabled()) {
      user.setEnabled(userResource.getIsEnabled());
    }

    // Set random password
    user.setPassword(UUID.randomUUID().toString());

    final Long newId = userDao.create(user);

    final HttpHeaders headers = new HttpHeaders();
    headers.add(HttpHeaders.LOCATION,
        ServletUriComponentsBuilder.fromContextPath(request).path("/admin/api/account/" + newId)
            .toUriString());

    return new ResponseEntity<Void>(headers, HttpStatus.CREATED);
  }

  @ApiOperation(value = "Delete a user", notes = "Deletes a user.  The currently logged in user can not be deleted.")
  @ApiResponses({
      @ApiResponse(code = 200, message = "Default success method.  Not returned by this method.", response = Void.class),
      @ApiResponse(code = 204, message = "User was deleted succesfully."),
      @ApiResponse(code = 405, message = "The currently logged in user can not be deleted. ") })
  @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
  public ResponseEntity<String> deleteUser(
      @ApiParam("Primary key for user to delete.") @PathVariable("id") final String id) {
    final long userId = Long.valueOf(id);
    if (userId == getCurrentUser().getId()) {
      return new ResponseEntity<String>("Can not delete current user",
          HttpStatus.METHOD_NOT_ALLOWED);
    }
    userDao.delete(userId);
    return new ResponseEntity<String>(HttpStatus.NO_CONTENT);
  }

  @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
  public UserListResource getAllUsers() {
    return new UserListResource(userDao.getAll());
  }

  @RequestMapping(value = "current", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
  public UserResource getCurrentUser() {
    final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication instanceof AnonymousAuthenticationToken) {
      return null;
    } else {
      final UserDetails userDetails = (UserDetails) authentication.getPrincipal();
      final User user = userDao.findByName(userDetails.getUsername());
      return new UserResource(user);
    }
  }

  @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
  public UserResource getUser(@PathVariable("id") final String id) {
    return new UserResource(userDao.get(Long.valueOf(id)));
  }

  @ExceptionHandler(EntityNotFoundException.class)
  @ResponseBody
  @ResponseStatus(value = HttpStatus.NOT_FOUND)
  public String handleException(final EntityNotFoundException enfe) {
    return enfe.getMessage();
  }

  @RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<String> updateUser(@PathVariable("id") final String id,
      @RequestBody(required = true) final UserResource userResource) {
    final User user = userDao.get(Long.valueOf(id));
    if (null != userResource.getUsername()) {
      user.setUsername(userResource.getUsername());
    }
    if (null != userResource.getEmail()) {
      user.setEmail(userResource.getEmail());
    }
    if (null != userResource.getIsEnabled()) {
      if (getCurrentUser().getId().equals(user.getId())) {
        throw new IllegalArgumentException("can't enable or disable current user");
      }
      user.setEnabled(userResource.getIsEnabled());
    }

    userDao.update(user);
    return new ResponseEntity<String>(HttpStatus.NO_CONTENT);
  }
}
