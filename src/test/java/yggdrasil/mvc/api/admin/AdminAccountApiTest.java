package yggdrasil.mvc.api.admin;

import static org.hamcrest.Matchers.equalTo;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;

import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

import yggdrasil.dao.UserDao;
import yggdrasil.model.User;
import yggdrasil.mvc.api.dto.NewUserResource;
import yggdrasil.mvc.api.dto.UserResource;
import yggdrasil.mvc.exception.InvalidOperationException;

/**
 * Unit tests for {@link AdminAccountApi}.
 *
 * @author jason
 */
public class AdminAccountApiTest {
  /** Object under test. */
  private AdminAccountApi api;

  /** User DAO mock. */
  private UserDao userDao;

  private void initRequestMock(final HttpServletRequest request, final String scheme,
      final String server, final int port, final String contextPath) {
    when(request.getScheme()).thenReturn(scheme);
    when(request.getServerName()).thenReturn(server);
    when(request.getServerPort()).thenReturn(port);
    when(request.getContextPath()).thenReturn(contextPath);
    when(request.getHeaderNames()).thenReturn(new Enumeration<String>() {
      @Override
      public boolean hasMoreElements() {
        return false;
      }

      @Override
      public String nextElement() {
        return null;
      }
    });
  }

  @Before
  public void setup() {
    api = new AdminAccountApi();

    userDao = mock(UserDao.class);
    ReflectionTestUtils.setField(api, "userDao", userDao);
  }

  @Test
  public void testAddUser() {
    final long USER_ID = 1234L;
    final String USER_NAME = "foo";
    final String USER_EMAIL = "me@here.com";
    final String FAKE_PASSWORD = "THIS SHOULD BE IGNORED";

    final HttpServletRequest request = mock(HttpServletRequest.class);
    initRequestMock(request, "https", "localhost.localdomain", 443, "/app");

    final NewUserResource userResource = new NewUserResource();
    userResource.setUsername(USER_NAME);
    userResource.setEmail(USER_EMAIL);
    userResource.setPassword(FAKE_PASSWORD);

    final User user = new User();
    user.setId(USER_ID);
    user.setUsername(userResource.getUsername());
    user.setEmail(userResource.getEmail());

    when(userDao.create(any(User.class))).thenReturn(USER_ID);
    when(userDao.get(eq(USER_ID))).thenReturn(user);

    final ResponseEntity<Long> result = api.addUser(userResource, request);

    assertThat(result.getStatusCode(), equalTo(HttpStatus.CREATED));
    assertThat(result.getBody(), equalTo(USER_ID));

    final ArgumentCaptor<User> createUser = ArgumentCaptor.forClass(User.class);
    verify(userDao).create(createUser.capture());
    assertNull(createUser.getValue().getId());
    assertThat(createUser.getValue().getUsername(), equalTo(userResource.getUsername()));
    assertThat(createUser.getValue().getEmail(), equalTo(userResource.getEmail()));
    assertNotNull(createUser.getValue().getPassword());
    assertThat(createUser.getValue().isEmailVerified(), equalTo(false));
    assertThat(createUser.getValue().isEnabled(), equalTo(true));
  }

  @Test(expected = InvalidOperationException.class)
  public void testChangeCurrentUsername() {
    final long USER_ID = 12345L;
    final String USER_NAME = "user1";
    final String USER_EMAIL = "user1@here.com";
    final boolean USER_ENABLED = true;

    final String NEW_USER_NAME = "user2";

    final UserResource newValues = new UserResource();
    newValues.setUsername(NEW_USER_NAME);

    final User oldUser = new User();
    oldUser.setId(USER_ID);
    oldUser.setUsername(USER_NAME);
    oldUser.setEmail(USER_EMAIL);
    oldUser.setEnabled(USER_ENABLED);

    when(userDao.get(eq(USER_ID))).thenReturn(oldUser);
    when(userDao.findByName(USER_NAME)).thenReturn(oldUser);

    final UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
        oldUser, null);
    SecurityContextHolder.getContext().setAuthentication(token);

