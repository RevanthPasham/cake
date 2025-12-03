require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Category = require("./models/Category");
const Cake = require("./models/Cake");

const app = express();
app.use(cors());
app.use(express.json());

// CONNECT TO MONGO
const mongoUrl = process.env.MONGO_URL;
mongoose
  .connect(mongoUrl)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// GET categories
app.get("/categories", async (req, res) => {
  try {
    const cat = await Category.find();
    res.json(cat);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// GET all cakes
app.get("/cakes", async (req, res) => {
  try {
    const cakes = await Cake.find();
    res.json(cakes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cakes" });
  }
});

// GET cakes by category
app.get("/cakes/:category", async (req, res) => {
  try {
    // Support both legacy `category` and newer `categories` array
    const q = req.params.category;
    const cakes = await Cake.find({ $or: [{ categories: q }, { category: q }] });
    res.json(cakes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cakes" });
  }
});

// GET cake by ID (IMPORTANT)
app.get("/cake/:id", async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);
    if (!cake) return res.status(404).json({ error: "Cake not found" });
    res.json(cake);
  } catch (err) {
    res.status(500).json({ error: "Error fetching cake details" });
  }
});

// RELATED CAKES (only 10)
app.get("/related-cakes/:id", async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);
    if (!cake) return res.status(404).json({ error: "Cake not found" });

    const related = await Cake.find({
        _id: { $ne: cake._id },
        $or: [
          { categories: { $in: cake.categories || [] } },
          { category: cake.category }
        ]
    }).limit(10);

    res.json(related);
  } catch {
    res.status(500).json({ error: "Failed to fetch related cakes" });
  }
});

// ALL RELATED CAKES (full list)
app.get("/all-related-cakes/:id", async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);
    if (!cake) return res.status(404).json({ error: "Cake not found" });

    const relatedAll = await Cake.find({
      _id: { $ne: cake._id },
      categories: { $in: cake.categories },
    });

    res.json(relatedAll);
  } catch {
    res.status(500).json({ error: "Failed to fetch full related list" });
  }
});

// ADD CAKE
app.post("/cakes", async (req, res) => {
  try {
    const cake = new Cake(req.body);
    await cake.save();
    res.json({ message: "Cake added!", cake });
  } catch {
    res.status(500).json({ error: "Failed to add cake" });
  }
});

// ADD CATEGORY
app.post("/categories", async (req, res) => {
  try {
    const cat = new Category(req.body);
    await cat.save();
    res.json({ message: "Category added!", cat });
  } catch {
    res.status(500).json({ error: "Failed to add category" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
