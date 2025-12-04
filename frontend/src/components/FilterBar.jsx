import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API } from "../config";

const FilterBar = ({ filters, onFilterChange }) => {
  const [options, setOptions] = useState({
    flavours: [],
    categories: [],
    weights: [],
    priceRange: { min: 0, max: 0 }
  });
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching filter options from:", `${BASE_API}/filter-options`);
    axios
      .get(`${BASE_API}/filter-options`)
      .then((res) => {
        console.log("Filter options response:", res.data);
        const data = res.data || {};
        const safe = {
          flavours: (data.flavours || []).map(s => (s || "").toString().trim()).filter(Boolean),
          categories: (data.categories || []).map(s => (s || "").toString().trim()).filter(Boolean),
          weights: (data.weights || []).map(s => (s || "").toString().trim()).filter(Boolean),
          priceRange: data.priceRange || { min: 0, max: 0 }
        };
        // sort case-insensitive
        safe.flavours.sort((a,b)=>a.localeCompare(b, undefined, {sensitivity:'base'}));
        safe.categories.sort((a,b)=>a.localeCompare(b, undefined, {sensitivity:'base'}));
        safe.weights.sort((a,b)=>a.localeCompare(b, undefined, {sensitivity:'base'}));
        console.log("Processed filter options:", safe);
        setOptions(safe);
      })
      .catch((err) => {
        console.error("Error fetching filter options:", err);
        try {
          console.error("Requested URL:", err.config && err.config.url);
          console.error("Response status:", err.response && err.response.status);
          console.error("Response data:", err.response && err.response.data);
        } catch (e) {
          console.error("Error reading axios error details", e);
        }
        // Fallback to safe defaults so the UI remains usable
        const fallback = {
          categories: ["Chocolate", "Wedding", "Birthday"],
          flavours: ["Dark Chocolate", "Vanilla"],
          weights: ["500g", "1kg"],
          priceRange: { min: 400, max: 1200 }
        };
        setOptions(fallback);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex gap-3 mb-4 flex-wrap">
      
      {/* Veg / Non-Veg */}
      <select
        className="border p-2 rounded"
        value={filters.veg || "all"}
        onChange={(e) => onFilterChange("veg", e.target.value)}
      >
        <option value="all">All</option>
        <option value="veg">Veg</option>
        <option value="nonveg">Non-Veg</option>
      </select>

      {/* Category (dynamic from backend) */}
      <select
        className="border p-2 rounded"
        value={filters.category || "all"}
        onChange={(e) => onFilterChange("category", e.target.value)}
      >
        <option value="all">All Categories</option>
        {options.categories.map((cat, i) => (
          <option key={i} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Flavour (dynamic from backend) */}
      <select
        className="border p-2 rounded"
        value={filters.flavour || "all"}
        onChange={(e) => onFilterChange("flavour", e.target.value)}
      >
        <option value="all">All Flavours</option>
        {options.flavours.map((flav, i) => (
          <option key={i} value={flav}>{flav}</option>
        ))}
      </select>

      {/* Weight (dynamic from backend) */}
      <select
        className="border p-2 rounded"
        value={filters.weight || "all"}
        onChange={(e) => onFilterChange("weight", e.target.value)}
      >
        <option value="all">All Weights</option>
        {options.weights.map((wt, i) => (
          <option key={i} value={wt}>{wt}</option>
        ))}
      </select>

      {/* Price range label + Sorting */}
      <div className="flex items-center gap-2">
        <div className="text-sm text-gray-600">Price:</div>
        <div className="text-sm font-medium">₹{options.priceRange.min} - ₹{options.priceRange.max}</div>
      </div>

      {/* Price Sorting */}
      <select
        className="border p-2 rounded"
        value={filters.sort || "default"}
        onChange={(e) => onFilterChange("sort", e.target.value)}
      >
        <option value="default">Sort</option>
        <option value="low">Low → High</option>
        <option value="high">High → Low</option>
      </select>

    </div>
  );
};

export default FilterBar;
