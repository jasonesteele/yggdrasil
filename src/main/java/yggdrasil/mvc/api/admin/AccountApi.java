package yggdrasil.mvc.api.admin;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.annotation.Resource;
import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
import yggdrasil.mvc.api.ApiError;
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
@Transactional
@Api(value = "admin-account", description = "Administration of user accounts")
@RequestMapping(value = "api/admin/account")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AccountApi {
  // TODO - add hibernate validation and exception mapping
  // TODO - add exception mapping for database constraint violations

  @Resource
  private UserDao userDao;

  @ApiOperation(value = "Create a new user", notes = "Adds a new user with a random password.  id is ignored, if specified.")
  @ApiResponses({
      @ApiResponse(code = 200, message = "Default success method.  Not returned by this method.", response = Void.class),
      @ApiResponse(code = 201, message = "User was added succesfully.  The Location header contains the URI of the newly created user.", response = UserResource.class) })
  @RequestMapping(value = "/new", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
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
    if (userId == getAuthenticatedUser().getId()) {
      return new ResponseEntity<String>("Can not delete current user",
          HttpStatus.METHOD_NOT_ALLOWED);
    }
    userDao.delete(userId);
    return new ResponseEntity<String>(HttpStatus.NO_CONTENT);
  }

  @ApiOperation(value = "Retrieve all users", notes = "Retrieves a list of all user accounts configured in the system.")
  @ApiResponses(@ApiResponse(code = 200, message = "List of all user accounts was returned."))
  @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
  public List<UserResource> getAllUsers() {
    final List<UserResource> userList = new ArrayList<UserResource>();
    for (User user : userDao.getAll()) {
      userList.add(new UserResource(user));
    }
    return userList;
  }

  public User getAuthenticatedUser() {
    final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication instanceof AnonymousAuthenticationToken) {
      return null;
    } else {
      final UserDetails userDetails = (UserDetails) authentication.getPrincipal();
      return userDao.findByName(userDetails.getUsername());
    }
  }

  @ApiOperation(value = "Retrieve the current user", notes = "Retrieve the currently logged in user.")
  @ApiResponses(@ApiResponse(code = 200, message = "Current user was successfully returned."))
  @RequestMapping(value = "current", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<UserResource> getCurrentUser(final HttpServletRequest request) {
    final User user = getAuthenticatedUser();

    final HttpHeaders headers = new HttpHeaders();
    headers.add(
        HttpHeaders.LOCATION,
        ServletUriComponentsBuilder.fromContextPath(request)
            .path("/admin/api/account/" + user.getId()).toUriString());

    return new ResponseEntity<UserResource>(new UserResource(user), headers, HttpStatus.OK);
  }

  @ApiOperation(value = "Retrieve a user", notes = "Retrieves account information for a user.")
  @ApiResponses(@ApiResponse(code = 200, message = "User account was succesfully returned."))
  @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
  public UserResource getUser(
      @ApiParam("Primary key for user to update.") @PathVariable("id") final String id) {
    return new UserResource(userDao.get(Long.valueOf(id)));
  }

  @ExceptionHandler(EntityNotFoundException.class)
  @ResponseBody
  @ResponseStatus(value = HttpStatus.NOT_FOUND)
  public ApiError handleException(final EntityNotFoundException enfe) {
    return new ApiError(enfe.getMessage());
  }

  @ExceptionHandler(IllegalArgumentException.class)
  @ResponseBody
  @ResponseStatus(value = HttpStatus.BAD_REQUEST)
  public ApiError handleException(final IllegalArgumentException iae) {
    return new ApiError(iae.getMessage());
  }

  @ApiOperation(value = "Update a user", notes = "Updates account information for a user.")
  @ApiResponses({
      @ApiResponse(code = 200, message = "Default success method.  Not returned by this method."),
      @ApiResponse(code = 204, message = "User was updated succesfully.") })
  @RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<String> updateUser(
      @ApiParam("Primary key for user to update.") @PathVariable("id") final String id,
      @RequestBody(required = true) final UserResource userResource) {
    final User user = userDao.get(Long.valueOf(id));
    if (null != userResource.getUsername()) {
      user.setUsername(userResource.getUsername());
    }
    if (null != userResource.getEmail()) {
      user.setEmail(userResource.getEmail());
    }
    if (null != userResource.getIsEnabled()) {
      if (getAuthenticatedUser().getId().equals(user.getId())) {
        if (user.isEnabled() != userResource.getIsEnabled()) {
          throw new IllegalArgumentException("can't enable or disable current user");
        }
      } else {
        user.setEnabled(userResource.getIsEnabled());
      }
    }

    userDao.update(user);
    return new ResponseEntity<String>(HttpStatus.NO_CONTENT);
  }
}
