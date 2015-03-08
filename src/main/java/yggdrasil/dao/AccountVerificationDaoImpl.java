package yggdrasil.dao;

import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.UUID;

import javax.annotation.Resource;

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
  @Resource
  private UserDao userDao;

  @Override
  public void clearVerifications(final Long userId) {
    getSession().createQuery("delete from AccountVerification av where av.user.id = :id")
        .setLong("id", userId).executeUpdate();
  }

  @Override
  public String createVerification(final Long userId, final int validFor) {
    clearVerifications(userId);
    final User user = userDao.get(userId);
    final AccountVerification av = new AccountVerification();
    av.setUser(user);
    final Calendar cal = new GregorianCalendar();
    cal.add(Calendar.MINUTE, validFor);
    av.setInvalidAfterTime(cal.getTime());
    av.setId(UUID.randomUUID().toString());
    return create(av);
  }

  @Override
  protected Class<AccountVerification> getEntityClass() {
    return AccountVerification.class;
  }
}
