package yggdrasil.dao;

import java.beans.PropertyVetoException;
import java.io.IOException;
import java.util.Properties;

import javax.annotation.Resource;

import org.hibernate.SessionFactory;
import org.springframework.beans.BeanInstantiationException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.orm.hibernate4.LocalSessionFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.mchange.v2.c3p0.ComboPooledDataSource;

/**
 * Spring configuration for data access object layer.
 *
 * @author jason
 */
@Configuration
@EnableTransactionManagement
@ComponentScan
public class DaoConfig {
  @Resource
  private Environment env;

  @Bean
  public ComboPooledDataSource dataSource() {
    final ComboPooledDataSource dataSource = new ComboPooledDataSource();

    dataSource.setJdbcUrl(env.getProperty("jdbc.url"));
    dataSource.setUser(env.getProperty("jdbc.user"));
    dataSource.setPassword(env.getProperty("jdbc.password"));

    try {
      dataSource.setDriverClass(env.getProperty("jdbc.driver"));
    } catch (PropertyVetoException pve) {
      throw new BeanInstantiationException(ComboPooledDataSource.class,
          "invalid jdbc.driver value " + env.getProperty("jdbc.driver"), pve);
    }

    // Configure C3P0 defaults
    dataSource.setInitialPoolSize(Integer.parseInt(env.getProperty("c3p0.initialPoolSize", "3")));
    dataSource.setMinPoolSize(Integer.parseInt(env.getProperty("c3p0.minPoolSize", "3")));
    dataSource.setMaxPoolSize(Integer.parseInt(env.getProperty("c3p0.maxPoolSize", "15")));
    dataSource.setMaxIdleTime(Integer.parseInt(env.getProperty("c3p0.maxIdleTime", "0")));
    dataSource.setIdleConnectionTestPeriod(Integer.parseInt(env.getProperty(
        "c3p0.idleConnectionTestPeriod", "0")));
    dataSource.setMaxStatements(Integer.parseInt(env.getProperty("c3p0.maxStatements", "0")));

    return dataSource;
  }

  @Bean
  public SessionFactory sessionFactory() {
    final LocalSessionFactoryBean factory = new LocalSessionFactoryBean();

    final Properties props = new Properties();

    props.setProperty("hibernate.show_sql", env.getProperty("hibernate.show_sql", "false"));
    props.setProperty("hibernate.format_sql", "true");
    props.setProperty("hibernate.use_sql_comments", "true");
    props.setProperty("hibernate.dialect", env.getProperty("hibernate.dialect"));
    props.setProperty("hibernate.hbm2ddl.auto",
        env.getProperty("hibernate.hbm2ddl.auto", "validate"));
    props.setProperty("hibernate.hbm2ddl.import_files_sql_extractor",
        "org.hibernate.tool.hbm2ddl.MultipleLinesSqlCommandExtractor");

    factory.setHibernateProperties(props);
    factory.setDataSource(dataSource());

    factory.setPackagesToScan("yggdrasil.model");

    try {
      factory.afterPropertiesSet();
    } catch (IOException ioe) {
      throw new RuntimeException(ioe);
    }

    return factory.getObject();
  }

  @Bean
  public PlatformTransactionManager txManager() {
    return new DataSourceTransactionManager(dataSource());
  }
}
