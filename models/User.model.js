const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: String,
  password: String,
  playlists: [
    {
      type: Schema.Types.ObjectId,
      ref: "Playlist",
    },
  ],
});

const User = model("User", userSchema);
module.exports = User;
