import React, { useMemo, useState } from "react";
import { Card, Panel, Badge, Progress } from "../components/ui";
import { IconBell, IconWallet } from "../components/icons";

/** ------------ types ------------ */
type TabId = "orders" | "requests" | "messages" | "payments";
type FilterId = "all" | "action" | "proof" | "pending" | "inprod";

/** ------------ local helpers ------------ */
const cn = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

const SectionHeader: React.FC<{ title: string; action?: React.ReactNode }> = ({
  title,
  action,
}) => (
  <div className="mb-3 flex items-center justify-between">
    <h3 className="text-lg font-semibold tracking-tight text-slate-900">
      {title}
    </h3>
    {action}
  </div>
);

const Tabs: React.FC<{
  value: TabId;
  onChange: (id: TabId) => void;
  tabs: Array<{ id: TabId; label: string }>;
}> = ({ value, onChange, tabs }) => (
  <div className="flex w-full flex-wrap gap-2">
    {tabs.map((t) => (
      <button
        key={t.id}
        onClick={() => onChange(t.id)}
        className={cn(
          "rounded-full px-4 py-2 text-sm font-medium ring-1 ring-slate-200 transition",
          value === t.id
            ? "bg-slate-900 text-white"
            : "bg-white text-slate-700 hover:bg-slate-50"
        )}
      >
        {t.label}
      </button>
    ))}
  </div>
);

const FilterPills: React.FC<{
  value: FilterId;
  onChange: (f: FilterId) => void;
  options: Array<{ id: FilterId; label: string; disabled?: boolean }>;
}> = ({ value, onChange, options }) => (
  <div className="flex flex-wrap items-center gap-2">
    {options.map((o) => (
      <button
        key={o.id}
        disabled={o.disabled}
        onClick={() => onChange(o.id)}
        className={cn(
          "rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-slate-200",
          o.disabled && "opacity-40 cursor-not-allowed",
          value === o.id
            ? "bg-slate-900 text-white"
            : "bg-white text-slate-700 hover:bg-slate-50"
        )}
      >
        {o.label}
      </button>
    ))}
  </div>
);

const Empty: React.FC<{
  title: string;
  subtitle: string;
  cta?: React.ReactNode;
}> = ({ title, subtitle, cta }) => (
  <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
    <p className="text-base font-medium text-slate-800">{title}</p>
    <p className="text-sm text-slate-600">{subtitle}</p>
    {cta && <div className="mt-2">{cta}</div>}
  </div>
);

const Modal: React.FC<
  React.PropsWithChildren<{
    open: boolean;
    onClose: () => void;
    title: string;
    action?: React.ReactNode;
  }>
> = ({ open, onClose, title, action, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="absolute inset-6 mx-auto flex max-w-6xl flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <div className="flex items-center gap-3">
            {action}
            <button
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
    </div>
  );
};

/** ------------ sample data (mock) ------------ */
const sample = {
  buyer: { name: "Ilya", email: "lioubarski@gmail.com", memberSince: "2025" },
  orders: [
    {
      id: "ORD-1042",
      product: "Custom Hoodie",
      maker: "HSD Crafts",
      status: "Proof ready",
      eta: "Tomorrow",
      emoji: "🧥",
      hasProof: true,
      actionRequired: true,
    },
    {
      id: "ORD-1039",
      product: "Laser Engraved Card",
      maker: "TeeDee",
      status: "In production",
      eta: "2 days",
      emoji: "💳",
      hasProof: false,
      actionRequired: false,
    },
    {
      id: "ORD-1037",
      product: "DTF on 20 tees",
      maker: "Local Print Co.",
      status: "Awaiting pickup",
      eta: "Fri",
      emoji: "👕",
      hasProof: false,
      actionRequired: false,
    },
  ],
  requests: [
    {
      id: "REQ-220",
      title: "Embroidery on 5 polos",
      makers: 3,
      state: "Quotes available",
      actionRequired: true,
    },
    {
      id: "REQ-221",
      title: "Laser cut acrylic keychain",
      makers: 1,
      state: "Waiting for maker",
      actionRequired: false,
    },
  ],
  messages: [
    {
      id: "MSG-1",
      from: "Couture Design",
      preview: "Pickup Sat 11–2pm, ok?",
      time: "2h",
    },
  ],
  invoices: [
    {
      id: "INV-5012",
      maker: "HSD Crafts",
      amount: "$84.00",
      status: "Paid",
      date: "Aug 12",
    },
    {
      id: "INV-4998",
      maker: "TeeDee",
      amount: "$42.00",
      status: "Due",
      date: "Aug 9",
    },
  ],
  recommendations: [
    {
      id: 1,
      title: "Custom Leather Keyfob",
      maker: "Atlas Leather",
      price: "$28",
      tag: "Handmade",
      emoji: "🔑",
    },
    {
      id: 2,
      title: "DTF Print – Local Pickup",
      maker: "PrintLab",
      price: "$12",
      tag: "Pickup",
      emoji: "🖨️",
    },
    {
      id: 3,
      title: "Embroidered Dad Hat",
      maker: "ThreadWorks",
      price: "$35",
      tag: "Custom",
      emoji: "🧢",
    },
    {
      id: 4,
      title: "Engraved Water Bottle",
      maker: "LaserLab",
      price: "$22",
      tag: "Popular",
      emoji: "🧴",
    },
  ],
};

