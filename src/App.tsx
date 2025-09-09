import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import Landing from "./pages/Landing";
import BuyerDashboard from "./pages/BuyerDashboard";
import MakerDashboard from "./pages/MakerDashboard";
import Orders from "./pages/Orders";
import Account from "./pages/Account";
import Explore from "./pages/Explore";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Landing /> }, // only ONE index
      { path: "buyer", element: <BuyerDashboard /> },
      { path: "maker", element: <MakerDashboard /> },
      { path: "orders", element: <Orders /> },
      { path: "account", element: <Account /> },
      { path: "explore", element: <Explore /> },
      { path: "*", element: <Navigate to="/explore" replace /> }, // catch-all
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
