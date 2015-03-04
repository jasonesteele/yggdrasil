package yggdrasil.mail;

import javax.annotation.Resource;
import javax.mail.MessagingException;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * Sends an e-mail through the system e-mail service.
 *
 * @author jason
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = EmailConfig.class)
public class EmailServiceDriver {
  @Resource
  EmailService service;

  @Test
  public void sendHello() throws MessagingException {
    service.sendEmail("jasonesteele@gmail.com", "ping!", "<h1>this is the body</h1>");
  }
}
