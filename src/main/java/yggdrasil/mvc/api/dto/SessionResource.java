package yggdrasil.mvc.api.dto;

import java.util.ArrayList;
import java.util.List;

import com.wordnik.swagger.annotations.ApiModel;
import com.wordnik.swagger.annotations.ApiModelProperty;

/**
 * Information about the user session.
 *
 * @author jason
 */
@ApiModel(value = "Session", description = "Session resource representation")
public class SessionResource {
  @ApiModelProperty(value = "User's login name")
  private String username;

  @ApiModelProperty(value = "User's email address")
  private String email;

  @ApiModelProperty(value = "Roles assigned to the user")
  private List<String> roles = new ArrayList<String>();

  /**
   * Default constructor.
   */
  public SessionResource() {
  }

  public String getEmail() {
    return email;
  }

  public List<String> getRoles() {
    return roles;
  }

  public String getUsername() {
    return username;
  }

  public void setEmail(final String email) {
    this.email = email;
  }

  public void setRoles(final List<String> roles) {
    this.roles = roles;
  }

  public void setUsername(final String username) {
    this.username = username;
  }

  @Override
  public String toString() {
    return username;
  }
}
