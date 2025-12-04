import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API } from "../config";
import { useLocation, useNavigate } from "react-router-dom";

const SearchPage = () => {
  const [cakes, setCakes] = useState([]);
  const { search } = useLocation();
  const q = new URLSearchParams(search).get("q");
  const navigate = useNavigate();

  useEffect(() => {
    if (!q) return;

    const loadResults = async () => {
      try {
        const res = await axios.get(`${BASE_API}/search?q=${q}`);
        setCakes(res.data);
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    loadResults();
  }, [q]);

  return (
    <div className="p-4">
      <h2 className="font-semibold mb-2">
        Search results for: <span className="text-pink-600">{q}</span>
      </h2>

      {/* No results */}
      {cakes.length === 0 && (
        <p className="text-gray-500 mt-4">No cakes found.</p>
      )}

      {/* Results grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
        {cakes.map((cake) => (
          <div
            key={cake._id}
            className="border p-2 rounded bg-white shadow cursor-pointer"
            onClick={() => navigate(`/cake/${cake._id}`)}
          >
            <img
              src={cake.images?.[0]}
              alt={cake.name}
              className="w-full h-40 object-cover rounded"
            />
            <p className="font-semibold mt-2">{cake.name}</p>
            <p className="text-pink-600 font-bold">₹{cake.prices?.[0]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
