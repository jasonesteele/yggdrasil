package yggdrasil.mvc.api.pub;

import static org.hamcrest.Matchers.equalTo;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;

import java.util.Arrays;
import java.util.HashSet;

import org.hamcrest.collection.IsIterableContainingInAnyOrder;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.test.util.ReflectionTestUtils;

import yggdrasil.dao.UserDao;
import yggdrasil.model.Permission;
import yggdrasil.model.Role;
import yggdrasil.model.User;
import yggdrasil.mvc.api.dto.SessionResource;

/**
 * Unit tests for {@link SessionApi}.
 *
 * @author jason
 */
public class SessionApiTest {
  /** Object under test. */
  private SessionApi api;

  /** Mock user DAO. */
  private UserDao userDao;

  /** Test spring security context. */
  private SecurityContextImpl securityContext;

  private User createTestUser() {
    final Permission p1 = new Permission();
    p1.setId(1L);
    p1.setName("P1");

    final Permission p2 = new Permission();
    p1.setId(2L);
    p1.setName("P2");

    final Permission p3 = new Permission();
    p1.setId(3L);
    p1.setName("P3");

    final Role r1 = new Role();
    r1.setId(1L);
    r1.setName("R1");
    r1.setPermissions(new HashSet<Permission>());
    r1.getPermissions().add(p1);
    r1.getPermissions().add(p2);

    final Role r2 = new Role();
    r2.setId(2L);
    r2.setName("R2");
    r2.setPermissions(new HashSet<Permission>());
    r2.getPermissions().add(p2);
    r2.getPermissions().add(p3);

    final User user = new User();
    user.setId(1L);
    user.setEmail("foo@bar.com");
    user.setUsername("user1");
    user.setEnabled(true);
    user.setRoles(new HashSet<Role>());
    user.getRoles().add(r1);
    user.getRoles().add(r2);

    return user;
  }

  @Before
  public void setup() {
    api = new SessionApi();
    userDao = mock(UserDao.class);

    ReflectionTestUtils.setField(api, "userDao", userDao);
    securityContext = new SecurityContextImpl();
    SecurityContextHolder.setContext(securityContext);
  }

  @Test
  public void testAnonymousAuthentication() {
    securityContext.setAuthentication(new AnonymousAuthenticationToken("mockuser", "mockuser",
        Arrays.asList(new SimpleGrantedAuthority("FOO"))));
    final ResponseEntity<SessionResource> response = api.getCurrentSession();
    assertThat(response.getStatusCode(), equalTo(HttpStatus.NO_CONTENT));
  }

  @SuppressWarnings("unchecked")
  @Test
  public void testEnabledUser() {
    final User user = createTestUser();
    securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(user, null));

    final ResponseEntity<SessionResource> response = api.getCurrentSession();

    assertThat(response.getStatusCode(), equalTo(HttpStatus.OK));
    final SessionResource resource = response.getBody();
    assertThat(resource.getUsername(), equalTo("user1"));
    assertThat(resource.getEmail(), equalTo("foo@bar.com"));
    assertThat(resource.getRoles(),
        IsIterableContainingInAnyOrder.<String> containsInAnyOrder(equalTo("R1"), equalTo("R2")));
  }

  @Test
  public void testNullAuthentication() {
    final ResponseEntity<SessionResource> response = api.getCurrentSession();
    assertThat(response.getStatusCode(), equalTo(HttpStatus.NO_CONTENT));
  }
}
