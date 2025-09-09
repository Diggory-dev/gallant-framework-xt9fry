import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";
import { useProfile } from "../ProfileContext";

const AppLayout: React.FC = () => {
  const { profile } = useProfile();

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar active={"home"} />

      {/* maker-only ambient tint (keeps cards/sections white) */}
      <div
        className={[
          "flex-1 transition-colors duration-200",
          profile === "maker" ? "bg-indigo-50/30" : "bg-white",
        ].join(" ")}
      >
        <main className="mx-auto max-w-6xl px-4 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
