package yggdrasil.mvc;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import com.mangofactory.swagger.configuration.SpringSwaggerConfig;
import com.mangofactory.swagger.models.dto.ApiInfo;
import com.mangofactory.swagger.models.dto.ResponseMessage;
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
@EnableGlobalMethodSecurity(prePostEnabled = true, proxyTargetClass = true)
@EnableTransactionManagement
@PropertySource("classpath:swagger.properties")
public class MvcServletConfig extends WebMvcConfigurerAdapter {
  @Resource
  private Environment env;

  @Resource
  private SpringSwaggerConfig springSwaggerConfig;

  @Override
  public void addResourceHandlers(final ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/css/**").addResourceLocations("/WEB-INF/css/")
        .setCachePeriod(2592000);
    registry.addResourceHandler("/images/**").addResourceLocations("/WEB-INF/images/")
        .setCachePeriod(2592000);
    registry.addResourceHandler("/js/**").addResourceLocations("/WEB-INF/js/")
        .setCachePeriod(2592000);
    registry.addResourceHandler("/fonts/**").addResourceLocations("/WEB-INF/fonts/")
        .setCachePeriod(2592000);
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
        .apiInfo(apiInfo()).includePatterns("/api/*");

    swaggerPlugin.apiVersion(env.getProperty("swagger.apiVersion", "0.0"));

    final List<ResponseMessage> globalPostResponses = new ArrayList<ResponseMessage>();
    globalPostResponses.add(new ResponseMessage(HttpStatus.OK.value(), "Request was successful.",
        null));
    globalPostResponses.add(new ResponseMessage(HttpStatus.UNAUTHORIZED.value(),
        "Authorization is required to access the resource.", null));
    globalPostResponses.add(new ResponseMessage(HttpStatus.FORBIDDEN.value(),
        "Access to the resource is forbidden.  The caller has insufficient privilege.", null));

    final List<ResponseMessage> globalResponses = new ArrayList<ResponseMessage>(
        globalPostResponses);
    globalResponses.add(new ResponseMessage(HttpStatus.NOT_FOUND.value(),
        "The requested resource was not found.", null));

    swaggerPlugin.globalResponseMessage(RequestMethod.POST, globalPostResponses);
    swaggerPlugin.globalResponseMessage(RequestMethod.DELETE, globalPostResponses);
    swaggerPlugin.globalResponseMessage(RequestMethod.PUT, globalResponses);
    swaggerPlugin.globalResponseMessage(RequestMethod.GET, globalResponses);

    return swaggerPlugin;
  }
}
