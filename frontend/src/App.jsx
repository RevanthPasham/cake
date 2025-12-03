// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Slider from "./components/Slider";
import CakeCard from "./components/CakeCard";
import CakeDetail from "./components/CakeDetail";
import { useState } from "react";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("Chocolate"); 

  return (
    <Router>
      <Routes>

        {/* ------------ HOME PAGE ------------ */}
        <Route
          path="/"
          element={
            <div className="p-3 bg-gray-50 min-h-screen">
              <Navbar />

              {/* SLIDER - passes category array */}
              <Slider onSelectCategory={(catArray) => {
                // Take first category OR send whole array
                setSelectedCategory(catArray[0]);
              }} />

              {/* SHOW CAKES BASED ON SELECTED CATEGORY */}
              <CakeCard category={selectedCategory} />
            </div>
          }
        />

        {/* ------------ CAKE DETAILS PAGE ------------ */}
        <Route path="/cake/:id" element={<CakeDetail />} />

      </Routes>
    </Router>
  );
}

export default App;
