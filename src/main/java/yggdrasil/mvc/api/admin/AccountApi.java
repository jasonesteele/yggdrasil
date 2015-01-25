package yggdrasil.mvc.api.admin;

import java.util.UUID;

import javax.annotation.Resource;
import javax.transaction.Transactional;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import yggdrasil.dao.UserDao;
import yggdrasil.model.User;
import yggdrasil.mvc.resources.UserListResource;
import yggdrasil.mvc.resources.UserResource;

/**
 * REST controller for user information.
 *
 * @author jason
 */
@RestController
@RequestMapping(value = "admin/api/user")
@Transactional
public class AccountApi {
  // TODO - exception handling

  @Resource
  private UserDao userDao;

  @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
  public UserResource addUser(@RequestBody(required = true) final UserResource userResource) {
    final User user = new User();
    if (null != userResource.getId()) {
      throw new IllegalArgumentException("id not allowed on insert");
    }

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

    return new UserResource(userDao.get(userDao.create(user)));
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

  @RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<String> updateUser(@PathVariable("id") final String id,
      @RequestBody(required = true) final UserResource userResource) {
    if (null != userResource.getId()) {
      throw new IllegalArgumentException("id not allowed on edit");
    }

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
