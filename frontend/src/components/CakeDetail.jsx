// CakeDetail.jsx
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

  // Helper to get safe cake properties
  const safeCake = {
    name: cake?.name || 'Unknown Cake',
    longDescription: cake?.longDescription || 'No description available',
    images: cake?.images || [],
    weightOptions: cake?.weightOptions || [],
    prices: cake?.prices || [],
    categories: cake?.categories || [],
    _id: cake?._id || ''
  };

  useEffect(() => {
    const loadCake = async () => {
      try {
        let res = await axios.get(`${BASE_API}/cake/${id}`).catch(() => null);
        if (!res) res = await axios.get(`${BASE_API}/cakes/${id}`);

        const data = res.data.cake ? res.data.cake : res.data;

        setCake(data);
      } catch (error) {
        console.error("Error loading cake:", error);
      }
    };

    loadCake();
  }, [id]);

  // Reset selectedWeight if out of bounds
  useEffect(() => {
    if (safeCake.weightOptions.length > 0 && selectedWeight >= safeCake.weightOptions.length) {
      setSelectedWeight(0);
    }
  }, [cake, selectedWeight, safeCake.weightOptions.length]);

  if (!cake)
    return <p className="text-center mt-10">Loading cake details...</p>;

  const orderNow = () => {
    const weight = safeCake.weightOptions[selectedWeight] || 'N/A';
    const price = safeCake.prices[selectedWeight] || 'N/A';
    const msg = `Cake: ${safeCake.name}
Weight: ${weight}
Price: ₹${price}`;

    window.open(
      `https://wa.me/9100894542?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <div className="pb-20">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-white p-2 rounded-full shadow"
      >
        ←
      </button>

      {/* Image Slider */}
      <div className="relative h-64 overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${imgIndex * 100}%)` }}
        >
          {safeCake.images.map((img, i) => (
            <img key={i} src={img} className="h-64 w-full object-cover" />
          ))}
        </div>

        <button
          onClick={() =>
            setImgIndex(imgIndex === 0 ? safeCake.images.length - 1 : imgIndex - 1)
          }
          className="absolute top-1/2 left-3 p-2 bg-white rounded-full shadow"
        >
          ‹
        </button>

        <button
          onClick={() =>
            setImgIndex(
              imgIndex === safeCake.images.length - 1 ? 0 : imgIndex + 1
            )
          }
          className="absolute top-1/2 right-3 p-2 bg-white rounded-full shadow"
        >
          ›
        </button>
      </div>

      {/* Details */}
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold">{safeCake.name}</h2>
        <p className="text-gray-600">{safeCake.longDescription}</p>

        {/* Weight Options */}
        <div className="flex gap-2 flex-wrap">
          {safeCake.weightOptions.map((w, i) => (
            <button
              key={i}
              onClick={() => setSelectedWeight(i)}
              className={`px-4 py-1 border rounded-full ${
                selectedWeight === i
                  ? "bg-pink-600 text-white"
                  : "border-gray-300"
              }`}
            >
              {w} · ₹{safeCake.prices[i]}
            </button>
          ))}
        </div>

        <p className="text-pink-600 text-2xl font-bold">
          ₹{safeCake.prices[selectedWeight]}
        </p>

        <button
          onClick={orderNow}
          className="w-full bg-green-600 text-white py-3 rounded-xl"
        >
          Order on WhatsApp
        </button>

        <RelatedCakes cakeId={safeCake._id} categories={safeCake.categories} />
      </div>
    </div>
  );
};

export default CakeDetail;
