const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Import Cat model
const Cat = require("./models/Cat");

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://laflame4308:jrIstXrzVLuRHFID@cluster0.xl9t6gu.mongodb.net/cat_crud_db?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes

// Render page with cat images
app.get("/", async (req, res) => {
  try {
    const cats = await Cat.find();
    res.json(cats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a new cat
app.post("/cats", upload.single("photo"), async (req, res) => {
  try {
    const { name, breed, age } = req.body;
    const cat = new Cat({
      name,
      breed,
      age,
      image: {
        data: fs.readFileSync(req.file.path),
        contentType: req.file.mimetype,
      },
    });
    await cat.save();
    res.status(201).json(cat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update cat information
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

// Delete a cat
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
