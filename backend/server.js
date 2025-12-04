require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Category = require("./models/Category");
const Cake = require("./models/Cake");

const app = express();
app.use(cors());
app.use(express.json());

// CONNECT DATABASE
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/cake-shop";

mongoose
  .connect(mongoUrl)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err.message));


// =====================
// GET ALL CATEGORIES
// =====================
app.get("/categories", async (req, res) => {
  try {
    const cat = await Category.find();
    res.json(cat);
  } catch {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});


// =====================
// FILTER OPTIONS
// =====================
app.get("/filter-options", async (req, res) => {
  try {
    const cakes = await Cake.find();

    const categories = [...new Set(cakes.flatMap(c => c.categories || []))];
    const flavours = [...new Set(cakes.map(c => c.flavour).filter(Boolean))];
    const weights = [...new Set(cakes.flatMap(c => c.weightOptions || []))];
    const vegOptions = [...new Set(cakes.map(c => c.veg ? "veg" : "nonveg"))];

    const allPrices = cakes.flatMap(c => c.prices || []);

    const priceRange = {
      min: allPrices.length ? Math.min(...allPrices) : 0,
      max: allPrices.length ? Math.max(...allPrices) : 0
    };

    res.json({ categories, flavours, weights, vegOptions, priceRange });

  } catch (err) {
    console.error("Filter options error:", err);
    res.status(500).json({ error: "Failed to fetch filter options" });
  }
});


// ==============================
// ⭐ SEARCH SUGGESTIONS (IMPORTANT: MUST COME BEFORE /cakes/:category)
// ==============================
app.get("/search-suggestions", async (req, res) => {
  try {
    const q = req.query.q || "";
    if (!q.trim()) return res.json([]);

    const regex = new RegExp(q, "i");

    const results = await Cake.find(
      {
        $or: [
          { name: regex },
          { flavour: regex },
          { categories: regex }
        ]
      },
      { name: 1, flavour: 1, categories: 1 }
    ).limit(10);

    const suggestions = [];

    results.forEach(cake => {
      if (cake.name?.match(regex)) suggestions.push(cake.name);
      if (cake.flavour?.match(regex)) suggestions.push(cake.flavour);
      (cake.categories || []).forEach(cat => {
        if (cat.match(regex)) suggestions.push(cat);
      });
    });

    res.json([...new Set(suggestions)]); // remove duplicates

  } catch (err) {
    console.error("Suggestion error:", err);
    res.status(500).json([]);
  }
});


// =====================
// TOKENIZED SEARCH PAGE
// =====================
app.get("/search", async (req, res) => {
  try {
    const q = req.query.q || "";

    if (!q.trim()) return res.json([]);

    const tokens = q
      .toLowerCase()
      .split(" ")
      .map(t => t.trim())
      .filter(Boolean);

    const orConditions = [];

    tokens.forEach(token => {
      const regex = new RegExp(token, "i");

      orConditions.push({ name: regex });
      orConditions.push({ flavour: regex });
      orConditions.push({ categories: regex });
      orConditions.push({ tags: regex });
      orConditions.push({ longDescription: regex });
      orConditions.push({ weightOptions: regex });
    });

    const results = await Cake.find({ $or: orConditions }).limit(50);

    res.json(results);

  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});


// =====================
// FILTERED CAKES
// =====================
app.get("/cakes/filter", async (req, res) => {
  try {
    let { category, flavour, weight, veg, sort } = req.query;

    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const query = {};

    if (veg && veg !== "all") query.veg = veg === "veg";

    if (category && category !== "all") {
      const rx = new RegExp(`^${escapeRegex(category)}$`, "i");
      query.categories = { $elemMatch: { $regex: rx } };
    }

    if (flavour && flavour !== "all") {
      const rx = new RegExp(`^${escapeRegex(flavour)}$`, "i");
      query.flavour = { $regex: rx };
    }

    if (weight && weight !== "all") {
      const rx = new RegExp(`^${escapeRegex(weight)}$`, "i");
      query.weightOptions = { $elemMatch: { $regex: rx } };
    }

    let cakes = await Cake.find(query);

    if (sort === "low") cakes.sort((a, b) => (a.prices[0] || 0) - (b.prices[0] || 0));
    if (sort === "high") cakes.sort((a, b) => (b.prices[0] || 0) - (a.prices[0] || 0));

    res.json(cakes);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cakes" });
  }
});


// =====================
// GET ALL CAKES
// =====================
app.get("/cakes", async (req, res) => {
  try {
    const cakes = await Cake.find();
    res.json(cakes);
  } catch {
    res.status(500).json({ error: "Failed to fetch cakes" });
  }
});


// =====================
// GET CAKES BY CATEGORY
// =====================
app.get("/cakes/:category", async (req, res) => {
  try {
    const q = req.params.category;
    const cakes = await Cake.find({
      $or: [
        { categories: q },
        { category: q }
      ]
    });
    res.json(cakes);
  } catch {
    res.status(500).json({ error: "Failed to fetch category cakes" });
  }
});


// =====================
// SINGLE CAKE
// =====================
app.get("/cake/:id", async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);
    if (!cake) return res.status(404).json({ error: "Cake not found" });
    res.json(cake);
  } catch {
    res.status(500).json({ error: "Failed to fetch cake details" });
  }
});


// =====================
// RELATED CAKES
// =====================
app.get("/related-cakes/:id", async (req, res) => {
  try {
    if (mongoConnected) {
      const cake = await Cake.findById(req.params.id);
      if (!cake) return res.status(404).json({ error: "Cake not found" });

      const related = await Cake.find({
        _id: { $ne: cake._id },
        categories: { $in: cake.categories }
      }).limit(10);

      res.json(related);
    } else {
      // Find the cake in mock data
      const cake = mockCakes.find(c => c._id === req.params.id);
      if (!cake) return res.status(404).json({ error: "Cake not found" });

      // Find related cakes by category
      const related = mockCakes.filter(c =>
        c._id !== cake._id &&
        c.categories.some(cat => cake.categories.includes(cat))
      ).slice(0, 10);

      res.json(related);
    }

  } catch {
    res.json([]);
  }
});


// =====================
// START SERVER
// =====================
app.listen(5000, () => console.log("Server running on port 5000"));
