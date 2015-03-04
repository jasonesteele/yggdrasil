package yggdrasil.mvc.controller;

import java.util.HashSet;
import java.util.Set;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.servlet.ViewResolver;
import org.thymeleaf.dialect.IDialect;
import org.thymeleaf.extras.springsecurity3.dialect.SpringSecurityDialect;
import org.thymeleaf.spring4.SpringTemplateEngine;
import org.thymeleaf.spring4.view.ThymeleafViewResolver;
import org.thymeleaf.templateresolver.ServletContextTemplateResolver;
import org.thymeleaf.templateresolver.TemplateResolver;

@Configuration
@PropertySource("classpath:thymeleaf.properties")
public class ThymeleafServletConfig {
  @Bean
  public Set<IDialect> dialects() {
    final Set<IDialect> sets = new HashSet<IDialect>();
    sets.add(new SpringSecurityDialect());
    return sets;
  }

  @Bean
  public SpringTemplateEngine templateEngine() {
    final SpringTemplateEngine templateEngine = new SpringTemplateEngine();
    templateEngine.addTemplateResolver(templateResolver());
    templateEngine.setAdditionalDialects(dialects());
    return templateEngine;
  }

  @Bean
  public TemplateResolver templateResolver() {
    final ServletContextTemplateResolver templateResolver = new ServletContextTemplateResolver();
    templateResolver.setPrefix("/WEB-INF/templates/");
    templateResolver.setSuffix(".html");
    templateResolver.setTemplateMode("LEGACYHTML5");
    return templateResolver;
  }

  @Bean
  public ViewResolver viewResolver() {
    ThymeleafViewResolver viewResolver = new ThymeleafViewResolver();
    viewResolver.setTemplateEngine(templateEngine());
    viewResolver.setOrder(1);
    return viewResolver;
  }
}
