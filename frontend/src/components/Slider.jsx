import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API } from "../config";
import { useNavigate } from "react-router-dom";

const Slider = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BASE_API}/categories`)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => console.error("Categories error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-scroll scrollbar-hide mt-3 pb-3">
        {Array(4).fill().map((_, i) => (
          <div key={i} className="min-w-[150px] bg-gray-200 h-52 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-scroll scrollbar-hide mt-3 pb-3">
      {categories.map((cat) => (
        <div
          key={cat._id}
          className="min-w-[150px] rounded-lg shadow cursor-pointer hover:shadow-xl active:scale-95 transition-all duration-200 flex-shrink-0"
          onClick={() => cat.name && navigate(`/category/${encodeURIComponent(cat.name)}`)}
        >
          <img
            src={cat.image}
            alt={cat.name}
            className="w-full h-40 rounded-t-xl object-cover"
            onError={(e) => (e.target.src = "/placeholder.jpg")}
          />

          {/* ⭐ Hide name if not present */}
          {cat.name && (
            <p className="text-center mt-1 text-sm font-semibold p-2">
              {cat.name}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Slider;
