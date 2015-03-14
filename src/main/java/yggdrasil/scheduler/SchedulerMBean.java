package yggdrasil.scheduler;

import static org.quartz.SimpleScheduleBuilder.repeatSecondlyForTotalCount;
import static org.quartz.TriggerBuilder.newTrigger;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Set;

import javax.management.OperationsException;
import javax.management.openmbean.CompositeData;
import javax.management.openmbean.CompositeDataSupport;
import javax.management.openmbean.CompositeType;
import javax.management.openmbean.OpenDataException;
import javax.management.openmbean.OpenType;
import javax.management.openmbean.SimpleType;
import javax.management.openmbean.TabularData;
import javax.management.openmbean.TabularDataSupport;
import javax.management.openmbean.TabularType;

import org.quartz.CronTrigger;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SimpleScheduleBuilder;
import org.quartz.SimpleTrigger;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.TriggerKey;
import org.quartz.impl.matchers.GroupMatcher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.jmx.export.annotation.ManagedOperation;
import org.springframework.jmx.export.annotation.ManagedOperationParameter;
import org.springframework.jmx.export.annotation.ManagedOperationParameters;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.stereotype.Component;

/**
 *
 * @author jason
 */
@ManagedResource(objectName = "sss.quartz:name=SchedulerMBean", description = "Management and monitoring of the application scheduler.")
@Component
public class SchedulerMBean {
  /** Class logger. */
  private static final Logger log = LoggerFactory.getLogger(SchedulerMBean.class);

  @Autowired
  private Scheduler scheduler;

  /**
   * Parses a string in the format [&lt;group&gt;.]&lt;name&gt; and returns a
   * job key.
   *
   * @param keyStr
   *          job key string
   * @return job key
   */
  private JobKey createJobKey(final String keyStr) {
    JobKey key = null;
    if (keyStr != null) {
      final int idx = keyStr.indexOf(".");
      if (idx > 1 && idx < keyStr.length() - 1) {
        key = new JobKey(keyStr.substring(idx + 1), keyStr.substring(0, idx));
      } else {
        key = new JobKey(keyStr);
      }
    }
    return key;
  }

  @ManagedAttribute(defaultValue = "Returns the list of current jobs in the scheduler")
  public List<String> getJobs() throws SchedulerException {
    final List<String> jobs = new ArrayList<String>();
    for (JobKey jobKey : scheduler.getJobKeys(GroupMatcher.anyJobGroup())) {
      jobs.add(jobKey.toString());
    }
    return jobs;
  }

  @ManagedAttribute(defaultValue = "Returns the active triggers configured in the scheduler")
  public TabularData getSystemSchedule() throws OpenDataException, OperationsException {
    // @formatter:off
    final CompositeType bundleType = new CompositeType("Cron", "Cron schedule item",
        new String[] {"trigger", "description", "job", "cron", "lastRun" },
        new String[] { "Trigger Name", "Trigger Description", "Job Name", "Cron Expression for Trigger", "Timestamp of last trigger firing" },
        new OpenType[] { SimpleType.STRING, SimpleType.STRING, SimpleType.STRING, SimpleType.STRING, SimpleType.DATE });
    // @formatter:on
    final TabularType tableType = new TabularType("System Schedule",
        "Table of all cron-scheduled system jobs", bundleType, new String[] { "trigger" });
    final TabularData table = new TabularDataSupport(tableType);

    try {
      final Set<TriggerKey> triggerKeys = scheduler.getTriggerKeys(GroupMatcher.anyTriggerGroup());
      for (final TriggerKey triggerKey : triggerKeys) {
        final Trigger trigger = scheduler.getTrigger(triggerKey);
        String schedule = null;
        if (trigger instanceof CronTrigger) {
          schedule = ((CronTrigger) trigger).getCronExpression();
        }
        // @formatter:off
        final CompositeData data = new CompositeDataSupport(bundleType,
            new String[] { "trigger", "description", "job", "cron", "lastRun" },
            new Object[] { triggerKey.toString(), trigger.getDescription(), trigger.getJobKey().toString(),
              schedule, trigger.getPreviousFireTime() });
        // @formatter:on
        table.put(data);
      }
    } catch (SchedulerException se) {
      log.error("error listing jobs: " + se, se);
      throw new OperationsException(se.getMessage());
    }

    return table;
  }

