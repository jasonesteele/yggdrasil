package yggdrasil.dao;

import javax.persistence.EntityNotFoundException;

import yggdrasil.model.User;

/**
 * Data access object for users.
 *
 * @author jason
 */
public interface UserDao extends AbstractDao<User, Long> {
  /**
   * Finds a user by e-mail address.
   *
   * @param email
   * @return user
   * @throws EntityNotFoundException
   *           if no such user is found
   */
  User findByEmail(String email);

  /**
   * Finds a user by username.
   *
   * @param username
   * @return user
   * @throws EntityNotFoundException
   *           if no such user is found
   */
  User findByName(String username);
}
