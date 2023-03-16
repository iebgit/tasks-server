require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(
  `mongodb+srv://ibis:${process.env.PASSWORD}@tasks.i4aornr.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  completed: Boolean,
});

const Task = mongoose.model("Task", TaskSchema);

// CREATE a new task
app.post("/tasks", async (req, res) => {
  const { title, description } = req.body;
  const task = new Task({
    title,
    description,
    date: new Date(),
    completed: false,
  });
  await task.save();
  res.json(task);
});

// READ all tasks
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// READ a single task
app.get("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.json(task);
});

// UPDATE a task
app.patch("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  const task = await Task.findByIdAndUpdate(
    id,
    {
      title,
      description,
      date: new Date(),
      completed,
    },
    { new: true }
  );
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.json(task);
});

// DELETE a task
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByIdAndDelete(id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.json({ message: "Task deleted successfully" });
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
