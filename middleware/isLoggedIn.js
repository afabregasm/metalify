module.exports = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  req.user = req.session.user;
  next();
};
