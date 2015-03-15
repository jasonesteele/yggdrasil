package yggdrasil.controller;

import static org.hamcrest.Matchers.equalTo;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Date;

import org.junit.Before;
import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;

import yggdrasil.dao.AccountVerificationDao;
import yggdrasil.dao.UserDao;
import yggdrasil.model.AccountVerification;
import yggdrasil.model.User;
import yggdrasil.mvc.controller.AccountVerificationController;

/**
 * Unit tests for {@link AccountVerificationController}.
 *
 * @author jason
 */
public class AccountVerificationControllerTest {
  /** Object under test. */
  private AccountVerificationController controller;

  /** Mock user data access object. */
  private UserDao userDao;

  /** Mock verification data access object. */
  private AccountVerificationDao verificationDao;

  @Before
  public void setup() {
    controller = new AccountVerificationController();
    userDao = mock(UserDao.class);
    verificationDao = mock(AccountVerificationDao.class);
    ReflectionTestUtils.setField(controller, "userDao", userDao);
    ReflectionTestUtils.setField(controller, "verificationDao", verificationDao);
  }

  @Test
  public void testExpiredVerification() {
    final AccountVerification verification = new AccountVerification();
    verification.setInvalidAfterTime(new Date(System.currentTimeMillis() - 10000));
    final User user = new User();
    user.setId(1L);
    user.setEmailVerified(false);
    verification.setUser(user);
    when(verificationDao.get("ZZFOO")).thenReturn(verification);

    final String page = controller.getVerificationPage("ZZFOO");

    assertThat(page, equalTo("redirect:/page/error/verification?expired"));
    assertThat(user.isEmailVerified(), equalTo(false));
  }

  @Test
  public void testInvalidVerification() {
    when(verificationDao.get("ZZFOO")).thenReturn(null);

    final String page = controller.getVerificationPage("ZZFOO");

    assertThat(page, equalTo("redirect:/page/error/verification?invalid"));
  }

  @Test
  public void testVerifyUnverifiedUser() {
    final AccountVerification verification = new AccountVerification();
    verification.setInvalidAfterTime(new Date(System.currentTimeMillis() + 10000));
    final User user = new User();
    user.setId(1L);
    user.setEmailVerified(false);
    verification.setUser(user);
    when(verificationDao.get("ZZFOO")).thenReturn(verification);

    final String page = controller.getVerificationPage("ZZFOO");

    assertThat(page, equalTo("redirect:/page/verified"));
    assertThat(user.isEmailVerified(), equalTo(true));
    verify(userDao).update(user);
    verify(verificationDao).deleteVerificationsFor(user.getId());
  }
}
