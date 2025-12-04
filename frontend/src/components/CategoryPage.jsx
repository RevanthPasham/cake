import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API } from "../config";
import CakeCard from "./CakeCard";

const CategoryPage = () => {
  const { name } = useParams();
  const [cakes, setCakes] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_API}/cakes/category/${name}`)
      .then((res) => setCakes(res.data))
      .catch((err) => console.log(err));
  }, [name]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">{name} Cakes</h2>

      {cakes.length === 0 ? (
        <p>No cakes found in this category.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {cakes.map((cake) => (
            <CakeCard key={cake._id} category={cake.categories[0]} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
