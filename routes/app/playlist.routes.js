const router = require("express").Router();
const Playlist = require("../../models/Playlist.model");
const User = require("../../models/User.model");

router.get("/new-playlist", (req, res, next) => {
  res.render("user/new-playlist.hbs", { user: { playlistname: "" } });
});

router.get("/new-playlist", (req, res, next) => {
  Playlist.create()
    .then(() => {
      res.render("user/my-playlist.hbs");
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/new-playlist", (req, res, next) => {
  const { newplaylist } = req.body;
  console.log(newplaylist);
  Playlist.create({
    playlistname: newplaylist,
  })
    .then((user) => {
      res.render("user/profile.hbs", { user: { playlistname: newplaylist } });
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/my-playlist", (req, res, next) => {
  Playlist.find()
    .then((response) => {
      res.render("user/my-playlist.hbs", { response });
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/my-playlist", (req, res, next) => {
  res.render("user/costume-playlist", { response });
});

router.get("/costume-playlist/:id", (req, res, next) => {
  const { id } = req.params;
  Playlist.findById(id)
  .then((playlist) => {
    res.render("user/costume-playlist", { playlist });
  })
  .catch((err) => {
    next(err);
  });
});

router.post("/:id/delete", (req, res, next) => {
  console.log(req.params.id)
  Playlist.findByIdAndRemove(req.params.id)
  .then((response) => {
    console.log(response)
    res.redirect('/')
  })
  .catch((err) => {
    next(err);
  });
});

router.post("/:id/update", (req, res, next) => {
  console.log(req.params.id)
  const {playlistname} = req.params
  Playlist.findByIdAndUpdate(req.params.id, {playlistname})
  .then((response) => {
    console.log(response)
    res.redirect('user/update-form')
  })
  .catch((err) => {
    next(err);
  });
});

/*router.post('/new-playlist', (req, res, next) => {
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
    }); */

/*  Playlist.create()
.then((newplaylist) => {
  User.findByIdAndUpdate({$push: {newplaylist},
  }) .then(() => {
    res.redirect("/profile")
  })
}); */

module.exports = router;
