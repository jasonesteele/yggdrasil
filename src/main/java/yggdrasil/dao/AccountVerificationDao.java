package yggdrasil.dao;

import yggdrasil.model.AccountVerification;

/**
 * Data access object for account verification requests.
 *
 * @author jason
 */
public interface AccountVerificationDao extends AbstractDao<AccountVerification, String> {
  /**
   * Creates a new account verification for a user. Any existing account
   * verification links are disabled.
   *
   * @param user
   *          userId to create account verification for
   * @param validFor
   *          amount of time the verification will be valid for, in minutes
   * @return ID for newly created account verification
   */
  String createVerification(Long userId, int validFor);

  /**
   * Deletes all expired account verifications.
   *
   * @return number of verifications deleted
   */
  int deleteExpiredVerifications();

  /**
   * Deletes all account verifications for a user, e.g. after a successful
   * login.
   *
   * @param userId
   *          user id to clear all verifications for
   * @return number of verifications deleted
   */
  int deleteVerificationsFor(Long userId);

  /**
   * Finds the most recent account verification request for a user, if one
   * exists.
   *
   * @param userId
   *          id of user the search for
   * @return most recent account verification or <code>null</code> if there are
   *         none
   */
  AccountVerification findMostRecentForUser(Long userId);
}
