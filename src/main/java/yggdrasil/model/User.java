package yggdrasil.model;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.TreeSet;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotBlank;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * A user of the application.
 *
 * @author jason
 */
@SuppressWarnings("serial")
@Entity
public class User implements UserDetails {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @Column(nullable = false, unique = true)
  @Email
  @NotBlank
  private String email;

  @Column(nullable = false, unique = true)
  @NotBlank
  private String username;

  @Column(nullable = false)
  private String password;

  @Column
  private boolean enabled = true;

  @ManyToMany(fetch = FetchType.LAZY)
  private Set<Role> roles = new TreeSet<Role>();

  /**
   * Default constructor.
   */
  public User() {
  }

  @Override
  public boolean equals(final Object obj) {
    if (this == obj) {
      return true;
    }
    if (obj == null) {
      return false;
    }
    if (!(obj instanceof User)) {
      return false;
    }
    User other = (User) obj;
    if (email == null) {
      if (other.email != null) {
        return false;
      }
    } else if (!email.equals(other.email)) {
      return false;
    }
    return true;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    final Set<GrantedAuthority> authorities = new HashSet<GrantedAuthority>();
    authorities.addAll(getPermissions());
    for (Role role : getRoles()) {
      authorities.add(role);
    }
    return authorities;
  }

  public String getEmail() {
    return email;
  }

  public Long getId() {
    return id;
  }

  @Override
  public String getPassword() {
    return password;
  }

  public Set<Permission> getPermissions() {
    final Set<Permission> permissions = new HashSet<Permission>();
    for (Role role : getRoles()) {
      permissions.addAll(role.getPermissions());
    }
    return permissions;
  }

  public Set<Role> getRoles() {
    return roles;
  }

  @Override
  public String getUsername() {
    return username;
  }

  @Override
  public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + ((email == null) ? 0 : email.hashCode());
    return result;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return enabled;
  }

  public void setEmail(final String email) {
    this.email = email;
  }

  public void setEnabled(final boolean enabled) {
    this.enabled = enabled;
  }

  public void setId(final Long id) {
    this.id = id;
  }

  public void setPassword(final String password) {
    this.password = password;
  }

  public void setRoles(final Set<Role> roles) {
    this.roles = roles;
  }

  public void setUsername(final String username) {
    this.username = username;
  }

  @Override
  public String toString() {
    return email;
  }
}
