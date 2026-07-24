import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/Home";
import MarketDetailsPage from "./pages/MarketDetails";
import PortfolioPage from "./pages/Portfolio";
import ProfilePage from "./pages/Profile";
import CreatorPage from "./pages/Creator";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/markets/:marketId" element={<MarketDetailsPage />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/creator/:creatorId" element={<CreatorPage />} />
    </Routes>
  );
}

export default App;
