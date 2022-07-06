module.exports = (app) => {
  app.use("/", require("./auth.routes"));
  app.use("/", require("./app/results.routes"));
  app.use("/profile", require("./app/user.routes.js"));
  app.use("/playlist", require("./app/playlist.routes.js"));
  app.use("/search", require("./app/search.routes.js"));
};
