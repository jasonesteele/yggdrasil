package yggdrasil.dao;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.UUID;

import javax.annotation.Resource;

import org.hibernate.criterion.Restrictions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import yggdrasil.model.AccountVerification;
import yggdrasil.model.User;

/**
 * Implementation for the account verification data access object.
 *
 * @author jason
 */
@Repository("accountVerificationDao")
public class AccountVerificationDaoImpl extends AbstractDaoImpl<AccountVerification, String>
    implements AccountVerificationDao {
  /** Class logger. */
  private static final Logger log = LoggerFactory.getLogger(AccountVerificationDaoImpl.class);

  @Resource
  private UserDao userDao;

  @Override
  public String createVerification(final Long userId, final int validFor) {
    deleteVerificationsFor(userId);
    final User user = userDao.get(userId);
    final AccountVerification av = new AccountVerification();
    av.setUser(user);
    final Calendar cal = new GregorianCalendar();
    cal.add(Calendar.MINUTE, validFor);
    av.setInvalidAfterTime(cal.getTime());
    av.setId(UUID.randomUUID().toString());
    return create(av);
  }

  @SuppressWarnings("unchecked")
  @Override
  public int deleteExpiredVerifications() {
    // @formatter:off
    final List<AccountVerification> verifications = getSession().createCriteria(getEntityClass())
        .add(Restrictions.lt("invalidAfterTime", new Date()))
        .list();
    // @formatter:on

    for (AccountVerification verification : verifications) {
      log.info("Deleting expired account verification for " + verification.getUser().getUsername()
          + " [email=" + verification.getUser().getEmail() + "] " + verification.getId());
      delete(verification.getId());
    }
    return verifications.size();
  }

  @Override
  public int deleteVerificationsFor(final Long userId) {
    return getSession().createQuery("delete from AccountVerification av where av.user.id = :id")
        .setLong("id", userId).executeUpdate();
  }

  @Override
  protected Class<AccountVerification> getEntityClass() {
    return AccountVerification.class;
  }
}
