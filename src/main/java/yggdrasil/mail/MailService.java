package yggdrasil.mail;

import javax.mail.MessagingException;

/**
 * Service for sending system e-mail to users.
 *
 * @author jason
 */
public interface MailService {
  /**
   * Send an e-mail with HTML content to a user.
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
}
