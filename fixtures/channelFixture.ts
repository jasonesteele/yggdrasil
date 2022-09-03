import { NexusGenRootTypes } from "src/nexus-typegen";

const channelFixture = (
  properties?: NexusGenRootTypes["Channel"],
  sequence?: number
): NexusGenRootTypes["Channel"] => ({
  id: `channel-id-${sequence || "0"}`,
  name: `Channel ${sequence || "0"}`,
  users: [],
  messages: [],
  ...(properties ? properties : {}),
});

export default channelFixture;
