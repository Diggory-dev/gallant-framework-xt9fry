import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui";
import { Search, LocateFixed, ArrowRight } from "lucide-react";

type Product = { id: number; name: string; price: string; image: string };
type Maker = {
  id: number;
  name: string;
  city: string;
  rating: number;
  jobs: number;
  avatar: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Custom Hoodie",
    price: "$48",
    image:
      "https://images.unsplash.com/photo-1520975922131-cf2a7b6f61c2?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Laser Engraved Card",
    price: "$14",
    image:
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "DTF – Local Pickup",
    price: "$12",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Embroidered Dad Hat",
    price: "$35",
    image:
      "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Engraved Water Bottle",
    price: "$22",
    image:
      "https://images.unsplash.com/photo-1519638399535-1b036603ac77?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Custom Keyfob",
    price: "$18",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 7,
    name: "Printed Stickers (50)",
    price: "$19",
    image:
      "https://images.unsplash.com/photo-1611162618071-b39a2ec1c7b6?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 8,
    name: "Etched Pint Glass",
    price: "$16",
    image:
      "https://images.unsplash.com/photo-1536383383049-2b1f1d7ae5c0?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 9,
    name: "Wood Sign (12x18)",
    price: "$42",
    image:
      "https://images.unsplash.com/photo-1470909752005-2da119d8a3d8?q=80&w=1200&auto=format&fit=crop",
  },
];

const makers: Maker[] = [
  {
    id: 1,
    name: "Couture Design",
    city: "San Diego, CA",
    rating: 4.9,
    jobs: 214,
    avatar: "https://i.pravatar.cc/96?img=12",
  },
  {
    id: 2,
    name: "LaserLab",
    city: "La Mesa, CA",
    rating: 4.8,
    jobs: 156,
    avatar: "https://i.pravatar.cc/96?img=32",
  },
  {
    id: 3,
    name: "ThreadWorks",
    city: "Chula Vista, CA",
    rating: 4.7,
    jobs: 301,
    avatar: "https://i.pravatar.cc/96?img=5",
  },
  {
    id: 4,
    name: "Wood & Co.",
    city: "Encinitas, CA",
    rating: 4.8,
    jobs: 141,
    avatar: "https://i.pravatar.cc/96?img=23",
  },
  {
    id: 5,
    name: "MetalMade",
    city: "Carlsbad, CA",
    rating: 4.6,
    jobs: 188,
    avatar: "https://i.pravatar.cc/96?img=14",
  },
  {
    id: 6,
    name: "SignSmith",
    city: "Oceanside, CA",
    rating: 4.7,
    jobs: 129,
    avatar: "https://i.pravatar.cc/96?img=9",
  },
];

const categories = [
  "Laser Engraving",
  "Embroidery",
  "Custom Printing",
  "Woodworking",
  "Metalwork",
  "Signs & Banners",
  "DTF / HTV",
  "Sewing & Alterations",
];

const Landing: React.FC = () => {
  // search state
  const [q, setQ] = useState("");
  const [zip, setZip] = useState("");
  const [usingLocation, setUsingLocation] = useState(false);

  const handleUseLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      () => {
        setUsingLocation(true);
        // TODO: reverse-geocode to ZIP -> setZip(...)
      },
      () => setUsingLocation(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-8 md:p-12">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Local makers. Custom, fast.
          </h1>

          {/* 4-part search → routes to /explore */}
          <form
            action="/explore"
            className="mt-6 grid w-full max-w-3xl grid-cols-[1fr,auto,auto,auto] items-stretch overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-emerald-300"
          >
            {/* query */}
            <label className="sr-only" htmlFor="q">
              What do you need?
            </label>
            <div className="flex items-center gap-2 px-3">
              <Search className="h-5 w-5 flex-none text-slate-500" />
              <input
                id="q"
                name="q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search makers or requests…"
                className="w-full border-0 bg-transparent py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            {/* use my location */}
            <button
              type="button"
              onClick={handleUseLocation}
              className="flex items-center gap-2 border-l border-slate-200 px-3 text-sm text-slate-700 hover:bg-slate-50"
              title="Use my location"
            >
              <LocateFixed className="h-4 w-4" />
              <span className="hidden sm:inline">
                {usingLocation ? "Near me" : "Use location"}
              </span>
            </button>

            {/* zip / area */}
            <div className="flex items-center gap-2 border-l border-slate-200 px-3">
              <label htmlFor="zip" className="sr-only">
                ZIP or area
              </label>
              <input
                id="zip"
                name="zip"
                inputMode="numeric"
                pattern="\d*"
                maxLength={10}
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder={usingLocation ? "Near me" : "ZIP / Area"}
                className="w-28 border-0 bg-transparent py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            {/* submit */}
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-l-none bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Search
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>

      {/* CATEGORIES as chips → link to /explore?cat=... */}
      <section className="mx-auto max-w-5xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            Browse categories
          </h2>
          <Link
            to="/explore"
            className="text-sm font-medium text-emerald-700 hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c}
              to={`/explore?cat=${encodeURIComponent(c)}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED LOCAL PRODUCTS — grid (cards link to /explore?q=...) */}
      <section className="mx-auto max-w-5xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            Featured local products
          </h2>
          <Link
            to="/explore"
            className="text-sm font-medium text-emerald-700 hover:underline"
          >
            Browse marketplace
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {products.slice(0, 9).map((p) => (
            <Link key={p.id} to={`/explore?q=${encodeURIComponent(p.name)}`}>
              <Card>
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-40 w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="mt-3">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {p.name}
                  </p>
                  <p className="text-sm text-slate-700">{p.price}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED MAKERS — grid (unchanged routing unless you want detail pages) */}
      <section className="mx-auto max-w-5xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            Featured makers
          </h2>
          <Link
            to="/maker"
            className="text-sm font-medium text-emerald-700 hover:underline"
          >
            Become a maker
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {makers.slice(0, 6).map((m) => (
            <Card key={m.id}>
              <div className="flex items-start gap-3">
                <img
                  src={m.avatar}
                  alt={m.name}
                  className="h-12 w-12 rounded-full object-cover"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">
                    {m.name}
                  </p>
                  <p className="text-sm text-slate-600">{m.city}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    ★ {m.rating} • {m.jobs} jobs
                  </p>
                </div>
                <Link
                  to={`/explore?tab=makers&q=${encodeURIComponent(m.name)}`}
                  className="ml-auto rounded-lg bg-white px-3 py-1.5 text-xs font-medium ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  View profile
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FOOTER CTA — single action */}
      <section className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center md:p-8">
        <h3 className="text-lg font-semibold text-slate-900">
          Join the local maker network
        </h3>
        <div className="mt-4">
          <Link
            to="/maker"
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Become a maker
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;