package yggdrasil.mvc.exception;

/**
 * This exception is thrown when a request for an account verification is made
 * too recently after the previous request.
 *
 * @author jason
 */
@SuppressWarnings("serial")
public class VerificationHoldoffException extends Exception {
  private long minutes;

  public VerificationHoldoffException(final long minutes) {
    super("Can not request a new verification yet");
    this.minutes = minutes;
  }

  public long getMinutes() {
    return minutes;
  }

  public void setMinutes(final long minutes) {
    this.minutes = minutes;
  }
}
