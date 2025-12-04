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

// GET filter options
app.get("/filter-options", async (req, res) => {
  console.log("Filter options endpoint called");
  try {
    // Try to get data from database, fallback to mock data if MongoDB not connected
    let categories = [], flavours = [], weights = [], vegOptions = [], priceRange = { min: 0, max: 0 };

    try {
      const cakes = await Cake.find();
      console.log("Found", cakes.length, "cakes in database");

      // Extract unique values
      categories = [...new Set(cakes.flatMap(cake => cake.categories || []))];
      flavours = [...new Set(cakes.map(cake => cake.flavour).filter(Boolean))];
      weights = [...new Set(cakes.flatMap(cake => cake.weightOptions || []))];
      vegOptions = [...new Set(cakes.map(cake => cake.veg ? 'veg' : 'nonveg'))];

      // Get price range
      const allPrices = cakes.flatMap(cake => cake.prices || []);
      priceRange = {
        min: allPrices.length > 0 ? Math.min(...allPrices) : 0,
        max: allPrices.length > 0 ? Math.max(...allPrices) : 0
      };
    } catch (dbError) {
      console.log("Database not available, using mock data");
      // Mock data for when MongoDB is not running
      categories = ['Chocolate', 'Wedding', 'Birthday'];
      flavours = ['Dark Chocolate', 'Vanilla'];
      weights = ['500g', '1kg'];
      vegOptions = ['veg'];
      priceRange = { min: 400, max: 1200 };
    }

    const response = {
      categories,
      flavours,
      weights,
      vegOptions,
      priceRange
    };

    console.log("Sending filter options:", response);
    res.json(response);
  } catch (err) {
    console.error("Error in filter-options:", err);
    res.status(500).json({ error: "Failed to fetch filter options" });
  }
});

// GET filtered cakes
app.get("/cakes/filter", async (req, res) => {
  try {
    const { category, flavour, weight, veg, sort } = req.query;
    let query = {};

    // Build filter query
    if (category && category !== 'all') {
      query.categories = category;
    }
    if (flavour && flavour !== 'all') {
      query.flavour = flavour;
    }
    if (weight && weight !== 'all') {
      query.weightOptions = weight;
    }
    if (veg && veg !== 'all') {
      query.veg = veg === 'veg';
    }

    let cakes = await Cake.find(query);

    // Apply sorting
    if (sort === 'low') {
      cakes.sort((a, b) => (a.prices?.[0] || 0) - (b.prices?.[0] || 0));
    } else if (sort === 'high') {
      cakes.sort((a, b) => (b.prices?.[0] || 0) - (a.prices?.[0] || 0));
    }

    res.json(cakes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch filtered cakes" });
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
// GET cakes by category name (matching categories array)
app.get('/cakes/category/:categoryName', async (req, res) => {
  try {
    const { categoryName } = req.params;
    // First, find the category document to get its categories array
    const categoryDoc = await Category.findOne({ name: categoryName });
    if (!categoryDoc) {
      return res.status(404).json({ error: 'Category not found' });
    }
    // Find cakes where the categories array intersects with the category's categories array
    const cakes = await Cake.find({ categories: { $in: categoryDoc.categories } });
    res.json(cakes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cakes' });
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
