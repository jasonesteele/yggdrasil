package yggdrasil.scheduler;

import static org.quartz.CronScheduleBuilder.cronSchedule;
import static org.quartz.TriggerBuilder.newTrigger;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.quartz.CronScheduleBuilder;
import org.quartz.CronTrigger;
import org.quartz.JobDataMap;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * This class supports the builder pattern for creating a list of schedule items
 * (triggers associated with a job) for Quartz. *
 *
 * @author jason
 */
public class ScheduleItemListBuilder {
  /**
   * Creates the builder.
   *
   * @param path
   *          classpath-relative path to schedule file
   * @return builder for schedule items
   * @throws IOException
   *           if there was an error finding, loading, parsing or demarshalling
   *           the schedule file
   */
  public static ScheduleItemListBuilder loadSchedule(final String path) throws IOException {
    @SuppressWarnings("serial")
    final ObjectMapper mapper = new ObjectMapper(new JsonFactory() {
      @Override
      public JsonParser createParser(final InputStream is) throws IOException, JsonParseException {
        final JsonParser parser = super.createParser(is);
        parser.enable(JsonParser.Feature.ALLOW_COMMENTS);
        return parser;
      }
    });
    final ClassLoader cl = Thread.currentThread().getContextClassLoader();
    final InputStream is = cl.getResourceAsStream(path);
    if (null == is) {
      throw new FileNotFoundException("schedule file '" + path + "' not found on the classpath");
    }
    final List<ScheduleItemBean> scheduleItems = mapper.readValue(is,
        new TypeReference<List<ScheduleItemBean>>() {
        });
    return new ScheduleItemListBuilder(path, scheduleItems);
  }

  /** List of schedule items being built. */
  private final List<ScheduleItemBean> scheduleItems;

  /** Path, URL or name of resource schedule was loaded from. */
  private final String path;

  /**
   * Creates the schedule item list builder with an initial set of schedule
   * items.
   *
   * @param path
   *          path, URL or name of resource schedule was loaded from
   *
   * @param scheduleItems
   *          list of schedule items
   */
  private ScheduleItemListBuilder(final String path, final List<ScheduleItemBean> scheduleItems) {
    this.path = path;
    this.scheduleItems = new ArrayList<ScheduleItemBean>(scheduleItems);
  }

  /**
   * Builds the list of triggers.
   *
   * @return list of triggers constructed by the builder
   */
  public List<Trigger> build() {
    final List<Trigger> triggers = new ArrayList<Trigger>();
    for (ScheduleItemBean scheduleItem : scheduleItems) {
      final CronScheduleBuilder scheduleBuilder = cronSchedule(scheduleItem.getCron());
      if (null != scheduleItem.getOnMisfire()) {
        switch (scheduleItem.getOnMisfire()) {
        case DO_NOTHING:
          scheduleBuilder.withMisfireHandlingInstructionDoNothing();
          break;
        case FIRE_AND_PROCEED:
          scheduleBuilder.withMisfireHandlingInstructionFireAndProceed();
          break;
        case IGNORE_MISFIRES:
          scheduleBuilder.withMisfireHandlingInstructionIgnoreMisfires();
          break;
        default:
          // Do nothing
          break;
        }
      }

      // @formatter:off
          final TriggerBuilder<CronTrigger> builder = newTrigger()
                  .forJob(scheduleItem.getJobName(), scheduleItem.getJobGroup())
                  .withDescription(scheduleItem.getComment() == null ? "loaded from '" + path + "'" : scheduleItem.getComment())
                  .withPriority(scheduleItem.getPriority() == null ? Trigger.DEFAULT_PRIORITY : scheduleItem.getPriority())
                  .withSchedule(scheduleBuilder);
          // @formatter:on

      if (null != scheduleItem.getTrigger()) {
        builder.withIdentity(scheduleItem.getTriggerName(), scheduleItem.getTriggerGroup());
      }

      if (null != scheduleItem.getJobData()) {
        builder.usingJobData(new JobDataMap(scheduleItem.getJobData()));
      }

      triggers.add(builder.build());
    }
    return triggers;
  }
}
