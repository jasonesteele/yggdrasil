const userFixture = (properties?: Partial<User>, sequence?: number): User => ({
  id: `user-id-${sequence || "0"}`,
  name: `User Name ${sequence || "0"}`,
  image: `http://example.com/image-${sequence || "0"}.png`,
  online: !!properties?.online,
});

export default userFixture;
