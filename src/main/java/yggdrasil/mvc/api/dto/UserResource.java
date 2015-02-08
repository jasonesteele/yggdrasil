package yggdrasil.mvc.api.dto;

import yggdrasil.model.User;

import com.wordnik.swagger.annotations.ApiModel;
import com.wordnik.swagger.annotations.ApiModelProperty;

/**
 * User resource accessed by the REST API.
 *
 * @author jason
 */
@ApiModel(value = "User", description = "User resource representation")
public class UserResource {
  /** Unique internal user id. */
  @ApiModelProperty(value = "Primary key for user")
  private Long id;
  /** Unique login name for user. */
  @ApiModelProperty(value = "User's login name")
  private String username;
  /** E-mail address for user. */
  @ApiModelProperty(value = "User's e-mail address")
  private String email;
  /** True if user account is enabled. */
  @ApiModelProperty(value = "User account is enabled?")
  private Boolean isEnabled;

  /**
   * Default constructor.
   */
  public UserResource() {
  }

  /**
   * Creates the resource from the current values of a domain object.
   *
   * @param user
   *          domain user object
   */
  public UserResource(final User user) {
    id = user.getId();
    username = user.getUsername();
    email = user.getEmail();
    isEnabled = user.isEnabled();
  }

  public String getEmail() {
    return email;
  }

  public Long getId() {
    return id;
  }

  public Boolean getIsEnabled() {
    return isEnabled;
  }

  public String getUsername() {
    return username;
  }

  public void setEmail(final String email) {
    this.email = email;
  }

  public void setId(final Long id) {
    this.id = id;
  }

  public void setIsEnabled(final Boolean isEnabled) {
    this.isEnabled = isEnabled;
  }

  public void setUsername(final String username) {
    this.username = username;
  }

  @Override
  public String toString() {
    return username;
  }
}
