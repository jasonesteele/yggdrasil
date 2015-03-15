package yggdrasil.scheduler.jobs;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.Before;
import org.junit.Test;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.test.util.ReflectionTestUtils;

import yggdrasil.dao.AccountVerificationDao;

/**
 * Unit tests for {@link ReapExpiredVerificationLinksJob}.
 *
 * @author jason
 */
public class ReapExpiredVerificationLinksJobTest {
  /** Object under test. */
  private ReapExpiredVerificationLinksJob job;

  /** Mock DAO. */
  private AccountVerificationDao dao;

  /** Mock job execution context. */
  private JobExecutionContext jobContext;

  @Before
  public void setup() {
    job = new ReapExpiredVerificationLinksJob();
    dao = mock(AccountVerificationDao.class);

    ReflectionTestUtils.setField(job, "verificationDao", dao);

    jobContext = mock(JobExecutionContext.class);
  }

  @Test
  public void testExecuteWithDefaults() throws JobExecutionException {
    when(dao.deleteExpiredVerifications()).thenReturn(10);

    job.execute(jobContext);

    verify(dao).deleteExpiredVerifications();
  }
}
