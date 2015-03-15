package yggdrasil.controller;

import static org.hamcrest.Matchers.equalTo;
import static org.junit.Assert.assertThat;

import java.util.Arrays;

import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.env.MockEnvironment;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.test.util.ReflectionTestUtils;

import yggdrasil.mvc.controller.LoginController;

/**
 * Unit tests for {@link LoginController}.
 *
 * @author jason
 */
public class LoginControllerTest {
  /** Object under test. */
  private LoginController controller;

  /** Mock environment. */
  private MockEnvironment env;

  /** Test spring security context. */
  private SecurityContextImpl securityContext;

  @Before
  public void setup() {
    controller = new LoginController();
    env = new MockEnvironment();
    ReflectionTestUtils.setField(controller, "env", env);

    securityContext = new SecurityContextImpl();
    SecurityContextHolder.setContext(securityContext);
  }

  @Test
  public void testAuthenticatedWithDefaultUrl() {
    securityContext.setAuthentication(new UsernamePasswordAuthenticationToken("mockuser",
        "mockuserpassword"));

    assertThat(controller.login(), equalTo("redirect:/"));
  }

  @Test
  public void testAuthenticatedWithSpecifiedUrl() {
    env.setProperty("yggdrasil.home", "/foo/bar/baz");
    securityContext.setAuthentication(new UsernamePasswordAuthenticationToken("mockuser",
        "mockuserpassword"));

    assertThat(controller.login(), equalTo("redirect:/foo/bar/baz"));
  }

  @Test
  public void testUnauthenticatedWithAnonymous() {
    securityContext.setAuthentication(new AnonymousAuthenticationToken("mockuser", "mockuser",
        Arrays.asList(new SimpleGrantedAuthority("FOO"))));

    assertThat(controller.login(), equalTo("login"));
  }

  @Test
  public void testUnauthenticatedWithNull() {
    assertThat(controller.login(), equalTo("login"));
  }
}
