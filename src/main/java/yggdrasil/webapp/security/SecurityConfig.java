package yggdrasil.webapp.security;

import javax.annotation.Resource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.servlet.configuration.EnableWebMvcSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.NegatedRequestMatcher;

/**
 * Application configuration for web security.
 *
 * @author jason
 */
@Configuration
@EnableWebMvcSecurity
@ComponentScan
public class SecurityConfig extends WebSecurityConfigurerAdapter {
  @Resource
  private Environment env;

  @Resource
  private UserDetailsService userDetailsService;

  @Override
  protected void configure(final AuthenticationManagerBuilder auth) throws Exception {
    // @formatter:off
    auth
      .authenticationProvider(daoAuthenticationProvider());
    // @formatter:on
  }

  @Override
  protected void configure(final HttpSecurity http) throws Exception {
    if (Boolean.valueOf(env.getProperty("security.disable_api_auth", "false"))) {
      // @formatter:off
      http
        .authorizeRequests()
          .antMatchers("/api/**").permitAll()
          .antMatchers("/admin/api/**").permitAll()
          .antMatchers("/api-docs/**").permitAll()
          .antMatchers("/admin/**").hasRole("ADMIN")
          .anyRequest().authenticated();
      // @formatter:off
    } else {
      // @formatter:off
      http
        .authorizeRequests()
          .antMatchers("/admin/**").hasRole("ADMIN")
          .anyRequest().authenticated();
      // @formatter:off
    }

    // @formatter:on
    http.formLogin().loginPage("/login").permitAll().defaultSuccessUrl("/").and().logout()
        .permitAll();
    // @formatter:on

    if (Boolean.valueOf(env.getProperty("security.disable_csrf", "false"))) {
      /*
       * Still generate the tokens (to avoid template errors), but don't require
       * them to be set.
       */
      http.csrf().requireCsrfProtectionMatcher(
          new NegatedRequestMatcher(new AntPathRequestMatcher("/**")));
    } else {
      http.csrf();
    }
  }

  @Override
  public void configure(final WebSecurity web) throws Exception {
    // @formatter:off
    web.ignoring().antMatchers("/css/**", "/js/**", "/images/**", "/fonts/**");
    // @formatter:on
  }

  @Bean
  public DaoAuthenticationProvider daoAuthenticationProvider() {
    final DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setUserDetailsService(userDetailsService);
    provider.setPasswordEncoder(new BCryptPasswordEncoder());
    return provider;
  }
}
