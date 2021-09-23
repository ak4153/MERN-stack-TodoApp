const express = require("express");
const app = express();
const mongoose = require("mongoose");
const todoModel = require("./models/Todo");
const cors = require("cors");

app.use(express.json());
app.use(cors());

mongoose.connect(
  "mongodb+srv://newuser:36987410@todo.u8fnz.mongodb.net/todos?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);

app.post("/insert", async (req, res) => {
  const todoText = req.body;
  console.log(todoText);
  const todo = new todoModel({
    todosArray: todoText,
  });
  try {
    await todo.save();
    console.log("success");
  } catch (err) {
    console.log(err);
  }
});

app.get("/read", async (req, res) => {
  todoModel.find({}, (err, result) => {
    if (err) res.send(err);
    res.send(result);
  });
});

app.delete("/delete/:dbId", async (req, res) => {
  const todoIdToRemove = req.params.dbId;
  console.log(todoIdToRemove);
  try {
    await todoModel.findByIdAndDelete(todoIdToRemove).exec();
    console.log("deleted");
    res.send("deleted");
  } catch (err) {
    console.log(err);
  }
});

app.listen(process.env.PORT || 3000);

//local host listening
// app.listen(3001, () => {
//   console.log("running 3001");
// });
