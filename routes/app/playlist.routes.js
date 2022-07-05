const router = require("express").Router();

const alert = require("alert");
const isLoggedIn = require("../../middleware/isLoggedIn");
const Playlist = require("../../models/Playlist.model");
const User = require("../../models/User.model");
const SpotifyWebApi = require('../../app');
const track = require('../../models/track.model')

router.get('/new-playlist',(req, res, next) => {
  res.render('user/new-playlist.hbs')
})


router.post('/new-playlist', (req, res, next) => {
  const {newplaylist} = req.body 
   console.log(newplaylist)
  Playlist.create({
     playlistname: newplaylist
      })
      .then((result) => {
        res.render('user/my-playlist.hbs', {result})
      })
      .catch((err) => {
        next(err);
      });
      
    });

    router.get('/my-playlist',(req, res, next) => {
      res.render('user/my-playlist.hbs')
    });

module.exports = router;