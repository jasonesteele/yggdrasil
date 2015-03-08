package yggdrasil.mvc;

import javax.servlet.http.HttpServletRequest;

/**
 * Builder for application URLs relative to an HTTP servlet requests.
 *
 * @author jason
 */
public class UrlBuilder {
  /** Http servlet request to build URLs against. */
  private final HttpServletRequest request;

  private final StringBuilder base = new StringBuilder("/");

  private String uri = "";

  public UrlBuilder(final HttpServletRequest request) {
    this.request = request;
  }

  public UrlBuilder absolute() {
    base.setLength(0);
    base.append(request.getScheme());
    base.append(":");
    base.append(request.getServerName());
    if (("http".equalsIgnoreCase(request.getScheme()) && request.getServerPort() != 80)
        || ("https".equalsIgnoreCase(request.getScheme()) && request.getServerPort() != 443)) {
      base.append(":");
      base.append(request.getServerPort());
    }
    base.append(request.getContextPath());
    base.append("/");
    return this;
  }

  @Override
  public String toString() {
    return String.format("%s%s", base, uri);
  }

  public UrlBuilder uri(final String uri) {
    if (uri == null) {
      throw new NullPointerException("null uri");
    }
    if (uri.startsWith("/")) {
      this.uri = uri.substring(1);
    } else {
      this.uri = uri;
    }
    return this;
  }
}
