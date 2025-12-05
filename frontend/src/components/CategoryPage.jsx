import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API } from "../config";
import FilterBar from "./FilterBar";

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

  useEffect(() => {
    axios.get(`${BASE_API}/api/cakes`).then((res) => setAllCakes(res.data));
  }, []);

  useEffect(() => {
    if (!allCakes.length) return;
    let data = [...allCakes];

    const filterActive =
      filters.flavour !== "all" ||
      filters.weight !== "all" ||
      filters.veg !== "all" ||
      filters.sort !== "default";

    if (!filterActive) {
      data = data.filter((cake) =>
        cake.categories?.map((c) => c.toLowerCase()).includes(name.toLowerCase())
      );
    }

    if (filters.flavour !== "all") {
      data = data.filter(
        (cake) => cake.flavour?.toLowerCase() === filters.flavour.toLowerCase()
      );
    }

    if (filters.weight !== "all") {
      const selected = normalizeWeight(filters.weight);
      data = data.filter((cake) =>
        cake.weightOptions?.some(
          (w) => normalizeWeight(w) === selected
        )
      );
    }

    if (filters.veg !== "all") {
      data = data.filter(
        (cake) => (cake.veg ? "veg" : "nonveg") === filters.veg
      );
    }

    if (filters.sort === "low") {
      data.sort((a, b) => (a.prices?.[0] || 0) - (b.prices?.[0] || 0));
    }
    if (filters.sort === "high") {
      data.sort((a, b) => (b.prices?.[0] || 0) - (a.prices?.[0] || 0));
    }

    setCakes(data);
  }, [filters, allCakes, name]);

  return (
    <div className="px-4 pb-6">
      <h2 className="text-xl font-semibold mb-3">{name} Cakes</h2>

      <FilterBar filters={filters} onFilterChange={onFilterChange} />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
        {cakes.map((cake) => {
          const price = cake.prices?.[0] ?? null;
          const cutPrice = cake.cutPrices?.[0] ?? null;

          let discount = null;
          if (cutPrice && price) {
            discount = Math.round(((cutPrice - price) / cutPrice) * 100);
          }

          return (
            <div
              key={cake._id}
              className="bg-white rounded-xl shadow cursor-pointer active:scale-95 transition border"
              onClick={() => navigate(`/cake/${cake._id}`)}
            >
              {/* Image + veg/non-veg tag */}
              <div className="relative">
                <img
                  src={cake.images?.[0] || "/placeholder.jpg"}
                  alt={cake.name}
                  className="w-full h-40 object-cover rounded-t-xl"
                />

                {cake.veg !== undefined && (
                  <span
                    className={`absolute top-2 right-2 text-[10px] px-2 py-[1px] rounded-full shadow 
                      ${cake.veg ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
                  >
                    {cake.veg ? "Veg" : "Non-Veg"}
                  </span>
                )}
              </div>

              {/* Bottom details */}
              <div className="p-2">

                {/* Name */}
                {cake.name && (
                  <p className="font-semibold text-[14px] leading-tight">
                    {cake.name}
                  </p>
                )}

                {/* Price row */}
                <div className="flex items-center gap-2 mt-1 flex-wrap">

                  {cutPrice && (
                    <span className="text-gray-400 line-through text-xs">
                      ₹{cutPrice}
                    </span>
                  )}

                  {price && (
                    <span className="text-black font-bold text-sm">
                      ₹{price}
                    </span>
                  )}

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

      {cakes.length === 0 && (
        <p className="text-gray-500 text-center mt-6">No cakes found</p>
      )}
    </div>
  );
};

export default CategoryPage;
