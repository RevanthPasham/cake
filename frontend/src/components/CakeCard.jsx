// CakeCard.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_API } from "../config";
import { useNavigate } from "react-router-dom";

const CakeCard = ({ category }) => {
  const [cakes, setCakes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!category) return;

    axios
      .get(`${BASE_API}/cakes/${encodeURIComponent(category)}`)
      .then((res) => {
        setCakes(res.data.slice(0, 16)); // show only 16 cakes
      })
      .catch((err) => {
        console.error("Error loading cakes:", err);
      });
  }, [category]);

  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {cakes.map((cake) => (
        <div
          key={cake._id}
          onClick={() => navigate(`/cake/${cake._id}`)}
          className="bg-white rounded-xl shadow cursor-pointer active:scale-95 transition"
        >
          <img
            src={cake.images[0]}
            className="h-40 w-full object-cover rounded-t-xl pointer-events-none"
          />
          <div className="p-3">
            <p className="font-semibold">{cake.name}</p>
            <p className="text-pink-600 font-bold">₹{cake.prices[0]}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CakeCard;
