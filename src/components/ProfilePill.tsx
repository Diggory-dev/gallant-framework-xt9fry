import React from "react";
import { useProfile, UserProfile } from "../ProfileContext";

type Props = { className?: string; onChange?: (p: UserProfile) => void };

const tabBase =
  "px-3 py-1.5 rounded-full text-sm font-medium transition select-none focus:outline-none";
const active = "bg-black text-white";
const inactive = "bg-gray-100 text-gray-700 hover:bg-gray-200";
const shell = "inline-flex items-center gap-1 p-1 rounded-full bg-gray-100 border border-gray-200";

const ProfilePill: React.FC<Props> = ({ className = "", onChange }) => {
  const { profile, setProfile } = useProfile();

  const set = (p: UserProfile) => {
    if (p !== profile) {
      setProfile(p);
      onChange?.(p);
    }
  };

  return (
    <div className={`${shell} ${className}`} role="tablist" aria-label="Profile selector">
      <button
        role="tab"
        aria-selected={profile === "buyer"}
        className={`${tabBase} ${profile === "buyer" ? active : inactive}`}
        onClick={() => set("buyer")}
      >
        Buyer
      </button>
      <button
        role="tab"
        aria-selected={profile === "maker"}
        className={`${tabBase} ${profile === "maker" ? active : inactive}`}
        onClick={() => set("maker")}
      >
        Maker
      </button>
    </div>
  );
};

export default ProfilePill;