const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/graphql",
    createProxyMiddleware("/graphql", {
      target: "http://localhost:3010",
      changeOrigin: true,
    })
  );

  app.use(
    "/auth",
    createProxyMiddleware("/auth", {
      target: "http://localhost:3010",
      changeOrigin: true,
    })
  );

  app.use(
    "/socket.io",
    createProxyMiddleware("/socket.io", {
      target: "http://localhost:4000",
      ws: true,
      changeOrigin: true,
    })
  );
};
