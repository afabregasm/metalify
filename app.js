require("dotenv/config");
require("./db");

const express = require("express");
const hbs = require("hbs");
const app = express();

require("./config")(app);
require("./routes/index")(app);

const projectName = "metalify";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}`;
app.locals.subtitle = "A web for all your metal needs 🤘🏻";

require("./error-handling")(app);
module.exports = app;
