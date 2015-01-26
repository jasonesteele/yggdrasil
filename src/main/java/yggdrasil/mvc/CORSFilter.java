package yggdrasil.mvc;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Adds CORS access control filters to response headers.
 *
 * @author jason
 */
@Component
public class CORSFilter extends OncePerRequestFilter {
  @Override
  protected void doFilterInternal(final HttpServletRequest request,
      final HttpServletResponse response, final FilterChain filterChain) throws ServletException,
      IOException {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Max-Age", "3600");
    if (request.getHeader("Access-Control-Request-Method") != null
        && "OPTIONS".equals(request.getMethod())) {
      response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
      response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    filterChain.doFilter(request, response);
  }
}
