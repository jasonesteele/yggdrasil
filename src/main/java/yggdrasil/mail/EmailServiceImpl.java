package yggdrasil.mail;

import javax.annotation.Resource;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

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
public class EmailServiceImpl implements EmailService {
  @Resource
  private Environment env;

  @Resource
  private JavaMailSender sender;

  /**
   * Determines the sender e-mail address to attach to system emails.
   *
   * @return system email address
   */
  private String getSenderEmail() {
    final StringBuilder sb = new StringBuilder();
    if (env.containsProperty("mail.sender.name")) {
      sb.append(env.getProperty("mail.sender.name"));
      sb.append(" <");
    }
    sb.append(env.getProperty("mail.sender.email"));
    if (env.containsProperty("mail.sender.name")) {
      sb.append(">");
    }
    return sb.toString();
  }

  @Override
  public void sendEmail(final String to, final String subject, final String body)
      throws MessagingException {
    final MimeMessage mimeMessage = sender.createMimeMessage();
    final MimeMessageHelper message = new MimeMessageHelper(mimeMessage);
    message.setFrom(getSenderEmail());
    message.setTo(to);
    message.setSubject(subject);
    message.setText(body, true);
    sender.send(mimeMessage);
  }
}
