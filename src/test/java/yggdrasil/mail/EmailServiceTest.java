package yggdrasil.mail;

import java.util.HashMap;
import java.util.Map;

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
@ContextConfiguration(classes = { MailConfig.class, ThymeleafMailConfig.class })
public class EmailServiceTest {
  @Resource
  private MailService service;

  @Test
  public void sendHello() throws MessagingException {
    final Map<String, Object> params = new HashMap<String, Object>();
    params.put("appName", "Yggdrasil");
    params.put("username", "loiosh123");
    params.put("verificationUrl", "http://localhost:8080/yggdrasil/v/lajljljlk");
    service.sendEmailTemplate("jasonesteele@gmail.com", "ping!", "verification", params);
  }
}
