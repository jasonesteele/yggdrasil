const userFixture = (properties?: Partial<User>, sequence?: number): User => ({
  __typename: "User",
  id: properties?.id || `user-id-${sequence || "0"}`,
  name: properties?.name || `User Name ${sequence || "0"}`,
  image: properties?.image || `http://example.com/image-${sequence || "0"}.png`,
  online: !!properties?.online,
});

export default userFixture;
