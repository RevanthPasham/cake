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
        {filtered.map((cake) => {
          const price = cake.prices?.[0] ?? null;
          const cutPrice = cake.cutPrices?.[0] ?? null;

          let discount = null;
          if (cutPrice && price) {
            discount = Math.round(((cutPrice - price) / cutPrice) * 100);
          }

          return (
            <div
              key={cake._id}
              onClick={() => navigate(`/cake/${cake._id}`)}
              className="bg-white rounded-xl shadow cursor-pointer active:scale-95 transition"
            >
              <div className="relative">
                <img
                  src={cake.images?.[0] || "/placeholder.jpg"}
                  className="h-40 w-full object-cover rounded-t-xl"
                />

                {/* Veg / Non-Veg Tag */}
                {cake.veg !== undefined && (
                  <span
                    className={`absolute top-2 right-2 text-[10px] px-2 py-[1px] rounded-full shadow 
                    ${cake.veg ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
                  >
                    {cake.veg ? "Veg" : "Non-Veg"}
                  </span>
                )}
              </div>

              <div className="p-2">

                {/* Cake Name */}
                {cake.name && (
                  <p className="font-semibold text-sm leading-tight">
                    {cake.name}
                  </p>
                )}

                {/* Price + Discount */}
                <div className="flex items-center gap-1 mt-1 flex-wrap">

                  {/* Cut Price */}
                  {cutPrice && (
                    <span className="text-gray-400 line-through text-xs">
                      ₹{cutPrice}
                    </span>
                  )}

                  {/* New Price */}
                  {price && (
                    <span className="text-black font-bold text-sm">
                      ₹{price}
                    </span>
                  )}

                  {/* Shiny Discount */}
                  {discount > 0 && (
                    <span className="text-[9px] font-semibold text-green-800 
                      px-1.5 py-[1px] rounded-l-md 
                      bg-gradient-to-r from-green-100 to-green-300
                      relative inline-block">

                      {discount}% OFF

                      <span className="absolute right-[-6px] top-0 h-full w-[6px] 
                        bg-gradient-to-r from-green-300 to-green-400 
                        skew-x-[20deg] rounded-r-md">
                      </span>
                    </span>
                  )}

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-gray-500 text-center mt-6">No cakes found.</p>
      )}
    </div>
  );
};

export default SearchPage;
