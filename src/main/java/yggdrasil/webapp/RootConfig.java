package yggdrasil.webapp;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.ResourceBundleMessageSource;

import yggdrasil.dao.DaoConfig;

/**
 * Root configuration for application.
 *
 * @author jason
 */
@Configuration
@PropertySource("classpath:application.properties")
@Import(DaoConfig.class)
@ComponentScan
public class RootConfig {
  @Bean
  public ResourceBundleMessageSource messageSource() {
    final ResourceBundleMessageSource messages = new ResourceBundleMessageSource();
    messages.setBasenames("i18n/app");
    return messages;
  }
}
