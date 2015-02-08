package yggdrasil.mvc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.mangofactory.swagger.annotations.ApiIgnore;

/**
 *
 * @author jason
 */
@Controller("pageController")
@ApiIgnore
public class PageController {
  @RequestMapping(value = { "/index.htm", "/page/**" }, produces = "text/html")
  public ModelAndView getPage() {
    final ModelAndView mav = new ModelAndView("page");
    return mav;
  }
}
