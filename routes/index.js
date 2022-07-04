module.exports = (app) => {

app.use("/auth", require('./auth'))
app.use("/", require('./app/playlist.routes'))
app.use("/", require('./app/user.routes.js'))

}