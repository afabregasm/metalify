const { Schema, model } = require("mongoose");


const playlistSchema = new Schema(
  {
    playlistname: String
  },
  {
    timestamps: true,
  }
);


module.exports = model("Playlist", playlistSchema);
