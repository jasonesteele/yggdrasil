package yggdrasil.mvc.api.pub;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasEntry;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.fail;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Matchers.anyLong;
import static org.mockito.Matchers.anyObject;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Matchers.matches;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Date;
import java.util.HashSet;
import java.util.Map;

import javax.mail.MessagingException;
import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.env.MockEnvironment;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import yggdrasil.dao.AccountVerificationDao;
import yggdrasil.dao.UserDao;
import yggdrasil.mail.MailService;
import yggdrasil.model.AccountVerification;
import yggdrasil.model.Role;
import yggdrasil.model.User;
import yggdrasil.mvc.api.dto.ApiError;
import yggdrasil.mvc.api.dto.EmailResource;
import yggdrasil.mvc.api.dto.NewUserResource;
import yggdrasil.mvc.exception.UserAlreadyVerifiedException;
import yggdrasil.mvc.exception.VerificationHoldoffException;

/**
 * Unit tests for {@link AccountApi}.
 *
 * @author jason
 */
public class AccountApiTest {
  /** Object under test. */
  private AccountApi api;

  /** Mock DAO for unit testing. */
  private UserDao userDao;

  /** Mock DAO for unit testing. */
  private AccountVerificationDao verificationDao;

  /** Mock mail service for unit testing. */
  private MailService mailService;

  /** Mock password encoder for unit testing. */
  private PasswordEncoder encoder;

  /** Mock environment for unit testing. */
  private MockEnvironment env;

  private void initRequestMock(final HttpServletRequest request, final String scheme,
      final String server, final int port, final String contextPath) {
    when(request.getScheme()).thenReturn(scheme);
    when(request.getServerName()).thenReturn(server);
    when(request.getServerPort()).thenReturn(port);
    when(request.getContextPath()).thenReturn(contextPath);
  }

  @Before
  public void setup() {
    api = new AccountApi();
    env = new MockEnvironment();

    userDao = mock(UserDao.class);
    verificationDao = mock(AccountVerificationDao.class);
    mailService = mock(MailService.class);

    encoder = new PasswordEncoder() {
      @Override
      public String encode(final CharSequence rawPassword) {
        return "ENCODED{" + rawPassword + ":" + rawPassword.length() + "}";
      }

      @Override
      public boolean matches(final CharSequence rawPassword, final String encodedPassword) {
        return encodedPassword.equals("ENCODED{ " + rawPassword + ":" + rawPassword.length() + "}");
      }
    };

    ReflectionTestUtils.setField(api, "userDao", userDao);
    ReflectionTestUtils.setField(api, "verificationDao", verificationDao);
    ReflectionTestUtils.setField(api, "mailService", mailService);
    ReflectionTestUtils.setField(api, "encoder", encoder);
    ReflectionTestUtils.setField(api, "env", env);
  }

  @SuppressWarnings("unchecked")
  @Test
  public void testCreateNewUser() throws MessagingException {
    // Set up test data
    final HttpServletRequest request = mock(HttpServletRequest.class);
    initRequestMock(request, "https", "some.where.local", 443, "/app");

    final long USER_ID = 1234L;
    final String VERIFICATION_KEY = "ZZFOOVERIFICATION";
    final String VERIFICATION_URL = "https://some.where.local/app/v/" + VERIFICATION_KEY;

    final NewUserResource userResource = new NewUserResource();
    userResource.setUsername("foo");
    userResource.setEmail("me@here.com");
    userResource.setPassword("password");

    final User createdUser = new User();
    createdUser.setId(USER_ID);
    createdUser.setEmail(userResource.getEmail());
    createdUser.setUsername(userResource.getUsername());
    createdUser.setRoles(new HashSet<Role>());
    createdUser.setPassword(encoder.encode("password"));

    when(userDao.create(any(User.class))).thenReturn(USER_ID);
    when(userDao.get(eq(USER_ID))).thenReturn(createdUser);
    when(verificationDao.createVerification(eq(USER_ID), anyInt())).thenReturn(VERIFICATION_KEY);

    // Method under test
    final ResponseEntity<Long> response = api.createNewUser(userResource, request);

    // Verify results
    assertThat(response.getStatusCode(), equalTo(HttpStatus.CREATED));
    assertNotNull(response.getBody());

    final ArgumentCaptor<User> createUser = ArgumentCaptor.forClass(User.class);
    verify(userDao).create(createUser.capture());
    assertNull(createUser.getValue().getId());
    assertThat(createUser.getValue().getUsername(), equalTo(userResource.getUsername()));
    assertThat(createUser.getValue().getEmail(), equalTo(userResource.getEmail()));
    assertThat(createUser.getValue().getPassword(), equalTo(encoder.encode("password")));
    assertThat(createUser.getValue().isEmailVerified(), equalTo(false));

    final User authUser = (User) SecurityContextHolder.getContext().getAuthentication()
        .getPrincipal();
    assertThat(authUser.getUsername(), equalTo(userResource.getUsername()));

    verify(verificationDao).createVerification(eq(USER_ID), anyInt());

    @SuppressWarnings("rawtypes")
    final ArgumentCaptor<Map> map = ArgumentCaptor.forClass(Map.class);
    verify(mailService).sendEmailTemplate(eq(userResource.getEmail()), anyString(), anyString(),
        map.capture());
    assertThat((Map<String, Object>) map.getValue(),
        hasEntry("username", userResource.getUsername()));
    assertThat((Map<String, Object>) map.getValue(), hasEntry("verificationUrl", VERIFICATION_URL));
  }

