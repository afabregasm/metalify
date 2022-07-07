const router = require("express").Router();
const isLoggedIn = require("../../middleware/isLoggedIn");
const Playlist = require("../../models/Playlist.model");
const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

router.get("/", isLoggedIn, (req, res, next) => {
  res.render("search/form.hbs");
});

router.post("/results", isLoggedIn, async (req, res, next) => {
  const { value, type } = req.body;
  const userId = req.user._id;
  const savedPlaylists = await Playlist.find({ userId: userId });

  if (type === "song") {
    try {
      const track = await spotifyApi.searchTracks(value);
      const idArtist = track.body.tracks.items[0].album.artists[0].id;
      const getGenre = await spotifyApi.getArtist(idArtist);
      const genre = getGenre.body.genres;
      const stringGenre = genre.join(" ");
      const tracks = track.body.tracks.items.map((item) => {
        return { ...item, savedPlaylists };
      });

      if (stringGenre.includes("metal")) {
        res.render("search/tracks.hbs", {
          track: tracks,
        });
      } else {
        res.render("search/form.hbs", {
          errorMessage:
            "Error 404: Musical taste not found. Try with a true song 🤘🏻",
        });
      }
    } catch (e) {
      res.render("search/form.hbs", {
        errorMessage:
          "There was an error searching for the song, make sure you provided a valid input.",
      });
    }
  } else if (type === "artist") {
    spotifyApi
      .searchArtists(value)
      .then((artist) => {
        const genre = artist.body.artists.items[0].genres;
        let stringGenre = genre.join(" ");
        if (stringGenre.includes("metal")) {
          res.render("search/artists.hbs", {
            artist: artist.body.artists.items,
          });
        } else {
          res.render("search/form.hbs", {
            errorMessage:
              "Error 404: Musical taste not found. Try with a true musician 🤘🏻",
          });
        }
      })
      .catch(() => {
        res.render("search/form.hbs", {
          errorMessage:
            "There was an error searching for the artist, make sure you provided a valid input.",
        });
      });
  }
});

module.exports = router;
