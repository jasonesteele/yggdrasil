const userFixture = (properties, sequence) => ({
  id: `user-id-${sequence || "0"}`,
  name: `User Name ${sequence || "0"}`,
  image: `http://example.com/image-${sequence || "0"}.png`,
  ...(properties ? properties : {}),
});

export default userFixture;
