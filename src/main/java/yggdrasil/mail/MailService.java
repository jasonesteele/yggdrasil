package yggdrasil.mail;

import java.util.Map;

import javax.mail.MessagingException;

/**
 * Service for sending system e-mail to users.
 *
 * @author jason
 */
public interface MailService {
  /**
   * Sends an e-mail with HTML content to a user.
   *
   * @param to
   *          primary recipient for e-mail
   * @param subject
   *          subject for e-mail
   * @param body
   *          HTML text for body of e-mail
   * @throws MessagingException
   *           if there was an error sending the e-mail.
   */
  public void sendEmail(String to, String subject, String body) throws MessagingException;

  /**
   * Sends an e-mail with HTML content generated from a template.
   *
   * @param to
   *          primary recipient for e-mail
   * @param subject
   *          subject for e-mail
   * @param template
   *          name of e-mail template to send
   * @param params
   *          template substitution parameters
   * @throws MessagingException
   *           if there was an error sending the e-mail.
   */
  void sendEmailTemplate(final String to, final String subject, final String template,
      final Map<String, ?> params) throws MessagingException;
}
