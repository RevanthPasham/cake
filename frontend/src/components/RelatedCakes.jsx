import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_API } from "../config";
import { useNavigate } from "react-router-dom";

const RelatedCakes = ({ cakeId, categories }) => {
  const [related, setRelated] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BASE_API}/related-cakes/${cakeId}`)
      .then((res) => setRelated(res.data))
      .catch(() => setRelated([]));
  }, [cakeId]);

  if (!related.length) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">
        More in "{categories?.[0] || "Category"}"
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {related.map((cake) => {
          const price = cake.prices?.[0] ?? null;
          const cutPrice = cake.cutPrices?.[0] ?? null;

          let discount = null;
          if (cutPrice && price) {
            discount = Math.round(((cutPrice - price) / cutPrice) * 100);
          }

          return (
            <button
              key={cake._id}
              className="bg-white rounded-xl shadow active:scale-95 transition"
              onClick={() => navigate(`/cake/${cake._id}`)}
            >
              {/* Image + Veg/NonVeg Badge */}
              <div className="relative">
                <img
                  src={cake.images?.[0] || "/placeholder.jpg"}
                  className="h-28 w-full object-cover rounded-t-xl"
                />

                {/* Veg / Non-Veg Tag */}
                {cake.veg !== undefined && (
                  <span
                    className={`absolute top-1 right-1 text-[9px] px-1.5 py-[1px] rounded-full shadow 
                      ${cake.veg ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
                  >
                    {cake.veg ? "Veg" : "Non-Veg"}
                  </span>
                )}
              </div>

              {/* Cake Details */}
              <div className="p-2">

                {/* Name */}
                <p className="font-semibold text-[13px] leading-tight">
                  {cake.name}
                </p>

                {/* Price Row */}
                <div className="flex items-center gap-1 mt-1 flex-wrap">

                  {/* Cut Price */}
                  {cutPrice && (
                    <span className="text-gray-400 line-through text-[11px]">
                      ₹{cutPrice}
                    </span>
                  )}

                  {/* New Price */}
                  {price && (
                    <span className="text-black font-bold text-[13px]">
                      ₹{price}
                    </span>
                  )}

                  {/* Discount */}
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
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedCakes;
