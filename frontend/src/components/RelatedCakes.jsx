import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_API } from "../config";
import { useNavigate } from "react-router-dom";

const RelatedCakes = ({ cakeId, categories }) => {
  const [related, setRelated] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BASE_API}/all-related-cakes/${cakeId}`)
      .then((res) => setRelated(res.data));
  }, [cakeId]);

  if (!related.length) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">
        More in "{categories[0]}"
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {related.map((cake) => (
          <button
            key={cake._id}
            className="bg-white rounded-xl shadow"
            onClick={() => navigate(`/cake/${cake._id}`)}
          >
            <img
              src={cake.images[0]}
              className="h-28 w-full object-cover rounded-t-xl"
            />
            <div className="p-2">
              <p className="font-semibold text-[13px]">{cake.name}</p>
              <p className="text-pink-600 font-bold text-[13px]">
                ₹{cake.prices[0]}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RelatedCakes;
