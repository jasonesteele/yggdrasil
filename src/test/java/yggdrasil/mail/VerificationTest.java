package yggdrasil.mail;

import javax.annotation.Resource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import yggdrasil.dao.AccountVerificationDao;
import yggdrasil.dao.UserDao;
import yggdrasil.model.AccountVerification;
import yggdrasil.model.User;
import yggdrasil.webapp.RootConfig;

/**
 * Test cases for account verifications.
 *
 * @author jason
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = { RootConfig.class })
public class VerificationTest {
  /** Class logger. */
  private static final Logger log = LoggerFactory.getLogger(VerificationTest.class);

  @Resource
  private AccountVerificationDao verificationDao;

  @Resource
  private UserDao userDao;

  @Test
  public void testVerification() {
    final User admin = userDao.findByName("admin");
    final String key = verificationDao.createVerification(admin.getId(), 360);
    log.info("created account verification " + key);
    final AccountVerification verification = verificationDao.get(key);
    log.info("retrieved account verification " + verification);
    verification.setDisabled(true);
    verificationDao.update(verification);
    log.info("disabled account verification " + verification);
  }
}
