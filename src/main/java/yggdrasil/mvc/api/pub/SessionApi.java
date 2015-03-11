package yggdrasil.mvc.api.pub;

import javax.annotation.Resource;
import javax.transaction.Transactional;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import yggdrasil.dao.UserDao;
import yggdrasil.model.Role;
import yggdrasil.model.User;
import yggdrasil.mvc.api.dto.SessionResource;

import com.wordnik.swagger.annotations.Api;
import com.wordnik.swagger.annotations.ApiOperation;
import com.wordnik.swagger.annotations.ApiResponse;
import com.wordnik.swagger.annotations.ApiResponses;

/**
 * REST controller for interacting with the user session.
 *
 * @author jason
 */
@RestController
@Transactional
@Api(value = "session", description = "Supports retrieving information about the current user session.")
@RequestMapping(value = "api/public/session")
@PreAuthorize("permitAll()")
public class SessionApi {
  @Resource
  private UserDao userDao;

  @ApiOperation(value = "Retrieves the current user session", notes = "Retrieves the session information.")
  @ApiResponses({ @ApiResponse(code = 200, message = "User session returned succesfully."),
      @ApiResponse(code = 204, message = "No user session found."), })
  @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<SessionResource> getCurrentSession() {
    final Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (!(auth instanceof UsernamePasswordAuthenticationToken)) {
      return new ResponseEntity<SessionResource>(HttpStatus.NO_CONTENT);
    } else {
      final SessionResource resource = new SessionResource();
      final User user = (User) auth.getPrincipal();

      resource.setUsername(user.getUsername());
      resource.setEmail(user.getEmail());

      for (final Role role : user.getRoles()) {
        resource.getRoles().add(role.getName());
      }

      return new ResponseEntity<SessionResource>(resource, HttpStatus.OK);
    }
  }
}
