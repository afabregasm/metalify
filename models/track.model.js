const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const trackSchema = new Schema(
  {
    name: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Track", trackSchema);