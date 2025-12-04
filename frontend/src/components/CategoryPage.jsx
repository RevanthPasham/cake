import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API } from "../config";
import FilterBar from "./FilterBar";

const CategoryPage = () => {
  const { name } = useParams();
  const [cakes, setCakes] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchCakes();
  }, [name, filters]);

  const fetchCakes = async () => {
    try {
      // Always use the filter endpoint for consistency
      const params = new URLSearchParams();

      // Add category filter
      params.append('category', name);

      // Add other filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all' && value !== 'default') {
          params.append(key, value);
        }
      });

      const url = `${BASE_API}/cakes/filter?${params.toString()}`;
      const res = await axios.get(url);
      setCakes(res.data);
    } catch (err) {
      console.log(err);
      setCakes([]);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">{name} Cakes</h2>

      <FilterBar filters={filters} onFilterChange={handleFilterChange} />

      {cakes.length === 0 ? (
        <p>No cakes found matching your filters.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {cakes.map((cake) => (
            <div
              key={cake._id}
              onClick={() => window.location.href = `/cake/${cake._id}`}
              className="bg-white rounded-xl shadow cursor-pointer active:scale-95 transition"
            >
              <img
                src={cake.images?.[0] || '/placeholder.jpg'}
                className="h-40 w-full object-cover rounded-t-xl pointer-events-none"
                onError={(e) => {
                  e.target.src = '/placeholder.jpg';
                }}
              />
              <div className="p-3">
                <p className="font-semibold">{cake.name || 'Unknown Cake'}</p>
                <p className="text-pink-600 font-bold">₹{cake.prices?.[0] || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
