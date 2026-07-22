import { Navigate, Route, Routes } from "react-router-dom";

import Home from "@/pages/Home";
import Portfolio from "@/pages/Portfolio";
import Activity from "@/pages/Activity";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/portfolio" element={<Portfolio />} />

      <Route path="/activity" element={<Activity />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="/home" element={<Navigate to="/" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
