package yggdrasil.mvc;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.mangofactory.swagger.annotations.ApiIgnore;

/**
 * MVC controller for the administrative pages.
 *
 * @author jason
 */
@Controller("adminController")
@RequestMapping("/admin")
@ApiIgnore
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminController {
  @RequestMapping(value = "user_mgmt", method = RequestMethod.GET)
  public String userMgmt() {
    return "admin/user_mgmt";
  }
}
