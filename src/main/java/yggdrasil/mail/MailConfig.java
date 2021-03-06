package yggdrasil.mail;

import javax.annotation.Resource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Spring configuration for system e-mail component.
 *
 * @author jason
 */
@Configuration
@ComponentScan
@EnableTransactionManagement
public class MailConfig {
  /**
   * Development and unit testing e-mail configuration for just logging e-mail.
   */
  @Configuration
  @Profile("!prod")
  public static class DevEmailConfig {
    @Bean
    public JavaMailSender mailSender() {
      return new StubMailSender();
    }
  }

  /**
   * Production e-mail configuration for SMTP.
   *
   * @author jason
   */
  @Configuration
  @Profile("prod")
  public static class SmtpEmailConfig {
    @Resource
    private Environment env;

    @Bean
    public JavaMailSender mailSender() {
      final JavaMailSenderImpl sender = new JavaMailSenderImpl();
      sender.setHost(env.getProperty("mail.smtp.host", "localhost"));
      final int port = env.getProperty("mail.smtp.port", Integer.class, 25);
      sender.setPort(port);
      if (env.containsProperty("mail.smtp.user")) {
        sender.setUsername(env.getProperty("mail.smtp.user"));
        sender.getJavaMailProperties().put("mail.smtp.auth", "true");
      }
      if (env.containsProperty("mail.smtp.password")) {
        sender.setPassword(env.getProperty("mail.smtp.password"));
        sender.getJavaMailProperties().put("mail.smtp.auth", "true");
      }
      if (env.getProperty("mail.smtp.ssl", Boolean.class, false)) {
        sender.getJavaMailProperties().put("mail.smtp.socketFactory.port", Integer.toString(port));
        sender.getJavaMailProperties().put("mail.smtp.socketFactory.class",
            "javax.net.ssl.SSLSocketFactory");
      }
      sender.setDefaultEncoding("UTF-8");
      return sender;
    }
  }
}
