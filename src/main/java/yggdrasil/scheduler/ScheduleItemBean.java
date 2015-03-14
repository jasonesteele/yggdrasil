package yggdrasil.scheduler;

import java.util.Map;

/**
 * Bean for schedule item information in the scheduling JSON file.
 *
 * @author jason
 */
public class ScheduleItemBean {
  /** Optional name of the trigger. */
  private String trigger;

  /** Cron expression for running the job. */
  private String cron;

  /** Configuration for the job. */
  private Map<String, String> jobData;

  /** Job name. */
  private String job;

  /** Optional comment or description for job. */
  private String comment;

  /** Priority for the job. */
  private Integer priority;

  /** Instruction to scheduler on how to handler misfires. */
  private MisfireInstruction onMisfire;

  public String getComment() {
    return comment;
  }

  public String getCron() {
    return cron;
  }

  public String getJob() {
    return job;
  }

  public Map<String, String> getJobData() {
    return jobData;
  }

  public String getJobGroup() {
    String group = null;
    if (this.job != null) {
      final int idx = this.job.indexOf('.');
      if (idx > 0) {
        group = this.job.substring(0, idx);
      }
    }
    return group;
  }

  public String getJobName() {
    String name = null;
    if (this.job != null) {
      final int idx = this.job.indexOf('.');
      if (idx > 0) {
        name = this.job.substring(idx + 1);
      } else {
        name = this.job;
      }
    }
    return name;
  }

  public MisfireInstruction getOnMisfire() {
    return onMisfire;
  }

  public Integer getPriority() {
    return priority;
  }

  public String getTrigger() {
    return trigger;
  }

  public String getTriggerGroup() {
    String group = null;
    if (this.trigger != null) {
      final int idx = this.trigger.indexOf('.');
      if (idx > 0) {
        group = this.trigger.substring(0, idx);
      }
    }
    return group;
  }

  public String getTriggerName() {
    String name = null;
    if (this.trigger != null) {
      final int idx = this.trigger.indexOf('.');
      if (idx > 0) {
        name = this.trigger.substring(idx + 1);
      } else {
        name = this.trigger;
      }
    }
    return name;
  }

  public void setComment(final String comment) {
    this.comment = comment;
  }

  public void setCron(final String cron) {
    this.cron = cron;
  }

  public void setJob(final String job) {
    this.job = job;
  }

  public void setJobData(final Map<String, String> jobData) {
    this.jobData = jobData;
  }

  public void setOnMisfire(final MisfireInstruction onMisfire) {
    this.onMisfire = onMisfire;
  }

  public void setPriority(final Integer priority) {
    this.priority = priority;
  }

  public void setTrigger(final String trigger) {
    this.trigger = trigger;
  }
}
