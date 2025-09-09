import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type UserProfile = "buyer" | "maker";
const STORAGE_KEY = "kavaar.activeProfile";

type Ctx = {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  toggleProfile: () => void;
};

const ProfileContext = createContext<Ctx | null>(null);

function getInitialProfile(): UserProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "buyer" || saved === "maker") return saved;
  } catch {}
  return "buyer";
}

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [profile, setProfileState] = useState<UserProfile>(getInitialProfile());

  const setProfile = (p: UserProfile) => {
    setProfileState(p);
    try {
      localStorage.setItem(STORAGE_KEY, p);
    } catch {}
  };

  const toggleProfile = () =>
    setProfile(profile === "buyer" ? "maker" : "buyer");

  // Cross-tab sync (switching in one tab updates others)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (
        e.key === STORAGE_KEY &&
        (e.newValue === "buyer" || e.newValue === "maker")
      ) {
        setProfileState(e.newValue as UserProfile);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo(
    () => ({ profile, setProfile, toggleProfile }),
    [profile]
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within a ProfileProvider");
  return ctx;
}
