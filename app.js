require("dotenv/config");
require("./db");

const express = require("express");
const hbs = require("hbs");
const app = express();

require("./config")(app)
require("./routes/index")(app)

const projectName = "metalify";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}`;
app.locals.subtitle = "A web for all your metal needs 🤘🏻"

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

require("./error-handling")(app);
module.exports = app;