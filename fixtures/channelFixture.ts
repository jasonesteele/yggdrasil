import { NexusGenRootTypes } from "src/nexus-typegen";

const channelFixture = (
  properties: NexusGenRootTypes["Channel"],
  sequence: number
) => ({
  id: `channel-id-${sequence || "0"}`,
  name: `Channel ${sequence || "0"}`,
  users: [],
  messages: [],
  global: false,
  ...(properties ? properties : {}),
});

export default channelFixture;
