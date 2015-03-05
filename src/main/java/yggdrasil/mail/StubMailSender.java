package yggdrasil.mail;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.Properties;

import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.MailParseException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMailMessage;
import org.springframework.mail.javamail.MimeMessagePreparator;

/**
 * Mock e-mail sender for development and local testing. System e-mails are only
 * sent to the "email" logger.
 *
 * @author jason
 */
public class StubMailSender implements JavaMailSender {
  /** Class logger. */
  private static final Logger emailLog = LoggerFactory.getLogger("email");
  private Session session;

  @Override
  public MimeMessage createMimeMessage() {
    return new MimeMessage(getSession());
  }

  @Override
  public MimeMessage createMimeMessage(final InputStream contentStream) throws MailException {
    try {
      return new MimeMessage(getSession(), contentStream);
    } catch (Exception ex) {
      throw new MailParseException("Could not parse raw MIME content", ex);
    }
  }

  /**
   * Return the JavaMail {@code Session}, lazily initializing it if hasn't been
   * specified explicitly.
   */
  public synchronized Session getSession() {
    if (this.session == null) {
      this.session = Session.getInstance(new Properties());
    }
    return this.session;
  }

  @Override
  public void send(final MimeMessage mimeMessage) throws MailException {
    try (final ByteArrayOutputStream os = new ByteArrayOutputStream()) {
      mimeMessage.writeTo(os);
      emailLog.info(new String(os.toByteArray(), Charset.forName("US-ASCII")));
    } catch (IOException | MessagingException e) {
      throw new MailSendException("error serializing MIME message", e);
    }
  }

  @Override
  public void send(final MimeMessage... mimeMessages) throws MailException {
    for (MimeMessage msg : mimeMessages) {
      send(msg);
    }
  }

  @Override
  public void send(final MimeMessagePreparator mimeMessagePreparator) throws MailException {
    try {
      final MimeMessage msg = new MimeMessage(getSession());
      mimeMessagePreparator.prepare(msg);
      send(msg);
    } catch (Exception ex) {
      throw new MailParseException("Could not parse raw MIME content", ex);
    }
  }

  @Override
  public void send(final MimeMessagePreparator... mimeMessagePreparators) throws MailException {
    for (MimeMessagePreparator mimeMessagePreporator : mimeMessagePreparators) {
      send(mimeMessagePreporator);
    }
  }

  @Override
  public void send(final SimpleMailMessage simpleMessage) throws MailException {
    final MimeMailMessage message = new MimeMailMessage(createMimeMessage());
    simpleMessage.copyTo(message);
    send(message.getMimeMessage());
  }

  @Override
  public void send(final SimpleMailMessage... simpleMessages) throws MailException {
    for (SimpleMailMessage msg : simpleMessages) {
      send(msg);
    }
  }
}
