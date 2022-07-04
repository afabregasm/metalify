const { Schema, model } = require("mongoose");

const playlistSchema = new Schema(
  {
    name: String,
    status: String,
    species: String,
    gender: String,
    image: String,
    apiId: Number,
  },
  {
    timestamps: true,
  }
);

playlistSchema.pre("save", function (next) {
  const nameToUpper = this.name
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
  this.name = nameToUpper;
  next();
});

module.exports = model("Playlist", playlistSchema);
