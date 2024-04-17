const mongoose = require("mongoose");

const catSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  breed: String,
  age: Number,
});

const Cat = mongoose.model("Cat", catSchema);

module.exports = Cat;
