import moment from "moment";
import { NexusGenRootTypes } from "src/nexus-typegen";

const channelActivityFixture = (
  age: number,
  sequence?: number
): NexusGenRootTypes["User"] => ({
  id: `user-id-${sequence || "0"}`,
  name: `User Name ${sequence || "0"}`,
  image: `http://example.com/image-${sequence || "0"}.png`,
  lastActivity: moment().subtract(age, "seconds").toDate(),
});

export default channelActivityFixture;
