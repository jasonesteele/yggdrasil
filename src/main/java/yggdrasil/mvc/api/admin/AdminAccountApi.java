package yggdrasil.mvc.api.admin;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.annotation.Resource;
import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import yggdrasil.dao.UserDao;
import yggdrasil.model.User;
import yggdrasil.mvc.api.dto.ApiError;
import yggdrasil.mvc.api.dto.NewUserResource;
import yggdrasil.mvc.api.dto.UserResource;
import yggdrasil.mvc.exception.InvalidOperationException;

import com.wordnik.swagger.annotations.Api;
import com.wordnik.swagger.annotations.ApiOperation;
import com.wordnik.swagger.annotations.ApiParam;
import com.wordnik.swagger.annotations.ApiResponse;
import com.wordnik.swagger.annotations.ApiResponses;

/**
 * REST controller for administration of user accounts.
 *
 * @author jason
 */
@RestController
@Transactional
@Api(value = "admin-account", description = "Administration of user accounts")
@RequestMapping(value = "api/admin/account")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminAccountApi {
  @Resource
  private UserDao userDao;

  @ApiOperation(value = "Create a new user", notes = "Adds a new user with a random password.  id is ignored, if specified.")
  @ApiResponses({
      @ApiResponse(code = 200, message = "Default success method.  Not returned by this method.", response = Void.class),
      @ApiResponse(code = 201, message = "User was added succesfully.  The Location header contains the URI of the newly created user.", response = UserResource.class) })
  @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Long> addUser(
      @RequestBody(required = true) final NewUserResource userResource,
      final HttpServletRequest request) {
    final User user = new User();
    user.setCreatedTime(new Date());
    user.setUsername(userResource.getUsername());
    user.setEmail(userResource.getEmail());
    user.setEnabled(true);

    // Set random password
    user.setPassword(UUID.randomUUID().toString());

    final Long newId = userDao.create(user);

    final HttpHeaders headers = new HttpHeaders();
    headers.add(HttpHeaders.LOCATION,
        ServletUriComponentsBuilder.fromContextPath(request).path("/admin/api/account/" + newId)
            .toUriString());

    return new ResponseEntity<Long>(newId, headers, HttpStatus.CREATED);
  }

  @ApiOperation(value = "Delete a user", notes = "Deletes a user.  The currently logged in user can not be deleted.")
  @ApiResponses({
      @ApiResponse(code = 200, message = "Default success method.  Not returned by this method.", response = Void.class),
      @ApiResponse(code = 204, message = "User was deleted succesfully."),
      @ApiResponse(code = 405, message = "The currently logged in user can not be deleted. ") })
  @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
  public ResponseEntity<String> deleteUser(
      @ApiParam("Primary key for user to delete.") @PathVariable("id") final String id) {
    final long userId = Long.parseLong(id);
    if (userId == getAuthenticatedUser().getId()) {
      throw new InvalidOperationException("can not delete current user");
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

  private User getAuthenticatedUser() {
    // An unauthenticated user can never access this API
    final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    final UserDetails userDetails = (UserDetails) authentication.getPrincipal();
    return userDao.findByName(userDetails.getUsername());
  }

  @ApiOperation(value = "Retrieve a user", notes = "Retrieves account information for a user.")
  @ApiResponses(@ApiResponse(code = 200, message = "User account was succesfully returned."))
  @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
  public UserResource getUser(
      @ApiParam("Primary key for user to update.") @PathVariable("id") final String id) {
    return new UserResource(userDao.get(Long.valueOf(id)));
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public @ResponseBody ApiError handleException(final ConstraintViolationException cve,
      final HttpServletResponse response) {
    response.setStatus(HttpStatus.BAD_REQUEST.value());
    response.setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE);
    final StringBuilder sb = new StringBuilder();
    String delim = "";
    for (ConstraintViolation<?> violation : cve.getConstraintViolations()) {
      sb.append(delim).append(
          violation.getPropertyPath() + "=[" + violation.getInvalidValue() + "]: "
              + violation.getMessage());
      delim = "\n";
    }

    return new ApiError("data constraint violation", sb.toString());
  }

  @ExceptionHandler(EntityNotFoundException.class)
  public @ResponseBody ApiError handleException(final EntityNotFoundException enfe,
      final HttpServletResponse response) {
    response.setStatus(HttpStatus.NOT_FOUND.value());
    response.setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE);
    return new ApiError(enfe.getMessage());
  }

  @ExceptionHandler(InvalidOperationException.class)
  public @ResponseBody ApiError handleException(final InvalidOperationException enfe,
      final HttpServletResponse response) {
    response.setStatus(HttpStatus.FORBIDDEN.value());
    response.setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE);
    return new ApiError(enfe.getMessage());
  }

  @ExceptionHandler(NumberFormatException.class)
  public @ResponseBody ApiError handleException(final NumberFormatException enfe,
      final HttpServletResponse response) {
    response.setStatus(HttpStatus.BAD_REQUEST.value());
    response.setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE);
    return new ApiError(enfe.getMessage());
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
    final User authUser = getAuthenticatedUser();

    if (null != userResource.getUsername()) {
      if (authUser.getId().equals(user.getId())) {
        if (!user.getUsername().equals(userResource.getUsername())) {
          throw new InvalidOperationException("can not change username of current user");
        }
      } else {
        user.setUsername(userResource.getUsername());
      }
    }
    if (null != userResource.getEmail()) {
      user.setEmail(userResource.getEmail());
    }
    if (null != userResource.getIsEnabled()) {
      if (authUser.getId().equals(user.getId())) {
        if (user.isEnabled() != userResource.getIsEnabled()) {
          throw new InvalidOperationException("can not enable or disable current user");
        }
      } else {
        user.setEnabled(userResource.getIsEnabled());
      }
    }

    userDao.update(user);
    return new ResponseEntity<String>(HttpStatus.NO_CONTENT);
  }
}
