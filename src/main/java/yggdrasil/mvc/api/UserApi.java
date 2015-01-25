package yggdrasil.mvc.api;

import javax.annotation.Resource;
import javax.transaction.Transactional;

import org.springframework.http.MediaType;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import yggdrasil.dao.UserDao;
import yggdrasil.mvc.resources.UserResource;

/**
 * REST controller for user information.
 *
 * @author jason
 */
@RestController
@RequestMapping("api/user")
@Transactional
public class UserApi {
  @Resource
  private UserDao userDao;

  @RequestMapping(value = "current", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
  public @ResponseBody UserResource getCurrentUser() {
    final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication instanceof AnonymousAuthenticationToken) {
      return null;
    } else {
      final UserDetails userDetails = (UserDetails) authentication.getPrincipal();
      return new UserResource(userDao.findByName(userDetails.getUsername()));
    }
  }
}
