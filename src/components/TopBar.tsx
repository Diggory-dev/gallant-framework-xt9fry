import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Mail } from "lucide-react";
import { useProfile } from "../ProfileContext";

type ActiveKey = "home" | "buyer" | "maker" | "orders" | "account" | "explore";

export default function TopBar({ active }: { active: ActiveKey }) {
  const { profile, setProfile } = useProfile();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const switchTo = (p: "buyer" | "maker") => {
    if (p !== profile) setProfile(p);
    navigate("/" + p);
  };

  // Close dropdown on outside click / ESC
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-40 bg-white/90 backdrop-blur border-b transition-colors duration-200",
        profile === "maker" ? "border-indigo-500" : "border-slate-200",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link to="/" className="text-lg font-semibold tracking-tight">
          Kavaar
        </Link>

        {/* Primary nav removed by request */}

        {/* Right: persistent Buyer/Maker pill + icons + profile */}
        <div className="flex items-center gap-3">
          {/* Buyer/Maker pill (persistent) */}
          <div className="flex items-center rounded-full border border-slate-200 bg-white p-0.5">
            <button
              type="button"
              onClick={() => switchTo("buyer")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                profile === "buyer"
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              Buyer
            </button>
            <button
              type="button"
              onClick={() => switchTo("maker")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                profile === "maker"
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              Maker
            </button>
          </div>

          {/* Icons (unchanged visuals) */}
          <Link
            to="/messages"
            aria-label="Messages"
            className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white hover:bg-slate-50"
          >
            <Mail className="h-4 w-4 text-slate-700" />
          </Link>
          <Link
            to="/notifications"
            aria-label="Notifications"
            className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white hover:bg-slate-50"
          >
            <Bell className="h-4 w-4 text-slate-700" />
          </Link>

          {/* Profile avatar + dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => setOpen((s) => !s)}
              className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-xs font-semibold text-white"
              title="Profile"
            >
              U
            </button>

            {open && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-xl p-1"
              >
                <button
                  role="menuitem"
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-sm"
                  onClick={() => {
                    setOpen(false);
                    navigate("/" + profile); // '/buyer' or '/maker'
                  }}
                >
                  Dashboard
                </button>
                <button
                  role="menuitem"
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-sm"
                  onClick={() => {
                    setOpen(false);
                    navigate("/account");
                  }}
                >
                  Account Settings
                </button>
                <button
                  role="menuitem"
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-sm"
                  onClick={() => {
                    setOpen(false);
                    navigate("/orders");
                  }}
                >
                  My Orders
                </button>
                <button
                  role="menuitem"
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-sm"
                  onClick={() => {
                    setOpen(false);
                    navigate("/logout");
                  }}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Maker-only thin accent stripe */}
      {profile === "maker" && (
        <div className="h-0.5 w-full bg-indigo-500 transition-colors duration-200" />
      )}
    </header>
  );
}
