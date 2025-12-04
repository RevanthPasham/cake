import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API } from "../config";

const FilterBar = ({ filters, onFilterChange }) => {
  const [options, setOptions] = useState({
    flavours: [],
    weights: [],
    priceRange: { min: 0, max: 0 },
  });

  useEffect(() => {
    axios.get(`${BASE_API}/filter-options`).then((res) => {
      setOptions({
        flavours: res.data.flavours || [],
        weights: res.data.weights || [],
        priceRange: res.data.priceRange || { min: 0, max: 0 },
      });
    });
  }, []);

  return (
    <div className="flex gap-3 mb-4 flex-wrap">

      <select
        className="border p-2 rounded"
        value={filters.veg}
        onChange={(e) => onFilterChange("veg", e.target.value)}
      >
        <option value="all">All</option>
        <option value="veg">Veg</option>
        <option value="nonveg">Non-Veg</option>
      </select>

      <select
        className="border p-2 rounded"
        value={filters.flavour}
        onChange={(e) => onFilterChange("flavour", e.target.value)}
      >
        <option value="all">All Flavours</option>
        {options.flavours.map((flav, i) => (
          <option key={i} value={flav}>{flav}</option>
        ))}
      </select>

      <select
        className="border p-2 rounded"
        value={filters.weight}
        onChange={(e) => onFilterChange("weight", e.target.value)}
      >
        <option value="all">All Weights</option>
        {options.weights.map((wt, i) => (
          <option key={i} value={wt}>{wt}</option>
        ))}
      </select>

      <div className="text-sm flex items-center gap-2">
        <span className="text-gray-600">Price:</span>
        <span className="font-medium">
          ₹{options.priceRange.min} - ₹{options.priceRange.max}
        </span>
      </div>

      <select
        className="border p-2 rounded"
        value={filters.sort}
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
