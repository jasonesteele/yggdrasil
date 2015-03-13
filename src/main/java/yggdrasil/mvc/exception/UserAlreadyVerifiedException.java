package yggdrasil.mvc.exception;

/**
 * This exception is thrown when there is an attempt to generate an account
 * verification for an account that is already verified.
 *
 * @author jason
 */
@SuppressWarnings("serial")
public class UserAlreadyVerifiedException extends Exception {
  /**
   * Constructs a new exception with the specified detail message. The cause is
   * not initialized, and may subsequently be initialized by a call to
   * {@link #initCause}.
   *
   * @param message
   *          the detail message. The detail message is saved for later
   *          retrieval by the {@link #getMessage()} method.
   */
  public UserAlreadyVerifiedException(final String message) {
    super(message);
  }
}