    api.updateUser(Long.toString(USER_ID), newValues);
  }

  @Test
  public void testConstraintViolationException() {
    final HttpServletResponse response = mock(HttpServletResponse.class);

    final ConstraintViolation<?> violation = mock(ConstraintViolation.class);
    final Set<ConstraintViolation<?>> violations = new HashSet<ConstraintViolation<?>>();
    violations.add(violation);
    assertNotNull(api.handleException(new ConstraintViolationException(violations), response));

    verify(response).setStatus(HttpStatus.BAD_REQUEST.value());
    verify(response).setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE);
  }

  @Test(expected = InvalidOperationException.class)
  public void testDeleteSelf() {
    final long DELETE_USER_ID = 12345L;

    final Long USER_ID = 12345L;
    final String USER_NAME = "foo";
    final String USER_EMAIL = "me@here.com";

    final User user = new User();
    user.setId(USER_ID);
    user.setUsername(USER_NAME);
    user.setEmail(USER_EMAIL);

    final UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(user,
        null);
    SecurityContextHolder.getContext().setAuthentication(token);

    when(userDao.findByName(USER_NAME)).thenReturn(user);

    api.deleteUser(Long.toString(DELETE_USER_ID));
  }

  @Test
  public void testDeleteUser() {
    final long DELETE_USER_ID = 7890L;

    final Long USER_ID = 12345L;
    final String USER_NAME = "foo";
    final String USER_EMAIL = "me@here.com";

    final User user = new User();
    user.setId(USER_ID);
    user.setUsername(USER_NAME);
    user.setEmail(USER_EMAIL);

    final UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(user,
        null);
    SecurityContextHolder.getContext().setAuthentication(token);

    when(userDao.findByName(USER_NAME)).thenReturn(user);

    final ResponseEntity<String> result = api.deleteUser(Long.toString(DELETE_USER_ID));

    assertThat(result.getStatusCode(), equalTo(HttpStatus.NO_CONTENT));
    assertNull(result.getBody());
    verify(userDao).delete(eq(DELETE_USER_ID));
  }

  @Test(expected = NumberFormatException.class)
  public void testDeleteUserInvalidId() {
    api.deleteUser("NAN");
  }

  @Test(expected = InvalidOperationException.class)
  public void testDisableCurrentUser() {
    final long USER_ID = 12345L;
    final String USER_NAME = "user1";
    final String USER_EMAIL = "user1@here.com";
    final boolean USER_ENABLED = true;

    final boolean NEW_USER_ENABLED = false;

    final UserResource newValues = new UserResource();
    newValues.setIsEnabled(NEW_USER_ENABLED);

    final User oldUser = new User();
    oldUser.setId(USER_ID);
    oldUser.setUsername(USER_NAME);
    oldUser.setEmail(USER_EMAIL);
    oldUser.setEnabled(USER_ENABLED);

    when(userDao.get(eq(USER_ID))).thenReturn(oldUser);
    when(userDao.findByName(USER_NAME)).thenReturn(oldUser);

    final UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
        oldUser, null);
    SecurityContextHolder.getContext().setAuthentication(token);

    api.updateUser(Long.toString(USER_ID), newValues);
  }

  @Test
  public void testEntityNotFoundException() {
    final HttpServletResponse response = mock(HttpServletResponse.class);

    assertNotNull(api.handleException(new EntityNotFoundException(), response));

    verify(response).setStatus(HttpStatus.NOT_FOUND.value());
    verify(response).setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE);
  }

  @Test
  public void testGetAllUsers() {
    final User daoUser1 = new User();
    daoUser1.setId(12345L);
    daoUser1.setUsername("user1");
    daoUser1.setEmail("user1@foo.bar");

    final User daoUser2 = new User();
    daoUser2.setId(12346L);
    daoUser2.setUsername("user2");
    daoUser2.setEmail("user2@foo.bar");
    when(userDao.getAll()).thenReturn(Arrays.asList(daoUser1, daoUser2));

    final List<UserResource> users = api.getAllUsers();

    assertThat(users.size(), equalTo(2));
    assertThat(users.get(0).getId(), equalTo(12345L));
    assertThat(users.get(0).getUsername(), equalTo("user1"));
    assertThat(users.get(0).getEmail(), equalTo("user1@foo.bar"));
    assertThat(users.get(1).getId(), equalTo(12346L));
    assertThat(users.get(1).getUsername(), equalTo("user2"));
    assertThat(users.get(1).getEmail(), equalTo("user2@foo.bar"));
  }

  @Test
  public void testGetDisabledUser() {
    final long USER_ID = 1234L;
    final String USER_NAME = "foo";
    final String USER_EMAIL = "me@here.com";

    final User user = new User();
    user.setId(USER_ID);
    user.setUsername(USER_NAME);
    user.setEmail(USER_EMAIL);
    user.setEnabled(false);

    when(userDao.get(eq(USER_ID))).thenReturn(user);

    final UserResource userResource = api.getUser(Long.toString(USER_ID));

    assertThat(userResource.getId(), equalTo(USER_ID));
    assertThat(userResource.getUsername(), equalTo(USER_NAME));
    assertThat(userResource.getEmail(), equalTo(USER_EMAIL));
    assertThat(userResource.getIsEnabled(), equalTo(false));
  }

  @Test
  public void testGetEnabledUser() {
    final long USER_ID = 1234L;
    final String USER_NAME = "foo";
    final String USER_EMAIL = "me@here.com";

    final User user = new User();
    user.setId(USER_ID);
    user.setUsername(USER_NAME);
    user.setEmail(USER_EMAIL);
    user.setEnabled(true);

    when(userDao.get(eq(USER_ID))).thenReturn(user);

    final UserResource userResource = api.getUser(Long.toString(USER_ID));

    assertThat(userResource.getId(), equalTo(USER_ID));
    assertThat(userResource.getUsername(), equalTo(USER_NAME));
    assertThat(userResource.getEmail(), equalTo(USER_EMAIL));
    assertThat(userResource.getIsEnabled(), equalTo(true));
  }

  @Test(expected = NumberFormatException.class)
  public void testGetUserWithNonNumericId() {
    api.getUser("foo");
  }

  @Test
  public void testInvalidOperationException() {
    final HttpServletResponse response = mock(HttpServletResponse.class);

    assertNotNull(api.handleException(new InvalidOperationException(), response));

    verify(response).setStatus(HttpStatus.FORBIDDEN.value());
    verify(response).setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE);
  }

  @Test
  public void testNumberFormatException() {
    final HttpServletResponse response = mock(HttpServletResponse.class);

    assertNotNull(api.handleException(new NumberFormatException(), response));

    verify(response).setStatus(HttpStatus.BAD_REQUEST.value());
    verify(response).setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE);
  }

  @Test
  public void testUpdateCurrentUserAllLegalFields() {
    final long USER_ID = 12345L;
    final String USER_NAME = "user1";
    final String USER_EMAIL = "user1@here.com";
    final boolean USER_ENABLED = true;

    final long NEW_USER_ID = 54321L;
    final String NEW_USER_EMAIL = "user2@here.com";

    final UserResource newValues = new UserResource();
    newValues.setId(NEW_USER_ID);
    newValues.setUsername(USER_NAME);
    newValues.setEmail(NEW_USER_EMAIL);
    newValues.setIsEnabled(USER_ENABLED);

    final User oldUser = new User();
    oldUser.setId(USER_ID);
    oldUser.setUsername(USER_NAME);
    oldUser.setEmail(USER_EMAIL);
    oldUser.setEnabled(USER_ENABLED);

    when(userDao.get(eq(USER_ID))).thenReturn(oldUser);
    when(userDao.findByName(USER_NAME)).thenReturn(oldUser);

    final UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
        oldUser, null);
    SecurityContextHolder.getContext().setAuthentication(token);

    final ResponseEntity<String> result = api.updateUser(Long.toString(USER_ID), newValues);

    assertThat(result.getStatusCode(), equalTo(HttpStatus.NO_CONTENT));
    assertNull(result.getBody());

    final ArgumentCaptor<User> updatedUser = ArgumentCaptor.forClass(User.class);
    verify(userDao).update(updatedUser.capture());
    assertThat(updatedUser.getValue().getId(), equalTo(USER_ID));
    assertThat(updatedUser.getValue().getUsername(), equalTo(USER_NAME));
    assertThat(updatedUser.getValue().getEmail(), equalTo(NEW_USER_EMAIL));
    assertThat(updatedUser.getValue().isEnabled(), equalTo(USER_ENABLED));
  }

  @Test
  public void testUpdateUserAllFields() {
    final long CURR_USER_ID = 7777L;
    final String CURR_USER_NAME = "me";

    final long USER_ID = 12345L;
    final String USER_NAME = "user1";
    final String USER_EMAIL = "user1@here.com";
    final boolean USER_ENABLED = false;

    final long NEW_USER_ID = 54321L;
    final String NEW_USER_NAME = "user2";
    final String NEW_USER_EMAIL = "user2@here.com";
    final boolean NEW_USER_ENABLED = true;

    final UserResource newValues = new UserResource();
    newValues.setId(NEW_USER_ID);
    newValues.setUsername(NEW_USER_NAME);
    newValues.setEmail(NEW_USER_EMAIL);
    newValues.setIsEnabled(NEW_USER_ENABLED);

    final User oldUser = new User();
    oldUser.setId(USER_ID);
    oldUser.setUsername(USER_NAME);
    oldUser.setEmail(USER_EMAIL);
    oldUser.setEnabled(USER_ENABLED);

    final User currUser = new User();
    currUser.setId(CURR_USER_ID);
    currUser.setUsername(CURR_USER_NAME);

    when(userDao.get(eq(USER_ID))).thenReturn(oldUser);
    when(userDao.findByName(CURR_USER_NAME)).thenReturn(currUser);

    final UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
        currUser, null);
    SecurityContextHolder.getContext().setAuthentication(token);

    final ResponseEntity<String> result = api.updateUser(Long.toString(USER_ID), newValues);

    assertThat(result.getStatusCode(), equalTo(HttpStatus.NO_CONTENT));
    assertNull(result.getBody());

    final ArgumentCaptor<User> updatedUser = ArgumentCaptor.forClass(User.class);
    verify(userDao).update(updatedUser.capture());
    assertThat(updatedUser.getValue().getId(), equalTo(USER_ID));
    assertThat(updatedUser.getValue().getUsername(), equalTo(NEW_USER_NAME));
    assertThat(updatedUser.getValue().getEmail(), equalTo(NEW_USER_EMAIL));
    assertThat(updatedUser.getValue().isEnabled(), equalTo(NEW_USER_ENABLED));
  }

  @Test
  public void testUpdateUserNoFields() {
    final long CURR_USER_ID = 7777L;
    final String CURR_USER_NAME = "me";

    final long USER_ID = 12345L;
    final String USER_NAME = "user1";
    final String USER_EMAIL = "user1@here.com";
    final boolean USER_ENABLED = false;

    final UserResource newValues = new UserResource();

    final User oldUser = new User();
    oldUser.setId(USER_ID);
    oldUser.setUsername(USER_NAME);
    oldUser.setEmail(USER_EMAIL);
    oldUser.setEnabled(USER_ENABLED);

    final User currUser = new User();
    currUser.setId(CURR_USER_ID);
    currUser.setUsername(CURR_USER_NAME);

    when(userDao.get(eq(USER_ID))).thenReturn(oldUser);
    when(userDao.findByName(CURR_USER_NAME)).thenReturn(currUser);

    final UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
        currUser, null);
    SecurityContextHolder.getContext().setAuthentication(token);

    final ResponseEntity<String> result = api.updateUser(Long.toString(USER_ID), newValues);

    assertThat(result.getStatusCode(), equalTo(HttpStatus.NO_CONTENT));
    assertNull(result.getBody());

    final ArgumentCaptor<User> updatedUser = ArgumentCaptor.forClass(User.class);
    verify(userDao).update(updatedUser.capture());
    assertThat(updatedUser.getValue().getId(), equalTo(USER_ID));
    assertThat(updatedUser.getValue().getUsername(), equalTo(USER_NAME));
    assertThat(updatedUser.getValue().getEmail(), equalTo(USER_EMAIL));
    assertThat(updatedUser.getValue().isEnabled(), equalTo(USER_ENABLED));
  }
}
