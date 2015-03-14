package yggdrasil.scheduler;

import static yggdrasil.scheduler.ScheduleItemListBuilder.loadSchedule;

import java.io.IOException;
import java.util.Collection;
import java.util.List;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.BeanInitializationException;
import org.springframework.beans.factory.config.PropertiesFactoryBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ClassPathResource;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;

/**
 * Spring configuration for Quartz scheduler.
 *
 * @author jason
 */
@Configuration
@ComponentScan
public class SchedulerConfig {
  /** Class logger. */
  private static final Logger log = LoggerFactory.getLogger(SchedulerConfig.class);

  @Resource
  private Environment env;

  @Resource
  private DataSource dataSource;

  @Resource
  private ApplicationContext context;

  @Resource
  private Collection<JobDetail> systemJobs;

  @Resource
  private AutowireJobFactory autowireJobFactory;

  @Bean
  public PropertiesFactoryBean quartzPropertiesFactory() {
    // We never want Quartz to phone home for updates...
    System.setProperty("org.terracotta.quartz.skipUpdateCheck", "true");

    final PropertiesFactoryBean factory = new PropertiesFactoryBean();
    factory.setLocation(new ClassPathResource("quartz.properties"));
    return factory;
  }

  @Bean
  public Scheduler scheduler() {
    try {
      final Scheduler scheduler = schedulerFactory().getObject();
      // Register system jobs
      for (final JobDetail job : systemJobs) {
        log.info("Creating system job: " + job);
        scheduler.addJob(job, true);
      }

      // Register system triggers
      for (final Trigger trigger : systemSchedule()) {
        if (!scheduler.checkExists(trigger.getKey())) {
          log.info("Creating system trigger: " + trigger);
          scheduler.scheduleJob(trigger);
        } else {
          log.debug("system trigger already exists: " + trigger);
        }
      }

      return scheduler;
    } catch (SchedulerException | IOException e) {
      throw new BeanInitializationException("error initializing scheduler", e);
    }
  }

  @Bean
  public SchedulerFactoryBean schedulerFactory() {
    final SchedulerFactoryBean schedulerFactory = new SchedulerFactoryBean();
    try {
      schedulerFactory.setDataSource(dataSource);
      schedulerFactory.setQuartzProperties(quartzPropertiesFactory().getObject());
      schedulerFactory.setJobFactory(autowireJobFactory);
      return schedulerFactory;
    } catch (IOException ioe) {
      throw new BeanInitializationException("error loading Quartz properties", ioe);
    }
  }

  @Bean
  public List<Trigger> systemSchedule() throws IOException {
    final String scheduleFile = env.getProperty("schedule.system.file", "schedule.json");
    if (null == scheduleFile) {
      throw new BeanInitializationException("no system schedule file found (" + scheduleFile + ")");
    } else {
      return loadSchedule(scheduleFile).build();
    }
  }
}
