package yggdrasil.webapp;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.servlet.configuration.EnableWebMvcSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Application configuration for web security.
 *
 * @author jason
 */
@Configuration
@ComponentScan
public class SecurityConfig {
  @EnableWebMvcSecurity
  @Configuration
  @Order(2)
  public static class ApiSecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(final HttpSecurity http) throws Exception {
      // @formatter:off
      http.antMatcher("/api/**");
      // @formatter:on
    }
  }

  @EnableWebMvcSecurity
  @Configuration
  @Order(10)
  public static class AppSecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    @Bean(name = "authenticationManager")
    public AuthenticationManager authenticationManagerBean() throws Exception {
      return super.authenticationManagerBean();
    }

    @Override
    protected void configure(final HttpSecurity http) throws Exception {
      // @formatter:off
      http
        .authorizeRequests()
          .antMatchers("/page/error/**").permitAll()
          .antMatchers("/v/**").permitAll()
          .anyRequest().authenticated()
        .and()
          .formLogin().loginPage("/page/login").permitAll().defaultSuccessUrl("/")
        .and()
          .logout().permitAll();
      // @formatter:on
    }

    @Override
    public void configure(final WebSecurity web) throws Exception {
      // @formatter:off
      web.ignoring().antMatchers("/css/**", "/js/**", "/images/**", "/fonts/**");
      // @formatter:on
    }
  }

  @EnableWebMvcSecurity
  @Configuration
  @Order(1)
  public static class PublicApiSecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(final HttpSecurity http) throws Exception {
      // @formatter:off
      http
       .antMatcher("/api/public/**")
        .authorizeRequests()
        .anyRequest().permitAll();
      // @formatter:on
    }
  }

  @Resource
  private Environment env;

  @Resource
  private UserDetailsService userDetailsService;

  @Bean
  public DaoAuthenticationProvider daoAuthenticationProvider() {
    final DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setUserDetailsService(userDetailsService);
    provider.setPasswordEncoder(passwordEncoder());
    return provider;
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Autowired
  public void registerGlobal(final AuthenticationManagerBuilder auth) throws Exception {
    auth.authenticationProvider(daoAuthenticationProvider());
  }
}
