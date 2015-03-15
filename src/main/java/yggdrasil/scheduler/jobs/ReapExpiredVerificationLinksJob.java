package yggdrasil.scheduler.jobs;

import javax.annotation.Resource;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import yggdrasil.dao.AccountVerificationDao;
import yggdrasil.scheduler.SystemJob;

/**
 * This scheduled job reaps all expired account verification links.
 *
 * @author jason
 */
@SystemJob(value = "reapExpiredVerificationLinks", description = "Reaps expired account verification links.")
public class ReapExpiredVerificationLinksJob implements Job {
  @Resource
  private AccountVerificationDao verificationDao;

  @Override
  public void execute(final JobExecutionContext context) throws JobExecutionException {
    verificationDao.deleteExpiredVerifications();
  }
}
