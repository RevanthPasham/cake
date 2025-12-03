import { useEffect, useState } from "react";
import axios from "axios";

export default function Debug() {
  const [categories, setCategories] = useState(null);
  const [cakes, setCakes] = useState(null);
  const [catError, setCatError] = useState(null);
  const [cakeError, setCakeError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("Chocolate");

  const fetchAll = async (category = selected) => {
    setLoading(true);
    setCatError(null);
    setCakeError(null);
    try {
      const c = await axios.get("http://127.0.0.1:5000/categories");
      setCategories(c.data);
    } catch (err) {
      setCatError(err.message || "Failed to fetch categories");
      setCategories(null);
    }

    try {
      const k = await axios.get(`http://127.0.0.1:5000/cakes/${encodeURIComponent(category)}`);
      setCakes(k.data);
    } catch (err) {
      setCakeError(err.message || "Failed to fetch cakes");
      setCakes(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-3 my-4 bg-white rounded shadow">
      <h3 className="font-semibold mb-2">Debug Panel</h3>
      <div className="flex gap-2 items-center mb-2">
        <label className="text-sm">Category:</label>
        <input
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="border px-2 py-1 text-sm"
        />
        <button
          onClick={() => fetchAll(selected)}
          className="bg-pink-600 text-white px-3 py-1 rounded text-sm"
        >
          Fetch
        </button>
        <span className="text-sm text-gray-500">{loading ? 'Loading…' : ''}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <strong>Categories</strong>
          {catError ? (
            <div className="text-red-500">Error: {catError}</div>
          ) : categories === null ? (
            <div className="text-gray-500">No data</div>
          ) : (
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(categories, null, 2)}</pre>
          )}
        </div>

        <div>
          <strong>Cakes ({selected})</strong>
          {cakeError ? (
            <div className="text-red-500">Error: {cakeError}</div>
          ) : cakes === null ? (
            <div className="text-gray-500">No data</div>
          ) : (
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(cakes, null, 2)}</pre>
          )}
        </div>
      </div>
    </div>
  );
}
