import React, { useState } from "react";
import { Search, MapPin, LocateFixed, ChevronDown } from "lucide-react";

type LocationMode = "near" | "zip";

export interface ExploreSearchProps {
  initialQuery?: string;
  initialZip?: string;
  initialMode?: LocationMode; // "near" | "zip"
  onSearch: (params: {
    query: string;
    mode: LocationMode;
    zip?: string;
    useGeo?: boolean;
  }) => void;
  className?: string;
}

const ExploreSearch: React.FC<ExploreSearchProps> = ({
  initialQuery = "",
  initialZip = "",
  initialMode = "near",
  onSearch,
  className = "",
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [mode, setMode] = useState<LocationMode>(initialMode);
  const [zip, setZip] = useState(initialZip);
  const [open, setOpen] = useState(false);

  const submit = (useGeo = false) => {
    onSearch({
      query: query.trim(),
      mode,
      zip: mode === "zip" ? zip.trim() : undefined,
      useGeo,
    });
  };

  return (
    <div
      className={`w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-sm ${className}`}
      role="search"
      aria-label="Find makers or products"
    >
      <div className="flex items-stretch gap-2">
        {/* Query */}
        <label className="group relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search makers or products…"
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-[15px] outline-none ring-0 focus:border-slate-300"
          />
        </label>

        {/* Location control */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((s) => !s)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[15px] hover:bg-slate-50"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label="Location options"
          >
            {mode === "near" ? (
              <>
                <MapPin className="h-4 w-4 text-slate-600" />
                <span>Near me</span>
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 text-slate-600" />
                <span>ZIP</span>
              </>
            )}
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>

          {open && (
            <div
              className="absolute right-0 z-20 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-xl"
              role="listbox"
            >
              <button
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
                onClick={() => {
                  setMode("near");
                  setOpen(false);
                }}
              >
                <LocateFixed className="h-4 w-4 text-slate-600" />
                Use my location
              </button>
              <button
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
                onClick={() => {
                  setMode("zip");
                  setOpen(false);
                }}
              >
                <MapPin className="h-4 w-4 text-slate-600" />
                Enter ZIP
              </button>
            </div>
          )}
        </div>

        {/* ZIP field (only when mode === 'zip') */}
        {mode === "zip" && (
          <input
            inputMode="numeric"
            pattern="\d*"
            maxLength={10}
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="ZIP / Area"
            className="w-40 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[15px] outline-none ring-0 focus:border-slate-300"
            aria-label="ZIP or area"
          />
        )}

        {/* CTA */}
        <button
          type="button"
          onClick={() => submit(false)}
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Search
        </button>
      </div>

      {/* Secondary actions (optional) */}
      {mode === "near" && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => submit(true)}
            className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
            aria-label="Use browser location"
            title="Use precise browser location"
          >
            <LocateFixed className="h-3.5 w-3.5" />
            Use precise location
          </button>
        </div>
      )}
    </div>
  );
};

export default ExploreSearch;
