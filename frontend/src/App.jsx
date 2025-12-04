// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Slider from "./components/Slider";
import CakeCard from "./components/CakeCard";
import CakeDetail from "./components/CakeDetail";
import CategoryPage from "./components/CategoryPage";
import { useState } from "react";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("Chocolate");

  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <div className="p-3 bg-gray-50 min-h-screen">

              <Slider
                onSelectCategory={(catArray) => {
                  console.log("Selected category:", catArray);
                  setSelectedCategory(catArray[0]); // pick first string
                }}
              />

              <CakeCard category={selectedCategory} />
            </div>
          }
        />

                 <Route path="/category/:name" element={<CategoryPage />} />

        {/* Cake Detail */}
        <Route path="/cake/:id" element={<CakeDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
