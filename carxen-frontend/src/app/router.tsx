import { createBrowserRouter } from "react-router-dom";

import HomePage from "../pages/Home";
import MarketDetailsPage from "../pages/MarketDetails";
import PortfolioPage from "../pages/Portfolio";
import ProfilePage from "../pages/Profile";
import CreatorPage from "../pages/Creator";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/markets/:marketId",
    element: <MarketDetailsPage />,
  },
  {
    path: "/portfolio",
    element: <PortfolioPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/creator/:creatorId",
    element: <CreatorPage />,
  },
]);
