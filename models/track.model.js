const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const trackSchema = new Schema(
  {
    name: String,
    track: [
      {
        type: Schema.Types.ObjectId,
        ref: "Playlist",
      },
    ],
 
  });

module.exports = model("Track", trackSchema);
