const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const Cat = require("./models/Cat");

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://laflame4308:jrIstXrzVLuRHFID@cluster0.xl9t6gu.mongodb.net/cat_crud_db?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get("/", async (req, res) => {
  try {
    const cats = await Cat.find();
    res.json(cats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/cats", async (req, res) => {
  try {
    const { name, breed, age } = req.body;
    const cat = new Cat({ name, breed, age });
    await cat.save();
    res.status(201).json(cat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/update/:id", async (req, res) => {
  try {
    const { name, breed, age } = req.body;
    await Cat.findByIdAndUpdate(req.params.id, { name, breed, age });
    res.json({ message: "Cat updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/delete/:id", async (req, res) => {
  try {
    await Cat.findByIdAndDelete(req.params.id);
    res.json({ message: "Cat deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
