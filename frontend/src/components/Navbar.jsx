import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_API } from "../config";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // Fetch suggestions
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(`${BASE_API}/search-suggestions?q=${query}`);
        setSuggestions(res.data);
      } catch (err) {
        console.error("Suggestion error", err);
      }
    };

    const delay = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delay);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${query}`);
    setSuggestions([]);
  };

  const applySuggestion = (text) => {
    setQuery(text);
    navigate(`/search?q=${text}`);
    setSuggestions([]);
  };

  return (
    <div className="relative flex items-center justify-between p-3 shadow bg-white sticky top-0 z-10">

      <h1
        onClick={() => navigate("/")}
        className="text-xl font-bold text-pink-600 cursor-pointer"
      >
        Sweet Bites
      </h1>

      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          placeholder="Search cakes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border rounded-full px-4 py-1 w-40 md:w-60 text-sm"
        />

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute bg-white w-full mt-1 rounded shadow-md border max-h-48 overflow-y-auto z-20">
            {suggestions.map((item, index) => (
              <div
                key={index}
                onClick={() => applySuggestion(item)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </form>

      <div className="flex gap-3 text-xl">
        <span>❤️</span>
        <span>☰</span>
      </div>
    </div>
  );
};

export default Navbar;
