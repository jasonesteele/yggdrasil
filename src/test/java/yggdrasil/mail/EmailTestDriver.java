package yggdrasil.mail;

import javax.annotation.Resource;
import javax.mail.MessagingException;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * Tests sending of e-mail through Spring integration.
 *
 * @author jason
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = EmailConfig.class)
public class EmailTestDriver {
  @Resource
  private EmailService service;

  @Test
  public void sendEmail() throws MessagingException {
    service.sendEmail("jasonesteele@gmail.com", "Test Subject", "<h1>Header</h1>");
  }
}
