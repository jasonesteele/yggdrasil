package yggdrasil.mvc;

import javax.annotation.Resource;

import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * MVC controller for the login page. Already authenticated users are redirected
 * to the home page.
 *
 * @author jason
 */
@Controller("loginController")
@RequestMapping("/login")
public class LoginController {
  @Resource
  private Environment env;

  @RequestMapping(method = RequestMethod.GET)
  public String login() {
    final Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || auth instanceof AnonymousAuthenticationToken) {
      return "login";
    } else {
      return "redirect:" + env.getProperty("jmud.home", "/");
    }
  }
}
