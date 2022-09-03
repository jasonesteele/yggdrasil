const channelFixture = (properties, sequence) => ({
  id: `channel-id-${sequence || "0"}`,
  name: `Channel ${sequence || "0"}`,
  users: [],
  messages: [],
  global: false,
  ...(properties ? properties : {}),
});

export default channelFixture;