  @Test
  public void testEntityNotFoundException() {
    final HttpServletResponse response = mock(HttpServletResponse.class);

    assertNotNull(api.handleException(new EntityNotFoundException(), response));

    verify(response).setStatus(HttpStatus.NOT_FOUND.value());
    verify(response).setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE);
  }

  @Test
  public void testMessagingException() {
    final HttpServletResponse response = mock(HttpServletResponse.class);

    assertNotNull(api.handleException(new MessagingException(), response));

    verify(response).setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
    verify(response).setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE);
  }

  @SuppressWarnings("unchecked")
  @Test
  public void testRequestVerification() throws UserAlreadyVerifiedException, MessagingException,
      VerificationHoldoffException {
    // Set up test data
    final HttpServletRequest request = mock(HttpServletRequest.class);
    initRequestMock(request, "https", "some.where.local", 443, "/app");

    final long USER_ID = 1234L;
    final String USER_NAME = "user1";
    final String USER_EMAIL = "me@here.com";
    final String VERIFICATION_KEY = "ZZFOOVERIFICATION";
    final String VERIFICATION_URL = "https://some.where.local/app/v/" + VERIFICATION_KEY;

    final EmailResource emailResource = new EmailResource(USER_EMAIL);

    final User user = new User();
    user.setId(USER_ID);
    user.setUsername(USER_NAME);
    user.setEmail(USER_EMAIL);
    user.setEmailVerified(false);

    when(userDao.findByEmail(eq(USER_EMAIL))).thenReturn(user);
    when(verificationDao.createVerification(eq(USER_ID), anyInt())).thenReturn(VERIFICATION_KEY);

    // Method under test
    final ResponseEntity<String> response = api.requestVerification(emailResource, request);

    // Validate results
    assertThat(response.getStatusCode(), equalTo(HttpStatus.NO_CONTENT));
    assertNull(response.getBody());

    verify(verificationDao).createVerification(eq(USER_ID), anyInt());

    @SuppressWarnings("rawtypes")
    final ArgumentCaptor<Map> map = ArgumentCaptor.forClass(Map.class);
    verify(mailService).sendEmailTemplate(eq(USER_EMAIL), anyString(), anyString(), map.capture());
    assertThat((Map<String, Object>) map.getValue(), hasEntry("username", USER_NAME));
    assertThat((Map<String, Object>) map.getValue(), hasEntry("verificationUrl", VERIFICATION_URL));
  }

  @SuppressWarnings("unchecked")
  @Test
  public void testRequestVerificationAgain() throws UserAlreadyVerifiedException,
      MessagingException, VerificationHoldoffException {
    // Set up test data
    final HttpServletRequest request = mock(HttpServletRequest.class);
    initRequestMock(request, "https", "some.where.local", 443, "/app");

    final long USER_ID = 1234L;
    final String USER_NAME = "user1";
    final String USER_EMAIL = "me@here.com";
    final String VERIFICATION_KEY = "ZZFOOVERIFICATION";
    final String VERIFICATION_URL = "https://some.where.local/app/v/" + VERIFICATION_KEY;

    final EmailResource emailResource = new EmailResource(USER_EMAIL);

    final User user = new User();
    user.setId(USER_ID);
    user.setUsername(USER_NAME);
    user.setEmail(USER_EMAIL);
    user.setEmailVerified(false);

    final AccountVerification oldVerification = new AccountVerification();
    oldVerification.setId("OLDVERIFICATION");
    oldVerification.setInvalidAfterTime(new Date(System.currentTimeMillis() - 30 * 1000L));
    oldVerification.setCreatedTime(new Date(System.currentTimeMillis() - 3600 * 1000L));

    when(userDao.findByEmail(eq(USER_EMAIL))).thenReturn(user);
    when(verificationDao.findMostRecentForUser(eq(USER_ID))).thenReturn(oldVerification);
    when(verificationDao.createVerification(eq(USER_ID), anyInt())).thenReturn(VERIFICATION_KEY);

    when(userDao.findByEmail(eq(USER_EMAIL))).thenReturn(user);
    when(verificationDao.createVerification(eq(USER_ID), anyInt())).thenReturn(VERIFICATION_KEY);

    // Method under test
    final ResponseEntity<String> response = api.requestVerification(emailResource, request);

    // Validate results
    assertThat(response.getStatusCode(), equalTo(HttpStatus.NO_CONTENT));
    assertNull(response.getBody());

    verify(verificationDao).createVerification(eq(USER_ID), anyInt());

    @SuppressWarnings("rawtypes")
    final ArgumentCaptor<Map> map = ArgumentCaptor.forClass(Map.class);
    verify(mailService).sendEmailTemplate(eq(USER_EMAIL), anyString(), anyString(), map.capture());
    assertThat((Map<String, Object>) map.getValue(), hasEntry("username", USER_NAME));
    assertThat((Map<String, Object>) map.getValue(), hasEntry("verificationUrl", VERIFICATION_URL));
  }

  @Test
  public void testRequestVerificationTooSoon() throws UserAlreadyVerifiedException,
      MessagingException {
    // Set up test data
    final HttpServletRequest request = mock(HttpServletRequest.class);
    initRequestMock(request, "https", "some.where.local", 443, "/app");

    final long USER_ID = 1234L;
    final String USER_NAME = "user1";
    final String USER_EMAIL = "me@here.com";
    final String VERIFICATION_KEY = "ZZFOOVERIFICATION";

    final EmailResource emailResource = new EmailResource(USER_EMAIL);

    final User user = new User();
    user.setId(USER_ID);
    user.setUsername(USER_NAME);
    user.setEmail(USER_EMAIL);
    user.setEmailVerified(false);

    final AccountVerification oldVerification = new AccountVerification();
    oldVerification.setId("OLDVERIFICATION");
    oldVerification.setInvalidAfterTime(new Date(System.currentTimeMillis() + 3600 * 1000));

    when(userDao.findByEmail(eq(USER_EMAIL))).thenReturn(user);
    when(verificationDao.findMostRecentForUser(eq(USER_ID))).thenReturn(oldVerification);
    when(verificationDao.createVerification(eq(USER_ID), anyInt())).thenReturn(VERIFICATION_KEY);

    // Method under test
    try {
      api.requestVerification(emailResource, request);
      fail("expected VerificationHoldoffException");
    } catch (VerificationHoldoffException vhe) {
      // Expected
    }

    verify(verificationDao, times(0)).createVerification(anyLong(), anyInt());
    verify(mailService, times(0)).sendEmailTemplate(anyString(), anyString(), anyString(),
        anyObject());
  }

  @Test
  public void testRequestVerificationUserAlreadyVerified() throws MessagingException,
      VerificationHoldoffException {
    // Set up test data
    final HttpServletRequest request = mock(HttpServletRequest.class);
    initRequestMock(request, "https", "some.where.local", 443, "/app");

    final long USER_ID = 1234L;
    final String USER_NAME = "user1";
    final String USER_EMAIL = "me@here.com";
    final String VERIFICATION_KEY = "ZZFOOVERIFICATION";

    final EmailResource emailResource = new EmailResource(USER_EMAIL);

    final User user = new User();
    user.setId(USER_ID);
    user.setUsername(USER_NAME);
    user.setEmail(USER_EMAIL);
    user.setEmailVerified(true);

    when(userDao.findByEmail(eq(USER_EMAIL))).thenReturn(user);
    when(verificationDao.createVerification(eq(USER_ID), anyInt())).thenReturn(VERIFICATION_KEY);

    // Method under test
    try {
      api.requestVerification(emailResource, request);
      fail("expected UserAlreadyVerifiedException");
    } catch (UserAlreadyVerifiedException uav) {
      // Expected
    }

    verify(verificationDao, times(0)).createVerification(anyLong(), anyInt());
    verify(mailService, times(0)).sendEmailTemplate(anyString(), anyString(), anyString(),
        anyObject());
  }

  @Test
  public void testUserAlreadyVerifiedException() {
    final HttpServletResponse response = mock(HttpServletResponse.class);

    assertNotNull(api.handleException(new UserAlreadyVerifiedException("user"), response));

    verify(response).setStatus(HttpStatus.FORBIDDEN.value());
    verify(response).setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE);
  }

  @Test
  public void testVerificationHoldoffExceptionExactly1Minute() {
    final HttpServletResponse response = mock(HttpServletResponse.class);

    final ApiError error = api.handleException(new VerificationHoldoffException(1), response);
    assertThat(error.getMessage(), containsString(" 1 minute"));

    verify(response).setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
    verify(response).setHeader(eq("Content-Type"), eq(MediaType.APPLICATION_JSON_VALUE));
    verify(response).setHeader(eq("Retry-After"), matches("60"));
  }

  @Test
  public void testVerificationHoldoffExceptionGe1Minute() {
    final HttpServletResponse response = mock(HttpServletResponse.class);

    final ApiError error = api.handleException(new VerificationHoldoffException(2), response);
    assertThat(error.getMessage(), containsString(" 2 minutes"));

    verify(response).setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
    verify(response).setHeader(eq("Content-Type"), eq(MediaType.APPLICATION_JSON_VALUE));
    verify(response).setHeader(eq("Retry-After"), matches("[1-9][0-9]*"));
  }

  @Test
  public void testVerificationHoldoffExceptionLt1Minute() {
    final HttpServletResponse response = mock(HttpServletResponse.class);

    final ApiError error = api.handleException(new VerificationHoldoffException(0), response);
    assertThat(error.getMessage(), containsString(" <1 minute"));

    verify(response).setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
    verify(response).setHeader(eq("Content-Type"), eq(MediaType.APPLICATION_JSON_VALUE));
    verify(response).setHeader(eq("Retry-After"), matches("60"));
  }
}
