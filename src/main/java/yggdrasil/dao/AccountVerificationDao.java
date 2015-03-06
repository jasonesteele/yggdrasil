package yggdrasil.dao;

import yggdrasil.model.AccountVerification;

/**
 * Data access object for account verification requests.
 *
 * @author jason
 */
public interface AccountVerificationDao extends AbstractDao<AccountVerification, String> {
  /**
   * Disables all account verifications for a user, e.g. after a successful
   * login.
   *
   * @param userId
   *          user id to clear all verifications for
   */
  void clearVerifications(Long userId);

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
}