/** ------------ page ------------ */
const BuyerDashboard: React.FC = () => {
  const [tab, setTab] = useState<TabId>("orders");
  const [filter, setFilter] = useState<FilterId>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const counts = useMemo(
    () => ({
      orders: sample.orders.length,
      requests: sample.requests.length,
      messages: sample.messages.length,
      payments: sample.invoices.length,
    }),
    []
  );

  const filterOptions = useMemo(
    () =>
      tab === "orders"
        ? [
            { id: "all" as FilterId, label: "All" },
            { id: "action" as FilterId, label: "Action required" },
            { id: "proof" as FilterId, label: "Proof ready" },
            { id: "inprod" as FilterId, label: "In production" },
          ]
        : tab === "requests"
          ? [
              { id: "all" as FilterId, label: "All" },
              { id: "pending" as FilterId, label: "Pending quotes" },
              { id: "action" as FilterId, label: "Action required" },
            ]
          : [{ id: "all" as FilterId, label: "All" }],
    [tab]
  );

  const applyFilter = <T extends any>(items: T[]) => {
    if (tab === "orders") {
      const list = items as unknown as typeof sample.orders;
      switch (filter) {
        case "action":
          return list.filter((o) => o.actionRequired);
        case "proof":
          return list.filter((o) => o.hasProof);
        case "inprod":
          return list.filter((o) => o.status === "In production");
        default:
          return list;
      }
    }
    if (tab === "requests") {
      const list = items as unknown as typeof sample.requests;
      switch (filter) {
        case "pending":
          return list.filter((r) => r.state.toLowerCase().includes("quote"));
        case "action":
          return list.filter((r) => r.actionRequired);
        default:
          return list;
      }
    }
    return items;
  };

  const snapshot = useMemo(() => {
    if (tab === "orders") return applyFilter(sample.orders).slice(0, 4);
    if (tab === "requests") return applyFilter(sample.requests).slice(0, 4);
    if (tab === "messages") return sample.messages.slice(0, 4);
    if (tab === "payments") return sample.invoices.slice(0, 4);
    return [];
  }, [tab, filter]);

  const digest = useMemo(() => {
    const list = [
      ...sample.orders
        .filter((o) => o.actionRequired || o.hasProof)
        .map((o) => ({
          id: o.id,
          title: o.product,
          sub: `${o.maker} • ETA ${o.eta}`,
          badge: o.hasProof ? (
            <Badge tone="success">Proof ready</Badge>
          ) : (
            <Badge tone="warning">Action required</Badge>
          ),
          cta: o.hasProof ? "View proof" : "View order",
        })),
      ...sample.invoices
        .filter((i) => i.status === "Due")
        .map((i) => ({
          id: i.id,
          title: `${i.id} • ${i.maker}`,
          sub: i.date,
          badge: <Badge tone="warning">Due</Badge>,
          cta: "Pay now",
        })),
      ...sample.messages.slice(0, 1).map((m) => ({
        id: m.id,
        title: m.from,
        sub: m.preview,
        badge: <Badge tone="neutral">{m.time}</Badge>,
        cta: "Open",
      })),
    ];
    return list.slice(0, 4);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* page header (kept light; global nav lives in AppLayout) */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Hi {sample.buyer.name}, here’s your{" "}
            <span className="text-emerald-600">Buyer</span> dashboard ·{" "}
            <span className="text-slate-500">My Dashboard</span>
          </h1>
          <p className="mt-2 text-slate-600">
            Manage orders, quotes, and next steps. For profile & security, go to
            Account Settings.
          </p>
        </div>

        {/* Keep Account Settings link, but no bell */}
        <div>
          <a
            href="/account"
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-emerald-600"
          >
            Account Settings
          </a>
        </div>
      </div>

      {/* top row: profile (full) + dominant recent digest */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {/* Profile */}
        <Card className="md:col-span-5">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-xl font-semibold text-white">
              IL
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-slate-900">
                {sample.buyer.email}
              </h2>
              <p className="text-sm text-slate-600">
                Member since {sample.buyer.memberSince}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge tone="success">Verified email</Badge>
                <Badge tone="info">Secure payments</Badge>
              </div>
            </div>
            <a
              href="/account"
              className="ml-auto shrink-0 text-sm font-medium text-slate-600 hover:underline"
            >
              Manage
            </a>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
              <span>Profile completeness</span>
              <span>80%</span>
            </div>
            <Progress value={80} />
            <p className="mt-3 text-xs text-slate-500">
              Add a profile photo to reach 100% and unlock personalized
              recommendations.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button className="rounded-xl bg-white px-4 py-2 text-sm font-medium ring-1 ring-slate-200 hover:bg-slate-50">
              Adjust photo
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium ring-1 ring-slate-200 hover:bg-slate-50">
              <IconWallet className="h-4 w-4" /> QR Wallet
            </button>
          </div>
        </Card>

        {/* Recent activity */}
        <Card className="md:col-span-7">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">
              Recent activity
            </h3>
            <button
              onClick={() => setModalOpen(true)}
              className="text-sm font-medium text-emerald-700 hover:underline"
            >
              Open activity
            </button>
          </div>

          {digest.length ? (
            <div className="divide-y divide-slate-200">
              {digest.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {item.title}
                    </p>
                    <p className="truncate text-xs text-slate-600">
                      {item.sub}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge}
                    <button className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium ring-1 ring-slate-200 hover:bg-slate-50">
                      {item.cta}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No immediate actions.</p>
          )}
        </Card>
      </div>

      {/* activity */}
      <Panel>
        <SectionHeader
          title="Your activity"
          action={
            <Tabs
              value={tab}
              onChange={setTab}
              tabs={[
                { id: "orders", label: `Orders (${counts.orders})` },
                { id: "requests", label: `Requests (${counts.requests})` },
                { id: "messages", label: `Messages (${counts.messages})` },
                { id: "payments", label: `Payments (${counts.payments})` },
              ]}
            />
          }
        />
        <div className="mb-4 flex items-center justify-between gap-3">
          <FilterPills
            value={filter}
            onChange={setFilter}
            options={filterOptions}
          />
          <button
            className="rounded-full bg-white px-3 py-1.5 text-xs font-medium ring-1 ring-slate-200 hover:bg-slate-50"
            onClick={() => setModalOpen(true)}
          >
            See all
          </button>
        </div>

        {/* snapshots */}
        {tab === "orders" &&
          (snapshot.length ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {snapshot.map((o: any) => (
                <div
                  key={o.id}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-lg bg-slate-100 text-lg">
                    {o.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-base font-medium text-slate-900">
                        {o.product}
                      </p>
                      <div className="flex items-center gap-2">
                        {o.actionRequired && (
                          <Badge tone="warning">Action required</Badge>
                        )}
                        {o.hasProof && (
                          <Badge tone="success">Proof ready</Badge>
                        )}
                        <Badge
                          tone={
                            o.status === "In production" ? "neutral" : "success"
                          }
                        >
                          {o.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="truncate text-sm text-slate-600">
                      {o.maker} • ETA {o.eta}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {o.hasProof && (
                        <button className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium ring-1 ring-emerald-300 hover:bg-emerald-50">
                          View proof
                        </button>
                      )}
                      <button className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:opacity-90">
                        View order
                      </button>
                      <button className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium ring-1 ring-slate-200 hover:bg-slate-50">
                        Message maker
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              title="No active orders"
              subtitle="When you place an order it will appear here."
              cta={
                <a
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                  href="#"
                >
                  Browse makers
                </a>
              }
            />
          ))}

        {tab === "requests" &&
          (snapshot.length ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {snapshot.map((r: any) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-slate-200 p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-medium text-slate-900">
                        {r.title}
                      </p>
                      <p className="text-sm text-slate-600">
                        Responses from {r.makers} maker{r.makers > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {r.actionRequired && (
                        <Badge tone="warning">Action required</Badge>
                      )}
                      <Badge tone="neutral">{r.state}</Badge>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:opacity-90">
                      Open quotes
                    </button>
                    <button className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium ring-1 ring-slate-200 hover:bg-slate-50">
                      Compare
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              title="No quote requests"
              subtitle="Post a request and local makers will send quotes."
              cta={
                <a
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                  href="#"
                >
                  Create a request
                </a>
              }
            />
          ))}

        {tab === "messages" &&
          (sample.messages.length ? (
            <div className="grid grid-cols-1 gap-3">
              {sample.messages.slice(0, 4).map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="min-w-0">
                    <p className="truncate text-base font-medium text-slate-900">
                      {m.from}
                    </p>
                    <p className="truncate text-sm text-slate-600">
                      {m.preview}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{m.time}</span>
                    <button className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium ring-1 ring-slate-200 hover:bg-slate-50">
                      Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              title="No messages"
              subtitle="Conversations with makers will appear here."
            />
          ))}

        {tab === "payments" &&
          (sample.invoices.length ? (
            <div className="grid grid-cols-1 gap-3">
              {sample.invoices.slice(0, 4).map((i) => (
                <div
                  key={i.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-4 shadow-sm transition hover:shadow-md"
                >
                  <div>
                    <p className="text-base font-medium text-slate-900">
                      {i.id} • {i.maker}
                    </p>
                    <p className="text-sm text-slate-600">{i.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={i.status === "Paid" ? "success" : "warning"}>
                      {i.status}
                    </Badge>
                    <span className="font-semibold text-slate-900">
                      {i.amount}
                    </span>
                    <button className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:opacity-90">
                      {i.status === "Paid" ? "View" : "Pay now"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              title="No invoices"
              subtitle="When you receive quotes or place orders, invoices will show here."
            />
          ))}
      </Panel>

      {/* Recommended full width */}
      <Panel>
        <SectionHeader
          title="Recommended near you"
          action={
            <button className="text-sm font-medium text-emerald-700 hover:underline">
              Browse marketplace
            </button>
          }
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {sample.recommendations.map((rec) => (
            <div
              key={rec.id}
              className="group rounded-xl border border-slate-200 p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="grid h-28 w-full place-items-center rounded-lg bg-slate-100 text-3xl">
                {rec.emoji}
              </div>
              <div className="mt-3">
                <p className="truncate text-base font-medium text-slate-900">
                  {rec.title}
                </p>
                <p className="truncate text-sm text-slate-600">{rec.maker}</p>
                <div className="mt-2 flex items-center justify-between">
                  <Badge tone="neutral">{rec.tag}</Badge>
                  <span className="font-semibold text-slate-900">
                    {rec.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="mx-auto w-full pt-2 text-center text-xs text-slate-500">
        Prototype mock • Buyer mode • UI only
      </div>

      {/* Focused view modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Your activity – focused view"
        action={
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-64 rounded-full border border-slate-200 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
        }
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <Tabs
            value={tab}
            onChange={setTab}
            tabs={[
              { id: "orders", label: `Orders (${counts.orders})` },
              { id: "requests", label: `Requests (${counts.requests})` },
              { id: "messages", label: `Messages (${counts.messages})` },
              { id: "payments", label: `Payments (${counts.payments})` },
            ]}
          />
          <FilterPills
            value={filter}
            onChange={setFilter}
            options={filterOptions}
          />
        </div>

        {/* Dense lists */}
        {tab === "orders" && (
          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
            {applyFilter(sample.orders)
              .filter((o) =>
                (o.product + o.maker)
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">
                      {o.product}{" "}
                      <span className="text-slate-400">• {o.maker}</span>
                    </p>
                    <p className="truncate text-sm text-slate-600">
                      ETA {o.eta}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {o.actionRequired && (
                      <Badge tone="warning">Action required</Badge>
                    )}
                    {o.hasProof && <Badge tone="success">Proof ready</Badge>}
                    <Badge
                      tone={
                        o.status === "In production" ? "neutral" : "success"
                      }
                    >
                      {o.status}
                    </Badge>
                    <button className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium ring-1 ring-slate-200 hover:bg-slate-50">
                      Open
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {tab === "requests" && (
          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
            {applyFilter(sample.requests)
              .filter((r) =>
                r.title.toLowerCase().includes(search.toLowerCase())
              )
              .map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">
                      {r.title}
                    </p>
                    <p className="truncate text-sm text-slate-600">
                      {r.makers} response{r.makers > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {r.actionRequired && (
                      <Badge tone="warning">Action required</Badge>
                    )}
                    <Badge tone="neutral">{r.state}</Badge>
                    <button className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium ring-1 ring-slate-200 hover:bg-slate-50">
                      Open
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {tab === "messages" && (
          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
            {sample.messages
              .filter((m) =>
                (m.from + m.preview)
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">
                      {m.from}
                    </p>
                    <p className="truncate text-sm text-slate-600">
                      {m.preview}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{m.time}</span>
                    <button className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium ring-1 ring-slate-200 hover:bg-slate-50">
                      Open
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {tab === "payments" && (
          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
            {sample.invoices
              .filter((i) =>
                (i.id + i.maker).toLowerCase().includes(search.toLowerCase())
              )
              .map((i) => (
                <div
                  key={i.id}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {i.id} • {i.maker}
                    </p>
                    <p className="text-sm text-slate-600">{i.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={i.status === "Paid" ? "success" : "warning"}>
                      {i.status}
                    </Badge>
                    <span className="font-semibold text-slate-900">
                      {i.amount}
                    </span>
                    <button className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium ring-1 ring-slate-200 hover:bg-slate-50">
                      {i.status === "Paid" ? "View" : "Pay now"}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BuyerDashboard;
