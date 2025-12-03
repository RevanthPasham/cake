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
    axios.get(`${BASE_API}/cake/${id}`).then((res) => {
      setCake(res.data);
    });
  }, [id]);

  if (!cake)
    return <p className="text-center mt-10">Loading...</p>;

  const orderNow = () => {
    const msg = `Cake: ${cake.name}\nWeight: ${cake.weightOptions[selectedWeight]}\nPrice: ₹${cake.prices[selectedWeight]}`;
    window.open(
      `https://wa.me/9100894542?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <div className="pb-20">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-white p-2 rounded-full shadow"
      >
        ←
      </button>

      {/* SLIDER */}
      <div className="relative h-64 overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${imgIndex * 100}%)` }}
        >
          {cake.images.map((img, i) => (
            <img key={i} src={img} className="h-64 w-full object-cover" />
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={() =>
            setImgIndex(imgIndex === 0 ? cake.images.length - 1 : imgIndex - 1)
          }
          className="absolute top-1/2 left-3 p-2 bg-white rounded-full shadow"
        >
          ‹
        </button>

        <button
          onClick={() =>
            setImgIndex(imgIndex === cake.images.length - 1 ? 0 : imgIndex + 1)
          }
          className="absolute top-1/2 right-3 p-2 bg-white rounded-full shadow"
        >
          ›
        </button>
      </div>

      {/* Details */}
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold">{cake.name}</h2>
        <p className="text-gray-600">{cake.longDescription}</p>

        {/* Weight Options */}
        <div className="flex gap-2 flex-wrap">
          {cake.weightOptions.map((w, i) => (
            <button
              key={i}
              onClick={() => setSelectedWeight(i)}
              className={`px-4 py-1 border rounded-full ${
                selectedWeight === i
                  ? "bg-pink-600 text-white"
                  : "border-gray-300"
              }`}
            >
              {w} · ₹{cake.prices[i]}
            </button>
          ))}
        </div>

        {/* Price */}
        <p className="text-pink-600 text-2xl font-bold">
          ₹{cake.prices[selectedWeight]}
        </p>

        <button
          onClick={orderNow}
          className="w-full bg-green-600 text-white py-3 rounded-xl"
        >
          Order on WhatsApp
        </button>

        <RelatedCakes cakeId={cake._id} categories={cake.categories} />
      </div>
    </div>
  );
};

export default CakeDetail;
