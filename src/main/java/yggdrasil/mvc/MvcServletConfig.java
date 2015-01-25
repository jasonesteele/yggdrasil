package yggdrasil.mvc;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

/**
 * Configuration for Spring MVC dispatcher servlet.
 *
 * @author jason
 */
@EnableWebMvc
@Configuration
@ComponentScan
public class MvcServletConfig extends WebMvcConfigurerAdapter {
  @Override
  public void addResourceHandlers(final ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/css/**").addResourceLocations("/WEB-INF/static/css/")
        .setCachePeriod(2592000);
    registry.addResourceHandler("/images/**").addResourceLocations("/WEB-INF/static/images/")
        .setCachePeriod(2592000);
    registry.addResourceHandler("/js/**").addResourceLocations("/WEB-INF/static/js/")
        .setCachePeriod(2592000);
    registry.addResourceHandler("/fonts/**").addResourceLocations("/WEB-INF/static/fonts/")
        .setCachePeriod(2592000);
  }

  @Override
  public void addViewControllers(final ViewControllerRegistry registry) {
    registry.addViewController("/index.htm").setViewName("home");
    registry.addViewController("/admin/user_mgmt").setViewName("admin/user_mgmt");
  }

  @Override
  public void configureDefaultServletHandling(final DefaultServletHandlerConfigurer configurer) {
    configurer.enable();
  }

  @Bean
  public ViewResolver getViewResolver() {
    InternalResourceViewResolver resolver = new InternalResourceViewResolver();
    resolver.setPrefix("/WEB-INF/jsp/");
    resolver.setSuffix(".jsp");
    return resolver;
  }
}
