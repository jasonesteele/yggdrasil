package yggdrasil.mvc.resources;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import yggdrasil.model.User;

/**
 * A collection of users.
 *
 * @author jason
 */
public class UserListResource {
  /** List of user resources. */
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
