import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API } from "../config";

const FilterBar = ({ filters, onFilterChange }) => {
  const [options, setOptions] = useState({
    flavours: [],
    weights: [],
  });

  useEffect(() => {
    axios.get(`${BASE_API}/filter-options`).then((res) => {
      setOptions({
        flavours: res.data.flavours || [],
        weights: res.data.weights || [],
      });
    });
  }, []);

  const getWrapperStyle = (key) => {
    const isActive = filters[key] !== "all" && filters[key] !== "default";

    return isActive
      ? "bg-amber-100 border-amber-400"
      : "bg-white border-gray-300";
  };

  // ⭐ Ultra-compact pill style
 const selectStyle =
  "text-[10px] bg-transparent pl-2 pr-4 rounded-full " +
  "focus:outline-none appearance-none h-[24px] leading-[24px]";


  return (
    <div className="flex gap-1 whitespace-nowrap mb-4 items-center">

      {/* Veg */}
      <div className={`border flex  rounded-full px-1 h-[24px] ${getWrapperStyle("veg")}`}>
        <select
          className={selectStyle}
          value={filters.veg}
          onChange={(e) => onFilterChange("veg", e.target.value)}
        >
          <option value="all">Veg/Non-Veg</option>
          <option value="veg">Veg Only</option>
          <option value="nonveg">Non-Veg</option>
        </select>
      </div>

      {/* Flavours */}
      <div className={`border flex rounded-full px-1 h-[24px] ${getWrapperStyle("flavour")}`}>
        <select
          className={selectStyle}
          value={filters.flavour}
          onChange={(e) => onFilterChange("flavour", e.target.value)}
        >
          <option value="all">Flavours</option>
          {options.flavours.map((flav, i) => (
            <option key={i} value={flav}>{flav}</option>
          ))}
        </select>
      </div>

      {/* Weights */}
      <div className={`border flex rounded-full px-1 h-[24px] ${getWrapperStyle("weight")}`}>
        <select
          className={selectStyle}
          value={filters.weight}
          onChange={(e) => onFilterChange("weight", e.target.value)}
        >
          <option value="all">Weights</option>
          {options.weights.map((wt, i) => (
            <option key={i} value={wt}>{wt}</option>
          ))}
        </select>
      </div>

      {/* Sort */}
      <div className={`border flex rounded-full px-1 h-[24px] ${getWrapperStyle("sort")}`}>
        <select
          className={selectStyle}
          value={filters.sort}
          onChange={(e) => onFilterChange("sort", e.target.value)}
        >
          <option value="default">Sort</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>
      </div>

    </div>
  );
};

export default FilterBar;
