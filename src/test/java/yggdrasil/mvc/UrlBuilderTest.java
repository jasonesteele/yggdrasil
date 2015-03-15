package yggdrasil.mvc;

import static org.hamcrest.Matchers.equalTo;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import javax.servlet.http.HttpServletRequest;

import org.junit.Before;
import org.junit.Test;

/**
 * Unit tests for {@link UrlBuilder}.
 *
 * @author jason
 */
public class UrlBuilderTest {
  /** Object under test. */
  private UrlBuilder builder;

  /** Mock HTTP servlet request. */
  private HttpServletRequest request;

  private void initRequestMock(final String scheme, final String server, final int port,
      final String contextPath) {
    when(request.getScheme()).thenReturn(scheme);
    when(request.getServerName()).thenReturn(server);
    when(request.getServerPort()).thenReturn(port);
    when(request.getContextPath()).thenReturn(contextPath);
  }

  @Before
  public void setup() {
    request = mock(HttpServletRequest.class);
    builder = new UrlBuilder(request);
  }

  @Test
  public void testContextRelativeAppContext() {
    initRequestMock("http", "server.somewhere.local", 80, "/app");
    assertThat(builder.contextRelative().toString(), equalTo("/app/"));
    assertThat(builder.contextRelative().uri("foo").toString(), equalTo("/app/foo"));
    assertThat(builder.contextRelative().uri("/foo").toString(), equalTo("/app/foo"));
    assertThat(builder.contextRelative().uri("foo/").toString(), equalTo("/app/foo/"));
    assertThat(builder.contextRelative().uri("/foo/").toString(), equalTo("/app/foo/"));
  }

  @Test
  public void testContextRelativeRootContext() {
    initRequestMock("https", "server.somewhere.local", 443, "/");
    assertThat(builder.contextRelative().toString(), equalTo("/"));
    assertThat(builder.contextRelative().uri("foo").toString(), equalTo("/foo"));
    assertThat(builder.contextRelative().uri("/foo").toString(), equalTo("/foo"));
    assertThat(builder.contextRelative().uri("foo/").toString(), equalTo("/foo/"));
    assertThat(builder.contextRelative().uri("/foo/").toString(), equalTo("/foo/"));
  }

  @Test
  public void testHttpNonDefaultPort() {
    initRequestMock("http", "server.somewhere.local", 8080, "/app");
    assertThat(builder.absolute().toString(), equalTo("http://server.somewhere.local:8080/app/"));
    initRequestMock("http", "server.somewhere.local", 443, "/app");
    assertThat(builder.absolute().toString(), equalTo("http://server.somewhere.local:443/app/"));
  }

  @Test
  public void testHttpsNonDefaultPort() {
    initRequestMock("https", "server.somewhere.local", 8443, "/app");
    assertThat(builder.absolute().toString(), equalTo("https://server.somewhere.local:8443/app/"));
    initRequestMock("https", "server.somewhere.local", 80, "/app");
    assertThat(builder.absolute().toString(), equalTo("https://server.somewhere.local:80/app/"));
  }

  @Test
  public void testHttpsUrlDefaultPort() {
    initRequestMock("https", "server.somewhere.local", 443, "/app");
    assertThat(builder.absolute().toString(), equalTo("https://server.somewhere.local/app/"));
    assertThat(builder.absolute().uri("foo").toString(),
        equalTo("https://server.somewhere.local/app/foo"));
    assertThat(builder.absolute().uri("foo/").toString(),
        equalTo("https://server.somewhere.local/app/foo/"));
    assertThat(builder.absolute().uri("/foo").toString(),
        equalTo("https://server.somewhere.local/app/foo"));
    assertThat(builder.absolute().uri("/foo/").toString(),
        equalTo("https://server.somewhere.local/app/foo/"));
    assertThat(builder.absolute().uri("/foo/bar").toString(),
        equalTo("https://server.somewhere.local/app/foo/bar"));
    assertThat(builder.absolute().uri("/foo/bar//").toString(),
        equalTo("https://server.somewhere.local/app/foo/bar//"));
  }

