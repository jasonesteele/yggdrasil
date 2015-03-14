package yggdrasil.scheduler.jobs;

import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;

import yggdrasil.dao.UserDao;
import yggdrasil.model.User;
import yggdrasil.scheduler.SystemJob;

/**
 * This scheduled job reaps any unverified user accounts that have been created
 * more than <code>account.unverified.expiration</code> hours ago (default: 24).
 *
 * @author jason
 */
@SystemJob(value = "reapUnverifiedAccounts", description = "Reaps unverified accounts that are older than a certain threshold.")
public class ReapExpiredAccountsJob implements Job {
  /** Class logger. */
  private static final Logger log = LoggerFactory.getLogger(ReapExpiredAccountsJob.class);

  @Resource
  private Environment env;

  @Resource
  private UserDao userDao;

  @Override
  public void execute(final JobExecutionContext context) throws JobExecutionException {
    final long accountExpirationMs = env.getProperty("account.unverified.expiration", Long.class,
        24L) * 60 * 60 * 1000;
    final Date expirationTime = new Date(System.currentTimeMillis() - accountExpirationMs);

    final List<User> users = userDao.findUnverifiedCreatedBefore(expirationTime);
    if (users.size() == 0) {
      log.debug("no unverified users");
    }
    for (User user : users) {
      log.info(String.format("reaping unverified account %s [email=%s]", user.getUsername(),
          user.getEmail()));
      userDao.delete(user.getId());
    }
  }
}
