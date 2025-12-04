import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_API } from "../config";
import FilterBar from "./FilterBar";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [filters, setFilters] = useState({
    flavour: "all",
    weight: "all",
    veg: "all",
    sort: "default",
  });

  const onFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Load search results
  useEffect(() => {
    if (!query) return;

    axios
      .get(`${BASE_API}/search?q=${query}`)
      .then((res) => {
        setResults(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error("Search error:", err));
  }, [query]);

  // Apply filters on search results
  useEffect(() => {
    let data = [...results];

    if (filters.flavour !== "all") {
      data = data.filter(
        (cake) =>
          cake.flavour?.toLowerCase() === filters.flavour.toLowerCase()
      );
    }

    if (filters.weight !== "all") {
      data = data.filter((cake) =>
        cake.weightOptions?.includes(filters.weight)
      );
    }

    if (filters.veg !== "all") {
      data = data.filter((cake) =>
        filters.veg === "veg" ? cake.veg : !cake.veg
      );
    }

    if (filters.sort === "low") {
      data.sort((a, b) => (a.prices?.[0] || 0) - (b.prices?.[0] || 0));
    }
    if (filters.sort === "high") {
      data.sort((a, b) => (b.prices?.[0] || 0) - (a.prices?.[0] || 0));
    }

    setFiltered(data);
  }, [filters, results]);

  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="text-md font-semibold">
        Search results for: <span className="text-pink-600">{query}</span>
      </h2>

      {/* Filters */}
      <FilterBar filters={filters} onFilterChange={onFilterChange} />

      {/* Search Results */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {filtered.map((cake) => (
          <div
            key={cake._id}
            onClick={() => navigate(`/cake/${cake._id}`)}
            className="border p-2 rounded-lg bg-white cursor-pointer shadow active:scale-95 transition"
          >
            <img
              src={cake.images?.[0]}
              className="h-40 w-full object-cover rounded"
            />
            <p className="mt-1 font-medium">{cake.name}</p>
            <p className="text-pink-600 font-bold">₹{cake.prices?.[0]}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-gray-500 text-center mt-6">No cakes found.</p>
      )}
    </div>
  );
};

export default SearchPage;
