package yggdrasil.mail;

import javax.annotation.Resource;
import javax.mail.MessagingException;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

/**
 * Sends an e-mail through the system e-mail service.
 *
 * @author jason
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = { EmailConfig.class, ThymeleafMailConfig.class })
public class EmailServiceTest {
  @Resource
  private EmailService service;

  @Resource
  private TemplateEngine templateEngine;

  @Test
  public void sendHello() throws MessagingException {
    final Context context = new Context();
    context.setVariable("appName", "Yggdrasil");
    context.setVariable("username", "loiosh123");
    context.setVariable("verificationUrl",
        "http://localhost:8080/yggdrasil/v/lajljljlksjdlkfjaljflj3lkj3klj3");
    final String body = templateEngine.process("verification", context);
    service.sendEmail("jasonesteele@gmail.com", "ping!", body);
  }
}
