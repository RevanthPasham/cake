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
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/cake-shop';
mongoose.connect(mongoUrl, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err.message));


// ============================================================
// GET ALL CATEGORIES
// ============================================================
app.get("/categories", async (req, res) => {
  try {
    const cat = await Category.find();
    res.json(cat);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});


// ============================================================
// GET FILTER OPTIONS (ONLY THIS ROUTE!)
// ============================================================
app.get("/filter-options", async (req, res) => {
  try {
    const cakes = await Cake.find();

    const categories = [...new Set(cakes.flatMap(c => c.categories || []))];
    const flavours = [...new Set(cakes.map(c => c.flavour).filter(Boolean))];
    const weights = [...new Set(cakes.flatMap(c => c.weightOptions || []))];
    const vegOptions = [...new Set(cakes.map(c => c.veg ? 'veg' : 'nonveg'))];

    const allPrices = cakes.flatMap(c => c.prices || []);
    const priceRange = {
      min: allPrices.length ? Math.min(...allPrices) : 0,
      max: allPrices.length ? Math.max(...allPrices) : 0
    };

    res.json({ categories, flavours, weights, vegOptions, priceRange });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch filter options" });
  }
});


// ============================================================
// FILTER CAKES
// ============================================================
app.get("/cakes/filter", async (req, res) => {
  try {
    let { category, flavour, weight, veg, sort } = req.query;

    const escapeRegex = (s) =>
      typeof s === "string" ? s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";

    const query = {};

    if (veg && veg !== "all") {
      query.veg = veg === "veg";
    }

    if (category && category !== "all") {
      query.categories = { $elemMatch: { $regex: new RegExp(`^${escapeRegex(category)}$`, "i") } };
    }

    if (flavour && flavour !== "all") {
      query.flavour = { $regex: new RegExp(`^${escapeRegex(flavour)}$`, "i") };
    }

    if (weight && weight !== "all") {
      query.weightOptions = { $elemMatch: { $regex: new RegExp(`^${escapeRegex(weight)}$`, "i") } };
    }

    let cakes = await Cake.find(query);

    if (sort === "low") {
      cakes.sort((a, b) => (a.prices[0] || 0) - (b.prices[0] || 0));
    } else if (sort === "high") {
      cakes.sort((a, b) => (b.prices[0] || 0) - (a.prices[0] || 0));
    }

    res.json(cakes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch filtered cakes" });
  }
});


// ============================================================
// GET ALL CAKES (FULL DATA!) — Used by CategoryPage
// ============================================================
app.get("/cakes", async (req, res) => {
  try {
    const cakes = await Cake.find();
    res.json(cakes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cakes" });
  }
});


// ============================================================
// GET SINGLE CAKE BY ID — Used by CakeDetail
// ============================================================
app.get("/cake/:id", async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);
    if (!cake) return res.status(404).json({ error: "Cake not found" });
    res.json(cake);
  } catch (err) {
    res.status(500).json({ error: "Error fetching cake details" });
  }
});


// ============================================================
// RELATED CAKES — used on detail page
// ============================================================
app.get("/related-cakes/:id", async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);
    if (!cake) return res.status(404).json({ error: "Cake not found" });

    const related = await Cake.find({
      _id: { $ne: cake._id },
      categories: { $in: cake.categories }
    }).limit(10);

    res.json(related);
  } catch {
    res.status(500).json({ error: "Failed to load related cakes" });
  }
});


// ============================================================
// CREATE CAKE
// ============================================================
app.post("/cakes", async (req, res) => {
  try {
    const cake = new Cake(req.body);
    await cake.save();
    res.json({ message: "Cake added!", cake });
  } catch (err) {
    res.status(500).json({ error: "Failed to add cake" });
  }
});


// ============================================================
// CREATE CATEGORY
// ============================================================
app.post("/categories", async (req, res) => {
  try {
    const cat = new Category(req.body);
    await cat.save();
    res.json({ message: "Category added!", cat });
  } catch (err) {
    res.status(500).json({ error: "Failed to add category" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
