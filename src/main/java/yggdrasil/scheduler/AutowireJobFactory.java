package yggdrasil.scheduler;

import javax.annotation.Resource;

import org.quartz.spi.TriggerFiredBundle;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.quartz.SpringBeanJobFactory;
import org.springframework.stereotype.Component;

/**
 * Job factory that supports auto-wiring of spring dependencies.
 *
 * @author jason
 */
@Component
public class AutowireJobFactory extends SpringBeanJobFactory {
  @Resource
  private ApplicationContext context;

  @Override
  protected Object createJobInstance(final TriggerFiredBundle bundle) throws Exception {
    final Object instance = super.createJobInstance(bundle);
    context.getAutowireCapableBeanFactory().autowireBean(instance);
    return instance;
  }
}
