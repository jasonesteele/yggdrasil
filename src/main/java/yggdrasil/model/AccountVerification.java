package yggdrasil.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

/**
 * An account verification request.
 *
 * @author jason
 */
@Entity
public class AccountVerification {
  @Id
  private String id;

  @ManyToOne
  private User user;

  @Column(nullable = false)
  private Date invalidAfterTime;

  @Column(nullable = false)
  private Date createdTime = new Date();

  @Override
  public boolean equals(final Object obj) {
    if (this == obj) {
      return true;
    }
    if (obj == null) {
      return false;
    }
    if (!(obj instanceof AccountVerification)) {
      return false;
    }
    AccountVerification other = (AccountVerification) obj;
    if (id == null) {
      if (other.id != null) {
        return false;
      }
    } else if (!id.equals(other.id)) {
      return false;
    }
    return true;
  }

  public Date getCreatedTime() {
    return new Date(createdTime.getTime());
  }

  public String getId() {
    return id;
  }

  public Date getInvalidAfterTime() {
    return new Date(invalidAfterTime.getTime());
  }

  public User getUser() {
    return user;
  }

  @Override
  public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + ((id == null) ? 0 : id.hashCode());
    return result;
  }

  public boolean isExpired() {
    return invalidAfterTime.before(new Date());
  }

  public void setCreatedTime(final Date createdTime) {
    this.createdTime = new Date(createdTime.getTime());
  }

  public void setId(final String id) {
    this.id = id;
  }

  public void setInvalidAfterTime(final Date invalidAfterTime) {
    this.invalidAfterTime = new Date(invalidAfterTime.getTime());
  }

  public void setUser(final User user) {
    this.user = user;
  }

  @Override
  public String toString() {
    final StringBuilder sb = new StringBuilder();
    sb.append(id);
    final Date now = new Date();
    if (isExpired()) {
      sb.append(" [expired]");
    } else {
      sb.append(" [valid for ");
      final long diffMs = invalidAfterTime.getTime() - now.getTime();
      final long diffS = (diffMs / 1000) % 60;
      final long diffM = (diffMs / (1000 * 60)) % 60;
      final long diffH = (diffMs / (1000 * 3600)) % 3600;
      sb.append(String.format("%d:%02d:%02d", diffH, diffM, diffS));
      sb.append("]");
    }
    return sb.toString();
  }
}
