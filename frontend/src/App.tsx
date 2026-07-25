import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import MarketDetail from "@/pages/MarketDetail";
import Portfolio from "@/pages/Portfolio";
import Profile from "@/pages/Profile";
import CreatorMarkets from "@/pages/CreatorMarkets";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/market/:id" element={<MarketDetail />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/creator/:platform/:username" element={<CreatorMarkets />} />
      </Routes>
    </Layout>
  );
}