  @Test
  public void testHttpsUrlRootContextDefaultPort() {
    initRequestMock("https", "server.somewhere.local", 443, "/");
    assertThat(builder.absolute().toString(), equalTo("https://server.somewhere.local/"));
    assertThat(builder.absolute().uri("foo").toString(),
        equalTo("https://server.somewhere.local/foo"));
    assertThat(builder.absolute().uri("foo/").toString(),
        equalTo("https://server.somewhere.local/foo/"));
    assertThat(builder.absolute().uri("/foo").toString(),
        equalTo("https://server.somewhere.local/foo"));
    assertThat(builder.absolute().uri("/foo/").toString(),
        equalTo("https://server.somewhere.local/foo/"));
    assertThat(builder.absolute().uri("/foo/bar").toString(),
        equalTo("https://server.somewhere.local/foo/bar"));
    assertThat(builder.absolute().uri("/foo/bar//").toString(),
        equalTo("https://server.somewhere.local/foo/bar//"));
  }

  @Test
  public void testHttpUrlDefaultPort() {
    initRequestMock("http", "server.somewhere.local", 80, "/app");
    assertThat(builder.absolute().toString(), equalTo("http://server.somewhere.local/app/"));
    assertThat(builder.absolute().uri("foo").toString(),
        equalTo("http://server.somewhere.local/app/foo"));
    assertThat(builder.absolute().uri("foo/").toString(),
        equalTo("http://server.somewhere.local/app/foo/"));
    assertThat(builder.absolute().uri("/foo").toString(),
        equalTo("http://server.somewhere.local/app/foo"));
    assertThat(builder.absolute().uri("/foo/").toString(),
        equalTo("http://server.somewhere.local/app/foo/"));
    assertThat(builder.absolute().uri("/foo/bar").toString(),
        equalTo("http://server.somewhere.local/app/foo/bar"));
    assertThat(builder.absolute().uri("/foo/bar//").toString(),
        equalTo("http://server.somewhere.local/app/foo/bar//"));
  }

  @Test
  public void testHttpUrlRootContextDefaultPort() {
    initRequestMock("http", "server.somewhere.local", 80, "/");
    assertThat(builder.absolute().toString(), equalTo("http://server.somewhere.local/"));
    assertThat(builder.absolute().uri("foo").toString(),
        equalTo("http://server.somewhere.local/foo"));
    assertThat(builder.absolute().uri("foo/").toString(),
        equalTo("http://server.somewhere.local/foo/"));
    assertThat(builder.absolute().uri("/foo").toString(),
        equalTo("http://server.somewhere.local/foo"));
    assertThat(builder.absolute().uri("/foo/").toString(),
        equalTo("http://server.somewhere.local/foo/"));
    assertThat(builder.absolute().uri("/foo/bar").toString(),
        equalTo("http://server.somewhere.local/foo/bar"));
    assertThat(builder.absolute().uri("/foo/bar//").toString(),
        equalTo("http://server.somewhere.local/foo/bar//"));
  }

  @Test(expected = NullPointerException.class)
  public void testNullUri() {
    builder.uri(null);
  }

  @Test
  public void testRelativeAppContext() {
    initRequestMock("http", "server.somewhere.local", 80, "/app");
    assertThat(builder.toString(), equalTo("/"));
    assertThat(builder.uri("foo").toString(), equalTo("/foo"));
    assertThat(builder.uri("/foo").toString(), equalTo("/foo"));
    assertThat(builder.uri("foo/").toString(), equalTo("/foo/"));
    assertThat(builder.uri("/foo/").toString(), equalTo("/foo/"));
  }

  @Test
  public void testRelativeRootContext() {
    initRequestMock("https", "server.somewhere.local", 443, "/");
    assertThat(builder.toString(), equalTo("/"));
    assertThat(builder.uri("foo").toString(), equalTo("/foo"));
    assertThat(builder.uri("/foo").toString(), equalTo("/foo"));
    assertThat(builder.uri("foo/").toString(), equalTo("/foo/"));
    assertThat(builder.uri("/foo/").toString(), equalTo("/foo/"));
  }
}
