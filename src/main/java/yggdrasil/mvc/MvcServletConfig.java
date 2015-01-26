package yggdrasil.mvc;

import javax.annotation.Resource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import com.mangofactory.swagger.configuration.SpringSwaggerConfig;
import com.mangofactory.swagger.models.dto.ApiInfo;
import com.mangofactory.swagger.plugin.EnableSwagger;
import com.mangofactory.swagger.plugin.SwaggerSpringMvcPlugin;

/**
 * Configuration for Spring MVC dispatcher servlet.
 *
 * @author jason
 */
@EnableWebMvc
@EnableSwagger
@Configuration
@ComponentScan
@PropertySource("classpath:swagger.properties")
public class MvcServletConfig extends WebMvcConfigurerAdapter {
  @Resource
  private Environment env;

  @Resource
  private SpringSwaggerConfig springSwaggerConfig;

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

  @Bean
  public ApiInfo apiInfo() {
    return new ApiInfo("Yggdrasil REST API", "REST API for Yggdrasil back-end",
        "Yggdrasil Terms of Service", "ygdrassil-dev@darthgeek.us", "Yggdrasil License",
        "Yggdrasil License");
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

  @Bean
  public SwaggerSpringMvcPlugin swaggerPlugin() {
    final SwaggerSpringMvcPlugin swaggerPlugin = new SwaggerSpringMvcPlugin(springSwaggerConfig)
        .apiInfo(apiInfo()).includePatterns("/api/*", "/admin/api/.*");

    swaggerPlugin.apiVersion(env.getProperty("swagger.apiVersion", "0.0"));

    return swaggerPlugin;
  }
}
