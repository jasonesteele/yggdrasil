package yggdrasil.webapp;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import yggdrasil.dao.DaoConfig;
import yggdrasil.jmx.JmxConfig;
import yggdrasil.mail.MailConfig;
import yggdrasil.scheduler.SchedulerConfig;

/**
 * Root configuration for application.
 *
 * @author jason
 */
@Configuration
@PropertySource("classpath:application.properties")
@Import({ DaoConfig.class, MailConfig.class, JmxConfig.class, SchedulerConfig.class })
@ComponentScan
@EnableTransactionManagement
public class RootConfig {
  @Bean
  public ResourceBundleMessageSource messageSource() {
    final ResourceBundleMessageSource messages = new ResourceBundleMessageSource();
    messages.setBasenames("i18n/app");
    return messages;
  }
}
