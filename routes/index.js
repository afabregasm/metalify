module.exports = (app) => {
  app.use("/", require("./auth.routes"));
  app.use("/profile", require("./app/user.routes.js"));
  app.use("/playlist", require("./app/playlist.routes"));
};
