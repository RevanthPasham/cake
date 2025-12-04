import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API } from "../config";
import FilterBar from "./FilterBar";

// Normalize weight for matching
function normalizeWeight(w) {
  if (!w) return "";
  return w
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/gm/g, "g")
    .replace(/kgs/g, "kg")
    .replace(/gms/g, "g")
    .trim();
}

const CategoryPage = () => {
  const { name } = useParams();
  const navigate = useNavigate();

  const [allCakes, setAllCakes] = useState([]);
  const [cakes, setCakes] = useState([]);

  const [filters, setFilters] = useState({
    flavour: "all",
    weight: "all",
    veg: "all",
    sort: "default",
  });

  const onFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Load cakes ONCE
  useEffect(() => {
    axios.get(`${BASE_API}/cakes`).then((res) => setAllCakes(res.data));
  }, []);

  // APPLY FILTERS
  useEffect(() => {
    if (!allCakes.length) return;
    let data = [...allCakes];

    const filterActive =
      filters.flavour !== "all" ||
      filters.weight !== "all" ||
      filters.veg !== "all" ||
      filters.sort !== "default";

    // CATEGORY FILTER ONLY when no filters applied
    if (!filterActive) {
      data = data.filter((cake) =>
        cake.categories?.map((c) => c.toLowerCase()).includes(name.toLowerCase())
      );
    }

    // FLAVOUR FILTER
    if (filters.flavour !== "all") {
      data = data.filter(
        (cake) => cake.flavour?.toLowerCase() === filters.flavour.toLowerCase()
      );
    }

    // WEIGHT FILTER
    if (filters.weight !== "all") {
      const selected = normalizeWeight(filters.weight);
      data = data.filter((cake) =>
        cake.weightOptions?.some(
          (w) => normalizeWeight(w) === selected
        )
      );
    }

    // VEG FILTER
    if (filters.veg !== "all") {
      data = data.filter(
        (cake) => (cake.veg ? "veg" : "nonveg") === filters.veg
      );
    }

    // SORTING
    if (filters.sort === "low") {
      data.sort((a, b) => (a.prices[0] || 0) - (b.prices[0] || 0));
    }
    if (filters.sort === "high") {
      data.sort((a, b) => (b.prices[0] || 0) - (a.prices[0] || 0));
    }

    setCakes(data);
  }, [filters, allCakes, name]);

  return (
    <div className="px-4">
      <h2 className="text-xl font-semibold mb-3">{name} Cakes</h2>

      <FilterBar filters={filters} onFilterChange={onFilterChange} />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
        {cakes.map((cake) => (
          <div
            key={cake._id}
            className="border p-2 rounded bg-white cursor-pointer"
            onClick={() => navigate(`/cake/${cake._id}`)}
          >
            <img
              src={cake.images?.[0]}
              alt={cake.name}
              className="w-full h-40 object-cover rounded"
            />
            <div className="mt-2 font-medium">{cake.name}</div>
            <div className="text-pink-600 font-semibold">₹{cake.prices[0]}</div>
          </div>
        ))}
      </div>

      {cakes.length === 0 && (
        <p className="text-gray-500 text-center mt-6">No cakes found</p>
      )}
    </div>
  );
};

export default CategoryPage;
