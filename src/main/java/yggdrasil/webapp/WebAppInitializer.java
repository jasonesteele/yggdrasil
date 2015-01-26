package yggdrasil.webapp;

import javax.servlet.Filter;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration.Dynamic;

import org.springframework.core.annotation.Order;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

import yggdrasil.mvc.CORSFilter;
import yggdrasil.mvc.MvcServletConfig;

/**
 * Initializer for the main web application.
 *
 * @author jason
 */
@Order(10)
public class WebAppInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {
  @Override
  protected void customizeRegistration(final Dynamic registration) {
    registration.setInitParameter("dispatchOptionsRequest", "true");
  }

  @Override
  protected Class<?>[] getRootConfigClasses() {
    return new Class<?>[] { RootConfig.class };
  }

  @Override
  protected Class<?>[] getServletConfigClasses() {
    return new Class<?>[] { MvcServletConfig.class };
  }

  @Override
  protected Filter[] getServletFilters() {
    return new Filter[] { new CORSFilter() };
  }

  @Override
  protected String[] getServletMappings() {
    return new String[] { "/", "*.htm" };
  }

  @Override
  protected String getServletName() {
    return "Yggdrasil Server";
  }

  @Override
  public void onStartup(final ServletContext servletContext) throws ServletException {
    super.onStartup(servletContext);
  }
}
