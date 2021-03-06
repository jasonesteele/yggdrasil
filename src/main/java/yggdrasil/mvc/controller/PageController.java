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
  @RequestMapping(value = { "/index.htm", "/page/**" }, produces = "text/html")
  public ModelAndView getPage(final HttpServletRequest request) {
    final ModelAndView mav = new ModelAndView("page");
    return mav;
  }
}
