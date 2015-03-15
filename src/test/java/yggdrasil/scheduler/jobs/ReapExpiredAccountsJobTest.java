package yggdrasil.scheduler.jobs;

import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.lessThanOrEqualTo;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Date;

import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.mock.env.MockEnvironment;
import org.springframework.test.util.ReflectionTestUtils;

import yggdrasil.dao.UserDao;

/**
 * Unit tests for {@link ReapExpiredAccountsJobTest}.
 *
 * @author jason
 */
public class ReapExpiredAccountsJobTest {
  /** Error threshold for date comparison, in ms. */
  private static final int EPSILON = 30000;

  /** Object under test. */
  private ReapExpiredAccountsJob job;

  /** Mock user DAO. */
  private UserDao userDao;

  /** Mock environment. */
  private MockEnvironment env;

  /** Mock job execution context. */
  private JobExecutionContext jobContext;

  @Before
  public void setup() {
    job = new ReapExpiredAccountsJob();
    env = new MockEnvironment();
    userDao = mock(UserDao.class);

    ReflectionTestUtils.setField(job, "userDao", userDao);
    ReflectionTestUtils.setField(job, "env", env);

    jobContext = mock(JobExecutionContext.class);
  }

  @Test
  public void testExecuteWithDefaults() throws JobExecutionException {
    when(userDao.deleteUnverifiedCreatedBefore(any(Date.class))).thenReturn(1);

    job.execute(jobContext);

    final ArgumentCaptor<Date> arg = ArgumentCaptor.forClass(Date.class);
    verify(userDao).deleteUnverifiedCreatedBefore(arg.capture());
    final Date expireDate = new Date(System.currentTimeMillis() - 24 * 60 * 60 * 1000);
    assertThat(arg.getValue(), lessThanOrEqualTo(expireDate));
    assertThat(arg.getValue(), greaterThan(new Date(expireDate.getTime() - EPSILON)));
  }

  @Test
  public void testExecuteWithLongerExpire() throws JobExecutionException {
    when(userDao.deleteUnverifiedCreatedBefore(any(Date.class))).thenReturn(1);
    env.setProperty("account.unverified.expiration", "48");

    job.execute(jobContext);

    final ArgumentCaptor<Date> arg = ArgumentCaptor.forClass(Date.class);
    verify(userDao).deleteUnverifiedCreatedBefore(arg.capture());
    final Date expireDate = new Date(System.currentTimeMillis() - 48 * 60 * 60 * 1000);
    assertThat(arg.getValue(), lessThanOrEqualTo(expireDate));
    assertThat(arg.getValue(), greaterThan(new Date(expireDate.getTime() - 30000)));
  }

  @Test
  public void testExecuteWithShorterExpire() throws JobExecutionException {
    when(userDao.deleteUnverifiedCreatedBefore(any(Date.class))).thenReturn(1);
    env.setProperty("account.unverified.expiration", "12");

    job.execute(jobContext);

    final ArgumentCaptor<Date> arg = ArgumentCaptor.forClass(Date.class);
    verify(userDao).deleteUnverifiedCreatedBefore(arg.capture());
    final Date expireDate = new Date(System.currentTimeMillis() - 12 * 60 * 60 * 1000);
    assertThat(arg.getValue(), lessThanOrEqualTo(expireDate));
    assertThat(arg.getValue(), greaterThan(new Date(expireDate.getTime() - 30000)));
  }
}
