package yggdrasil.mvc.resources;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import yggdrasil.model.User;

import com.wordnik.swagger.annotations.ApiModel;
import com.wordnik.swagger.annotations.ApiModelProperty;

/**
 * A collection of users.
 *
 * @author jason
 */
@ApiModel(value = "User List", description = "A list of User resource representations")
public class UserListResource {
  /** List of user resources. */
  @ApiModelProperty(value = "List of users")
  private List<UserResource> users = new ArrayList<UserResource>();

  /**
   * Default constructor.
   */
  public UserListResource() {
  }

  /**
   * Creates a user list resource from a list of domain objects.
   *
   * @param users
   *          list of users
   */
  public UserListResource(final Collection<? extends User> users) {
    for (User user : users) {
      this.users.add(new UserResource(user));
    }
  }

  public List<UserResource> getUsers() {
    return users;
  }

  public void setUsers(final List<UserResource> users) {
    this.users = users;
  }
}
