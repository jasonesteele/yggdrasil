package yggdrasil.mail;

import java.util.Locale;
import java.util.Map;

import javax.annotation.Resource;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

/**
 * Implemtation for e-mail service.
 *
 * @author jason
 */
@Component
public class MailServiceImpl implements MailService {
  @Resource
  private Environment env;

  @Resource
  private TemplateEngine templateEngine;

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

  @Override
  public void sendEmailTemplate(final String to, final String subject, final String template,
      final Map<String, ?> params) throws MessagingException {
    final Context context = new Context(Locale.getDefault(), params);
    sendEmail(to, subject, templateEngine.process(template, context));
  }
}
