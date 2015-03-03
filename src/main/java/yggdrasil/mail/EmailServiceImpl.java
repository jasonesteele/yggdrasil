package yggdrasil.mail;

import javax.annotation.Resource;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

/**
 * Implemtation for e-mail service.
 *
 * @author jason
 */
@Component
@PropertySource("classpath:email.properties")
public class EmailServiceImpl implements EmailService {
  @Resource
  private Environment env;

  @Resource
  private JavaMailSender sender;

  @Override
  public void sendEmail(final String to, final String subject, final String body)
      throws MessagingException {
    final MimeMessage mimeMessage = sender.createMimeMessage();
    final MimeMessageHelper message = new MimeMessageHelper(mimeMessage);
    message.setFrom(env.getProperty("mail.smtp.sender"));
    message.setTo(to);
    message.setSubject(subject);
    message.setText(body, true);
    sender.send(mimeMessage);
  }
}
