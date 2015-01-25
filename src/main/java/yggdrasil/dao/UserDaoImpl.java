package yggdrasil.dao;

import java.util.List;

import javax.persistence.EntityNotFoundException;

import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Repository;

import yggdrasil.model.User;

/**
 * Data access object implementation for users.
 *
 * @author jason
 */
@Repository("userDao")
public class UserDaoImpl extends AbstractDaoImpl<User, Long> implements UserDao, UserDetailsService {

  @Override
  public User findByName(final String username) {
    final Session session = getSession();

    // @formatter:off
    @SuppressWarnings("unchecked")
    final List<User> results =
        session.createCriteria(getEntityClass())
          .add(Restrictions.eq("username", username))
          .list();
    // @formatter:on

    if (results.size() == 0) {
      throw new EntityNotFoundException("username " + username + " not found");
    } else {
      return results.get(0);
    }
  }

  @Override
  protected Class<User> getEntityClass() {
    return User.class;
  }

  @Override
  public UserDetails loadUserByUsername(final String username) throws UsernameNotFoundException {
    final Session session = getSession();

    // @formatter:off
    @SuppressWarnings("unchecked")
    final List<User> results =
        session.createCriteria(getEntityClass())
          .add(Restrictions.eq("username", username))
          .list();
    // @formatter:on

    if (results.size() == 0) {
      throw new UsernameNotFoundException("username " + username + " not found");
    } else {
      final User user = results.get(0);
      // Walk relationships to force load of permissions for spring-security
      user.getAuthorities();
      return user;
    }
  }
}
