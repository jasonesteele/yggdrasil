package yggdrasil.jmx;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jmx.export.annotation.AnnotationMBeanExporter;

/**
 * Spring configuration for setting up JMX.
 *
 * @author jason
 */
@Configuration
public class JmxConfig {
  @Bean
  public AnnotationMBeanExporter annotationMBeanExporter() {
    return new AnnotationMBeanExporter();
  }
}
