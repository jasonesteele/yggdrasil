package yggdrasil.mvc.api.dto;

import com.wordnik.swagger.annotations.ApiModel;
import com.wordnik.swagger.annotations.ApiModelProperty;

/**
 * User resource used to create a new user account.
 *
 * @author jason
 */
@ApiModel(value = "New User", description = "New user resource representation")
public class NewUserResource {
  /** E-mail address for user. */
  @ApiModelProperty(value = "User's e-mail address")
  private String email;
  /** Unique login name for user. */
  @ApiModelProperty(value = "User's login name")
  private String username;
  /** Initial password for user. */
  @ApiModelProperty(value = "User's initial password")
  private String password;

  /**
   * Default constructor.
   */
  public NewUserResource() {
  }

  /**
   * Creates the new user resource.
   *
   * @param username
   *          login id for user
   * @param email
   *          user email
   * @param password
   *          user password
   */
  public NewUserResource(final String username, final String email, final String password) {
    this.email = email;
    this.username = username;
    this.password = password;
  }

  public String getEmail() {
    return email;
  }

  public String getPassword() {
    return password;
  }

  public String getUsername() {
    return username;
  }

  public void setEmail(final String email) {
    this.email = email;
  }

  public void setPassword(final String password) {
    this.password = password;
  }

  public void setUsername(final String username) {
    this.username = username;
  }

  @Override
  public String toString() {
    return username;
  }
}
