import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_API } from "../config";

export const Navbar = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showBox, setShowBox] = useState(false);

  const fetchSuggestions = async (text) => {
    try {
      if (!text.trim()) {
        setSuggestions([]);
        return;
      }

      const res = await axios.get(`${BASE_API}/search-suggestions?q=${text}`);
      setSuggestions(res.data);
    } catch (err) {
      console.log("Suggestion error", err);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length > 0) {
      setShowBox(true);
      fetchSuggestions(value);
    } else {
      setShowBox(false);
      setSuggestions([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      navigate(`/search?q=${query}`);
      setShowBox(false);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (value) => {
    setQuery(value);
    navigate(`/search?q=${value}`);
    setShowBox(false);
    setSuggestions([]);
  };

  useEffect(() => {
    const closeSuggestions = () => setShowBox(false);
    window.addEventListener("click", closeSuggestions);
    return () => window.removeEventListener("click", closeSuggestions);
  }, []);

  return (
    <div className="flex items-center justify-between p-3 shadow bg-white sticky top-0 z-20 relative">

      {/* LOGO — Click to go Home */}
      <div
        className="text-xl font-bold text-pink-600 cursor-pointer select-none"
        onClick={() => navigate("/")}
      >
        Sweet Bites
      </div>

      {/* SEARCH BAR */}
      <div className="relative w-44 md:w-60">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          placeholder="Search cakes..."
          className="border rounded-full px-4 py-1 w-full text-sm outline-none focus:ring-2 focus:ring-pink-300"
          onClick={(e) => e.stopPropagation()}
        />

        {showBox && suggestions.length > 0 && (
          <div
            className="absolute top-10 left-0 w-full bg-white shadow-xl rounded-xl max-h-60 overflow-y-auto p-2 z-30"
            onClick={(e) => e.stopPropagation()}
          >
            {suggestions.map((item, index) => (
              <p
                key={index}
                onClick={() => handleSuggestionClick(item)}
                className="p-2 rounded-lg hover:bg-pink-100 cursor-pointer text-sm"
              >
                {item}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 text-xl">
        <span>❤️</span>
        <span>☰</span>
      </div>

    </div>
  );
};

export default Navbar;
