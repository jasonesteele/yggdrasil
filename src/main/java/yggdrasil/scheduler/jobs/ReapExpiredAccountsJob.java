package yggdrasil.scheduler.jobs;

import javax.annotation.Resource;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import yggdrasil.dao.UserDao;
import yggdrasil.scheduler.SystemJob;

/**
 * This scheduled job
 *
 * @author jason
 */
@SystemJob(value = "reapUnverifiedAccounts", description = "Reaps unverified accounts that are older than a certain threshold.")
public class ReapExpiredAccountsJob implements Job {
  /** Class logger. */
  private static final Logger log = LoggerFactory.getLogger(ReapExpiredAccountsJob.class);

  @Resource
  private UserDao userDao;

  @Override
  public void execute(final JobExecutionContext context) throws JobExecutionException {
    log.info("userDao = " + userDao);
    // TODO: implement reaper task
  }
}
