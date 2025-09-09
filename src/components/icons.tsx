import React from "react";
export const IconWallet = (p: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    {...p}
  >
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M17 12h2" strokeLinecap="round" />
  </svg>
);
export const IconBell = (p: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    {...p}
  >
    <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2z" />
    <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9z" />
  </svg>
);
