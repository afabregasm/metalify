const router = require("express").Router();
const Playlist = require("../../models/Playlist.model");
const User = require("../../models/User.model");

router.get('/new-playlist',(req, res, next) => {
  res.render('user/new-playlist.hbs', {user: {playlistname: ''}})
})


router.post('/new-playlist', (req, res, next) => {
  const {newplaylist} = req.body 
   console.log(newplaylist)
  Playlist.create({
     playlistname: newplaylist
      })
      .then((user) => {
        res.render('user/my-playlist.hbs', {user: {playlistname: newplaylist}})
      })
      .catch((err) => {
        next(err);
      });
      
    });

    router.get('/my-playlist',(req, res, next) => {
      res.render('user/my-playlist.hbs')
    });

  /*  Playlist.create()
.then((newplaylist) => {
  User.findByIdAndUpdate({$push: {newplaylist},
  }) .then(() => {
    res.redirect("/profile")
  })
}); */


module.exports = router;