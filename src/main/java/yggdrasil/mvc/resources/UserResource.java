package yggdrasil.mvc.resources;

import yggdrasil.model.User;

/**
 * User resource accessed by the REST API.
 *
 * @author jason
 */
public class UserResource {
  /** Unique internal user id. */
  private Long id;
  /** Unique login name for user. */
  private String username;
  /** E-mail address for user. */
  private String email;
  /** True if user account is enabled. */
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
