const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const characterSchema = new Schema(
  {
    name: String,
    status: String,
    species: String,
    gender: String,
    image: String,
    apiId: Number
  },
  {
    timestamps: true,
  }
);


characterSchema.pre("save", function(next) {
  // console.log(this)

  const nameToUpper = this.name.split(' ').map(word => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(' ')

  this.name = nameToUpper

    next();
});


// const Character = model("Character", userSchema);

module.exports = model("Character", characterSchema);
