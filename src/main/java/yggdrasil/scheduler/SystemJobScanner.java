package yggdrasil.scheduler;

import javax.annotation.Resource;

import org.quartz.Job;
import org.quartz.impl.JobDetailImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.MutablePropertyValues;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.GenericBeanDefinition;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AnnotationTypeFilter;
import org.springframework.core.type.filter.AssignableTypeFilter;
import org.springframework.stereotype.Component;

/**
 * This post processor scans for classes with the @SystemJob annotation on
 * {@link Job} implementations and injects JobDetail beans into the context
 * based on the contents of the annotation.
 *
 * @author jason
 */
@Component("systemJobScanner")
public class SystemJobScanner implements BeanFactoryPostProcessor {
  /** Class logger. */
  private static final Logger log = LoggerFactory.getLogger(SystemJobScanner.class);

  @Resource
  private ApplicationContext context;

  @SuppressWarnings("unchecked")
  @Override
  public void postProcessBeanFactory(final ConfigurableListableBeanFactory beanFactory)
      throws BeansException {
    final BeanDefinitionRegistry registry = (BeanDefinitionRegistry) beanFactory;

    final ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(
        false);
    scanner.addIncludeFilter(new AnnotationTypeFilter(SystemJob.class));
    scanner.addIncludeFilter(new AssignableTypeFilter(Job.class));

    for (BeanDefinition bd : scanner.findCandidateComponents("yggdrasil.scheduler.jobs")) {
      final String jobClassname = bd.getBeanClassName();
      try {
        final Class<? extends Job> jobClass = (Class<? extends Job>) Class.forName(jobClassname);
        final SystemJob annotation = jobClass.getAnnotation(SystemJob.class);

        final GenericBeanDefinition jobDetailsBean = new GenericBeanDefinition();
        jobDetailsBean.setBeanClassName(JobDetailImpl.class.getName());
        jobDetailsBean.setAutowireCandidate(true);

        final MutablePropertyValues props = new MutablePropertyValues();
        props.add("name", annotation.value());
        if (annotation.group().length() > 0) {
          props.add("group", annotation.group());
        }
        if (annotation.description().length() > 0) {
          props.add("description", annotation.description());
        }
        props.add("durability", true);
        props.add("jobClass", jobClass);
        jobDetailsBean.setPropertyValues(props);

        registry.registerBeanDefinition(annotation.value(), jobDetailsBean);
        log.info("Registering system job " + annotation.value() + " [" + jobClassname + "]");
      } catch (ClassNotFoundException e) {
        log.error("ClassNotFoundException: job classname " + jobClassname + " not found");
      }
    }
  }
}