  /**
   * Schedules the specified job for immediate execution.
   *
   * @param jobKey
   *          job name with optional job group prefix separated by a period
   * @throws OperationsException
   *           if there was an error in the operation
   */
  @ManagedOperation(description = "Invoke a system job immediately")
  @ManagedOperationParameters({ @ManagedOperationParameter(name = "jobKey", description = "[<group>.]<name>") })
  public void runJobImmediately(final String jobKey) throws OperationsException {
    log.info("scheduling " + jobKey + " to run immediately");
    try {
      // @formatter:off
      final TriggerBuilder<Trigger> builder = newTrigger()
          .withDescription("JMX invoked job")
          .withPriority(Trigger.DEFAULT_PRIORITY + 1)
          .forJob(createJobKey(jobKey))
          .startNow();
        // @formatter:on
      scheduler.scheduleJob(builder.build());
    } catch (Exception e) {
      log.error("error scheduling job: " + e, e);
      throw new OperationsException(e.getMessage());
    }
  }

  /**
   * Schedules the specified job for delayed execution. If there is a misfire,
   * the job does not run.
   *
   * @param jobKey
   *          job name with optional job group prefix separated by a period
   * @param delayS
   *          number of seconds to delay
   * @throws OperationsException
   *           if there was an error in the operation
   */
  @ManagedOperation(description = "Invoke a system job after a delay.  If the trigger misfires, it is not re-fired.")
  @ManagedOperationParameters({
      @ManagedOperationParameter(name = "jobKey", description = "[<group>.]<name>"),
      @ManagedOperationParameter(name = "delayS", description = "Number of seconds to delay before triggering job.") })
  public void runJobWithDelay(final String jobKey, final int delayS) throws OperationsException {
    try {
      log.info("scheduling " + jobKey + " to run after " + delayS + " seconds");

      final Calendar triggerStartTime = new GregorianCalendar();
      triggerStartTime.add(Calendar.SECOND, delayS);

      // @formatter:off
      final SimpleScheduleBuilder schedule = repeatSecondlyForTotalCount(1)
          .withMisfireHandlingInstructionNextWithRemainingCount();
      // @formatter:on

      // @formatter:off
      final TriggerBuilder<SimpleTrigger> builder = newTrigger()
          .withDescription("JMX invoked job")
          .withPriority(Trigger.DEFAULT_PRIORITY + 1)
          .forJob(createJobKey(jobKey))
          .withSchedule(schedule)
          .startAt(triggerStartTime.getTime());
      // @formatter:on
      scheduler.scheduleJob(builder.build());
    } catch (Exception e) {
      log.error("error scheduling job: " + e, e);
      throw new OperationsException(e.getMessage());
    }
  }

  /**
   * Schedules the specified job for delayed execution. If there is a misfire,
   * the job does not run.
   *
   * @param jobKey
   *          job name with optional job group prefix separated by a period
   * @param delayS
   *          number of seconds to delay
   * @throws OperationsException
   *           if there was an error in the operation
   */
  @ManagedOperation(description = "Invoke a system job after a delay.  If the trigger misfires, it is re-fired as soon as possible.")
  @ManagedOperationParameters({
      @ManagedOperationParameter(name = "jobKey", description = "[<group>.]<name>"),
      @ManagedOperationParameter(name = "delayS", description = "Number of seconds to delay before triggering job.") })
  public void runJobWithDelayPersistent(final String jobKey, final int delayS)
      throws OperationsException {
    try {
      log.info("scheduling " + jobKey + " to run after " + delayS + " seconds");

      final Calendar triggerStartTime = new GregorianCalendar();
      triggerStartTime.add(Calendar.SECOND, delayS);

      // @formatter:off
      final SimpleScheduleBuilder schedule = repeatSecondlyForTotalCount(1)
          .withMisfireHandlingInstructionFireNow();
      // @formatter:on

      // @formatter:off
      final TriggerBuilder<SimpleTrigger> builder = newTrigger()
          .withDescription("JMX invoked job")
          .withPriority(Trigger.DEFAULT_PRIORITY + 1)
          .forJob(createJobKey(jobKey))
          .withSchedule(schedule)
          .startAt(triggerStartTime.getTime());
      // @formatter:on
      scheduler.scheduleJob(builder.build());
    } catch (Exception e) {
      log.error("error scheduling job: " + e, e);
      throw new OperationsException(e.getMessage());
    }
  }
}
