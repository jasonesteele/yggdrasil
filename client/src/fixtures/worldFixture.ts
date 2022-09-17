import userFixture from "./userFixture";

const worldFixture = (
  properties?: Partial<World>,
  sequence?: number
): World => ({
  __typename: "World",
  id: properties?.id || `world-id-${sequence || "0"}`,
  name: properties?.name || `world-name-${sequence || "0"}`,
  description:
    properties?.description || `world-description-${sequence || "0"}`,
  image: properties?.image || `world-image-${sequence || "0"}`,
  owner: properties?.owner || userFixture(undefined, sequence),
});

export default worldFixture;
