package yggdrasil.mvc.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.mangofactory.swagger.annotations.ApiIgnore;

/**
 * Controller for javascript-based pages.
 *
 * @author jason
 */
@Controller("pageController")
@ApiIgnore
public class PageController {
  @RequestMapping(value = { "/index.htm", "/page/**", "/error/**" }, produces = "text/html")
  public ModelAndView getPage(final HttpServletRequest request) {
    final String path = request.getRequestURI().substring(request.getContextPath().length());
    String view = "page";
    if (path.startsWith("/error/")) {
      view = "error";
    }
    final ModelAndView mav = new ModelAndView(view);
    return mav;
  }
}
