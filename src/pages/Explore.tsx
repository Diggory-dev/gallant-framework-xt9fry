import React, { useEffect, useMemo, useState } from "react";
import {
  Search as SearchIcon,
  MapPin,
  LocateFixed,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

/**
 * Explore page
 * - Modern search bar with unified location control (Near me / ZIP)
 * - Query params sync (?q=, ?mode=, ?zip=) so searches are shareable
 * - Keeps familiar Explore structure: breadcrumbs, title, filters, tabs, grid
 */

type LocationMode = "near" | "zip";
type TabKey = "products" | "makers";

export default function Explore() {
  // ---- URL state (shareable) -----------------------------------------------
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [mode, setMode] = useState<LocationMode>(
    (params.get("mode") as LocationMode) || "near"
  );
  const [zip, setZip] = useState(params.get("zip") ?? "");
  const [tab, setTab] = useState<TabKey>(
    (params.get("tab") as TabKey) || "products"
  );

  useEffect(() => {
    const p = new URLSearchParams(params);
    if (query) p.set("q", query);
    else p.delete("q");

    p.set("mode", mode);
    if (mode === "zip" && zip) p.set("zip", zip);
    else p.delete("zip");

    p.set("tab", tab);
    setParams(p, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, mode, zip, tab]);

  // ---- Fake data (replace with your API results) ----------------------------
  const items = useMemo(
    () =>
      Array.from({ length: 9 }).map((_, i) => ({
        id: i + 1,
        title:
          i % 3 === 0
            ? "Engraved Water Bottle"
            : i % 3 === 1
              ? "Embroidered Dad Hat"
              : "Custom Hoodie",
        price: i % 3 === 0 ? 22 : i % 3 === 1 ? 35 : 48,
        shop:
          i % 3 === 0
            ? "LaserLab"
            : i % 3 === 1
              ? "ThreadWorks"
              : "Hoodie House",
        eta: i % 3 === 0 ? "1-3 days" : i % 3 === 1 ? "1-3 days" : "4-7 days",
        rating: i % 3 === 0 ? 4.8 : i % 3 === 1 ? 4.7 : 4.9,
        img:
          i % 3 === 0
            ? "https://images.unsplash.com/photo-1542744094-24638eff58bb?q=80&w=1200&auto=format&fit=crop"
            : i % 3 === 1
              ? "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop"
              : "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1200&auto=format&fit=crop",
      })),
    []
  );

  // ---- Search submit handler -------------------------------------------------
  const runSearch = ({ useGeo = false }: { useGeo?: boolean } = {}) => {
    // Wire your API call here. We already sync URL state above.
    // Example:
    // fetch(`/api/explore?q=${query}&mode=${mode}&zip=${zip}&geo=${useGeo}`)
    //  .then(...)
  };

  // ---- UI helpers ------------------------------------------------------------
  const pillBase =
    "px-3 py-1.5 rounded-full text-xs font-medium transition-colors";
  const chipBase =
    "inline-flex items-center rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50";

  // ---- Render ---------------------------------------------------------------
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Breadcrumbs */}
      <nav className="mb-2 text-xs text-slate-500">
        <Link to="/" className="hover:underline">
          Home
        </Link>{" "}
        / <span>Explore</span>
      </nav>

      {/* Title + Search */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Explore
        </h1>
      </div>

      {/* --- Modern Search Bar --- */}
      <div
        className="mb-4 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
        role="search"
        aria-label="Find makers or products"
      >
        <div className="flex items-stretch gap-2">
          {/* Query field */}
          <label className="group relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <SearchIcon className="h-4 w-4" />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search makers or products…"
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-[15px] outline-none ring-0 focus:border-slate-300"
            />
          </label>

          {/* Location control */}
          <LocationSelect mode={mode} setMode={setMode} />

          {/* ZIP field only when 'zip' mode */}
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
            onClick={() => runSearch()}
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Search
          </button>
        </div>

        {/* Secondary action (precise location) */}
        {mode === "near" && (
          <div className="mt-2">
            <button
              type="button"
              onClick={() => runSearch({ useGeo: true })}
              className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
              aria-label="Use precise browser location"
              title="Use precise browser location"
            >
              <LocateFixed className="h-3.5 w-3.5" />
              Use precise location
            </button>
          </div>
        )}
      </div>

      {/* Body: Filters + Results */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Filters */}
        <aside className="col-span-12 md:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-medium text-slate-900">Filters</div>
            <button className="text-xs text-slate-600 hover:underline">
              Clear all
            </button>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700">
                Category
              </span>
              <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            </div>
            <select className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm">
              <option>All</option>
              <option>Laser Engraving</option>
              <option>Embroidery</option>
              <option>Custom Printing</option>
              <option>Woodworking</option>
            </select>

            <div className="pt-2">
              <div className="mb-2 text-xs font-medium text-slate-700">
                Turnaround
              </div>
              <div className="flex flex-wrap gap-2">
                <button className={chipBase}>any</button>
                <button className={chipBase}>Same day</button>
                <button className={chipBase}>1–3 days</button>
                <button className={chipBase}>4–7 days</button>
              </div>
            </div>

            <div className="pt-2">
              <div className="mb-2 text-xs font-medium text-slate-700">
                Fulfillment
              </div>
              <div className="flex flex-wrap gap-2">
                <button className={chipBase}>Pickup</button>
                <button className={chipBase}>Delivery</button>
              </div>
            </div>

            <div className="pt-2">
              <div className="mb-2 text-xs font-medium text-slate-700">
                Price
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className={
                    pillBase + " border border-slate-200 text-slate-700"
                  }
                >
                  ANY
                </button>
                <button
                  className={
                    pillBase + " border border-slate-200 text-slate-700"
                  }
                >
                  $
                </button>
                <button
                  className={
                    pillBase + " border border-slate-200 text-slate-700"
                  }
                >
                  $$
                </button>
                <button
                  className={
                    pillBase + " border border-slate-200 text-slate-700"
                  }
                >
                  $$$
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <section className="col-span-12 md:col-span-9">
          {/* Tabs + Sort */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 rounded-full bg-slate-100 p-1">
              <button
                onClick={() => setTab("products")}
                className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                  tab === "products"
                    ? "bg-white shadow text-slate-900"
                    : "text-slate-700"
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setTab("makers")}
                className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                  tab === "makers"
                    ? "bg-white shadow text-slate-900"
                    : "text-slate-700"
                }`}
              >
                Makers
              </button>
            </div>

            <div className="text-xs text-slate-600">
              Sort:&nbsp;
              <select className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs">
                <option>Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
                <option>Fastest ETA</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it) => (
              <article
                key={it.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="aspect-[16/11] w-full overflow-hidden bg-slate-100">
                  <img
                    src={it.img}
                    alt={it.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {it.title}
                      </h3>
                      <div className="mt-0.5 text-xs text-slate-600">
                        ${it.price} &middot; {it.shop}
                      </div>
                    </div>
                    <div className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700">
                      {it.rating}★
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-700">
                      Pickup
                    </span>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-700">
                      {it.eta}
                    </span>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Link
                      to="/orders"
                      className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      View order
                    </Link>
                    <Link
                      to="/messages"
                      className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Message maker
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ----------------------- Helper: LocationSelect --------------------------- */

function LocationSelect({
  mode,
  setMode,
}: {
  mode: LocationMode;
  setMode: (m: LocationMode) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[15px] hover:bg-slate-50"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Location options"
      >
        <MapPin className="h-4 w-4 text-slate-600" />
        <span>{mode === "near" ? "Near me" : "ZIP"}</span>
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
  );
}
