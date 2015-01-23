package yggdrasil.webapp;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;

import yggdrasil.dao.DaoConfig;

/**
 * Root configuration for application.
 *
 * @author jason
 */
@Configuration
@PropertySource("classpath:application.properties")
@Import(DaoConfig.class)
@ComponentScan
public class RootConfig {
}
