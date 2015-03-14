package yggdrasil.scheduler;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to auto-register Quartz jobs with the system scheduler.
 *
 * @author jason
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface SystemJob {
  /**
   * Description of the job.
   */
  String description() default "";

  /**
   * Group of the job.
   */
  String group() default "";

  /**
   * Name of the job
   */
  String value();
}
