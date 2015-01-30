package yggdrasil.mvc.api;

import com.wordnik.swagger.annotations.ApiModel;
import com.wordnik.swagger.annotations.ApiModelProperty;

/**
 * Error messages returned by API calls when exceptions occur.
 *
 * @author jason
 */
@ApiModel(value = "Error", description = "User resource representation")
public class ApiError {
  @ApiModelProperty(value = "Short error message")
  private String message;

  @ApiModelProperty(value = "Error message")
  private String details;

  /**
   * Default constructor.
   */
  public ApiError() {
  }

  /**
   * Creates the error.
   *
   * @param message
   *          short error message
   */
  public ApiError(final String message) {
    this.message = message;
  }

  /**
   * Creates the error.
   *
   * @param message
   *          short error message
   * @param details
   *          detailed error message
   */
  public ApiError(final String message, final String details) {
    this.message = message;
    this.details = details;
  }

  public String getDetails() {
    return details;
  }

  public String getMessage() {
    return message;
  }

  public void setDetails(final String details) {
    this.details = details;
  }

  public void setMessage(final String message) {
    this.message = message;
  }
}
