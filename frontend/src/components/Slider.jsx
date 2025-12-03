// Slider.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API } from "../config";

export const Slider = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASE_API}/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="text-red-500 p-3">Error: {error}</div>;

  return (
    <div className="flex gap-4 overflow-x-scroll scrollbar-hide mt-3 pb-3">
      {categories.length === 0 ? (
        <p className="text-gray-500">Loading categories...</p>
      ) : (
        categories.map((cat) => (
          <div
            key={cat._id}
            className="min-w-[150px] rounded-lg shadow cursor-pointer"
            onClick={() => onSelectCategory(cat.categories)} 
          >
            <img
              src={cat.image}
              className="w-[95vw] h-40 rounded-xl object-cover mx-auto"
            />
            <p className="text-center mt-1 text-sm font-semibold">
              {cat.name}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Slider;
