const { Schema, model } = require("mongoose");

const playlistSchema = new Schema(
  {
    userId: String,
    playlistname: String,
    tracks: [String],
  },
  {
    timestamps: true,
  }
);

const Playlist = model("Playlist", playlistSchema);
module.exports = Playlist;
