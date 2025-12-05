import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_API } from "../config";
import RelatedCakes from "./RelatedCakes";

const CakeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cake, setCake] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(0);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    const loadCake = async () => {
      try {
        const res = await axios.get(`${BASE_API}/api/cake/${id}`);
        setCake(res.data);
      } catch (error) {
        console.error("Error loading cake:", error);
      }
    };

    loadCake();
  }, [id]);

  if (!cake)
    return (
      <p className="text-center mt-10">Loading cake details...</p>
    );

  const images = cake.images || [];
  const weights = cake.weightOptions || [];
  const prices = cake.prices || [];
  const cutPrices = cake.cutPrices || [];

  const name = cake.name || "Unknown Cake";
  const longDescription =
    cake.longDescription || "No description available";

  const originalPrice = cutPrices[selectedWeight] ?? null;
  const newPrice = prices[selectedWeight] ?? null;

  let discount = null;
  if (originalPrice && newPrice) {
    discount = Math.round(
      ((originalPrice - newPrice) / originalPrice) * 100
    );
  }

  const orderNow = () => {
    const msg = `Cake: ${name}\nWeight: ${
      weights[selectedWeight] || "N/A"
    }\nPrice: ₹${newPrice || "N/A"}`;

    window.open(
      `https://wa.me/9100894542?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <div className="pb-20">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-white p-2 rounded-full shadow"
      >
        ←
      </button>

      {/* Image Slider */}
      <div className="relative h-64 overflow-hidden rounded-b-xl">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${imgIndex * 100}%)` }}
        >
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              className="h-64 w-full object-cover"
            />
          ))}
        </div>

        {/* Veg / Non-Veg Tag on Image */}
        {cake.veg !== undefined && (
          <span
            className={`absolute top-2 right-2 text-[11px] px-2 py-[2px] rounded-full shadow 
              ${cake.veg
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"}`}
          >
            {cake.veg ? "Veg" : "Non-Veg"}
          </span>
        )}

        {/* Slider Arrows */}
        <button
          onClick={() =>
            setImgIndex(
              imgIndex === 0 ? images.length - 1 : imgIndex - 1
            )
          }
          className="absolute top-1/2 left-3 p-2 bg-white rounded-full shadow"
        >
          ‹
        </button>

        <button
          onClick={() =>
            setImgIndex(
              imgIndex === images.length - 1 ? 0 : imgIndex + 1
            )
          }
          className="absolute top-1/2 right-3 p-2 bg-white rounded-full shadow"
        >
          ›
        </button>
      </div>

      {/* Details */}
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold">{name}</h2>
        <p className="text-gray-600">{longDescription}</p>

        {/* Price Section */}
        <div className="flex items-center gap-3 mt-2">

          {/* Cut Price */}
          {originalPrice && (
            <span className="text-gray-400 line-through text-sm">
              ₹{originalPrice}
            </span>
          )}

          {/* New Price */}
          {newPrice && (
            <span className="text-black font-bold text-lg">
              ₹{newPrice}
            </span>
          )}

          {/* Shiny Discount */}
          {discount > 0 && (
            <span className="text-[11px] font-semibold text-green-800 
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

        {/* Weight Options */}
        <div className="flex gap-2 flex-wrap mt-2">
          {weights.map((w, i) => (
            <button
              key={i}
              onClick={() => setSelectedWeight(i)}
              className={`px-4 py-1 border rounded-full ${
                selectedWeight === i
                  ? "bg-pink-600 text-white"
                  : "border-gray-300"
              }`}
            >
              {w} · ₹{prices[i]}
            </button>
          ))}
        </div>

        {/* WhatsApp Button */}
        <button
          onClick={orderNow}
          className="w-full bg-green-600 text-white py-3 rounded-xl mt-3"
        >
          Order on WhatsApp
        </button>

        {/* Related Cakes */}
        <RelatedCakes
          cakeId={cake._id}
          categories={cake.categories}
        />
      </div>
    </div>
  );
};

export default CakeDetail;
