package yggdrasil.mvc.api.dto;

import com.wordnik.swagger.annotations.ApiModel;
import com.wordnik.swagger.annotations.ApiModelProperty;

/**
 * E-mail address resource.
 *
 * @author jason
 */
@ApiModel(value = "Email address", description = "User e-mail address")
public class EmailResource {
  /** E-mail address for user. */
  @ApiModelProperty(value = "An e-mail address")
  private String email;

  /**
   * Default constructor.
   */
  public EmailResource() {
  }

  /**
   * Creates the new email resource.
   *
   * @param email
   *          user email
   */
  public EmailResource(final String email) {
    this.email = email;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(final String email) {
    this.email = email;
  }

  @Override
  public String toString() {
    return email;
  }
}
