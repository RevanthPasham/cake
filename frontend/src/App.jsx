import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Slider from "./components/Slider";
import CakeCard from "./components/CakeCard";
import CakeDetail from "./components/CakeDetail";
import CategoryPage from "./components/CategoryPage";
import SearchPage from "./components/SearchPage";
import Footer from "./components/Footer";
import { useState } from "react";

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <Router>
      <div></div>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <div className="p-3 bg-gray-50 min-h-screen">
              <Slider onSelectCategory={(cat) => setSelectedCategory(cat[0])} />
              <CakeCard category={selectedCategory} />
            </div>
          }
        />

        <Route path="/category/:name" element={<CategoryPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/cake/:id" element={<CakeDetail />} />
      </Routes>

      {/* Footer OUTSIDE the routes */}
      <Footer />
    </Router>
  );
}

export default App;
