package yggdrasil.scheduler.jobs;

import javax.annotation.Resource;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.core.env.Environment;

import yggdrasil.dao.AccountVerificationDao;
import yggdrasil.scheduler.SystemJob;

/**
 *
 * @author jason
 */
@SystemJob(value = "reapExpiredVerificationLinks", description = "Reaps expired account verification links.")
public class ReapExpiredVerificationLinksJob implements Job {
  @Resource
  private Environment env;

  @Resource
  private AccountVerificationDao verificationDao;

  @Override
  public void execute(final JobExecutionContext context) throws JobExecutionException {
    verificationDao.deleteExpiredVerifications();
  }
}
