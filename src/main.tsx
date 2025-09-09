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
import Explore from "./pages/Explore";
import Orders from "./pages/Orders";
import Account from "./pages/Account";
import { ProfileProvider } from "./ProfileContext";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />, // AppLayout must render <Outlet />
    errorElement: (
      <div style={{ padding: 24 }}>
        <h1>Something went wrong</h1>
        <p>
          <a href="/">Back to home</a>
        </p>
      </div>
    ),
    children: [
      { index: true, element: <Landing /> },
      { path: "buyer", element: <BuyerDashboard /> },
      { path: "maker", element: <MakerDashboard /> },
      { path: "explore", element: <Explore /> },
      { path: "orders", element: <Orders /> },
      { path: "account", element: <Account /> },
      { path: "*", element: <Navigate to="/" replace /> }, // catch-all
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ProfileProvider>
      <RouterProvider router={router} />
    </ProfileProvider>
  </React.StrictMode>
);
