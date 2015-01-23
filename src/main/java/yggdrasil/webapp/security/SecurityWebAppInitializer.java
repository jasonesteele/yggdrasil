package yggdrasil.webapp.security;

import org.springframework.core.annotation.Order;
import org.springframework.security.web.context.AbstractSecurityWebApplicationInitializer;

/**
 * Configured Spring security for the application.
 *
 * @author jason
 */
@Order(0)
public class SecurityWebAppInitializer extends AbstractSecurityWebApplicationInitializer {
}
