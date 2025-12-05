import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_API } from "../config";
import { useNavigate } from "react-router-dom";

const CakeCard = ({ category }) => {
  const [cakes, setCakes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const url = category
      ? `${BASE_API}/cakes/${encodeURIComponent(category)}`
      : `${BASE_API}/cakes`;

    axios
      .get(url)
      .then((res) => setCakes(res.data.slice(0, 16)))
      .catch((err) => console.error("Error loading cakes:", err));
  }, [category]);

  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {cakes.map((cake) => {
        const originalPrice = cake.cutPrices?.[0] ?? null;
        const newPrice = cake.prices?.[0] ?? null;

        let discount = null;
        if (originalPrice && newPrice) {
          discount = Math.round(((originalPrice - newPrice) / originalPrice) * 100);
        }

        return (
          <div
            key={cake._id}
            onClick={() => navigate(`/cake/${cake._id}`)}
            className="bg-white rounded-xl shadow cursor-pointer active:scale-95 transition"
          >
            {/* 🔥 Image with badge */}
            <div className="relative">
              <img
                src={cake.images?.[0] || "/placeholder.jpg"}
                className="h-40 w-full object-cover rounded-t-xl"
              />

              {/* Veg/Non-Veg Badge on Image */}
              {cake.veg !== undefined && (
                <span
                  className={`absolute top-2 right-2 text-[10px] px-2 py-[1px] rounded-full 
                    shadow 
                    ${cake.veg ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
                >
                  {cake.veg ? "Veg" : "Non-Veg"}
                </span>
              )}
            </div>

            <div className="p-3">

              {/* Cake Name */}
              {cake.name && (
                <p className="font-semibold text-sm leading-tight">{cake.name}</p>
              )}

              {/* Price Row */}
              <div className="flex items-center gap-2 mt-1 flex-wrap">

                {originalPrice && (
                  <span className="text-gray-400 line-through text-xs">
                    ₹{originalPrice}
                  </span>
                )}

                {newPrice && (
                  <span className="text-black font-bold text-sm">
                    ₹{newPrice}
                  </span>
                )}

                {discount > 0 && (
                  <span className="text-[10px] font-semibold text-green-800 
                    px-2 py-[2px] rounded-l-md 
                    bg-gradient-to-r from-green-100 to-green-300
                    relative inline-block">

                    {discount}% OFF

                    <span className="absolute right-[-8px] top-0 h-full w-[8px] 
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
  );
};

export default CakeCard;
