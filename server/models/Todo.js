const mongoose = require("mongoose");
const todoScehma = new mongoose.Schema({
  todosArray: {},
});

const todo = mongoose.model("Todos1", todoScehma);

module.exports = todo;
