import React, { useEffect, useMemo, useState } from "react";
import { Card, Panel, Badge, Progress } from "../components/ui";
import QuickTools from "../components/QuickTools";
import { ChevronDown } from "lucide-react";

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

const Collapsible: React.FC<
  React.PropsWithChildren<{ title: string; open?: boolean; count?: number }>
> = ({ title, open = false, count, children }) => {
  const [isOpen, setOpen] = useState(open);
  return (
    <Panel className="mb-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl px-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
        aria-expanded={isOpen}
      >
        <h4 className="text-base font-semibold text-slate-900">{title}</h4>
        <div className="flex items-center gap-2">
          {typeof count === "number" && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
              {count}
            </span>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-slate-500 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </button>
      {isOpen && <div className="mt-4">{children}</div>}
    </Panel>
  );
};

/* ---- mock data ---- */
const sample = {
  maker: {
    name: "TeeDee",
    email: "lioubarski@gmail.com",
    memberSince: "2025",
    completeness: 80,
  },
  today: {
    quotesToSend: 2,
    proofsAwaiting: 1,
    blockedOrders: 1,
    pickupsToday: 3,
  },
  kpis: { products: 12, trustScore: 0.6, revenueMonth: "$1,240" },
  requests: [
    {
      id: "REQ-320",
      title: "50 laser keyfobs",
      from: "Atlas Events",
      age: "1h",
      responses: 0,
    },
    {
      id: "REQ-318",
      title: "Embroidery on 12 polos",
      from: "Green Gym",
      age: "1d",
      responses: 2,
    },
  ],
  messages: [
    {
      id: "MSG-11",
      from: "Couture Design",
      preview: "Can we move pickup to Sat 1–2pm?",
      time: "2h",
    },
    {
      id: "MSG-10",
      from: "LaserLab",
      preview: "Shared material spec PDF",
      time: "1d",
    },
  ],
  payouts: [
    { id: "P-1090", date: "Aug 11", amount: "$226.00", status: "Paid" },
    { id: "P-1087", date: "Aug 8", amount: "$412.00", status: "Paid" },
  ],
  products: [
    { id: 1, name: "Custom Hoodie", price: "$48", visits: 124 },
    { id: 2, name: "Laser Engraved Card", price: "$14", visits: 96 },
    { id: 3, name: "DTF Print – Local Pickup", price: "$12", visits: 201 },
  ],
  activity: [
    { id: "A-1", text: "Proof approved by buyer for ORD-1042", time: "10m" },
    { id: "A-2", text: "Invoice INV-4998 marked Paid", time: "3h" },
    { id: "A-3", text: "New message from Couture Design", time: "2h" },
  ],
};

const MakerDashboard: React.FC = () => {
  // maker-only subtle fade on enter
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [vacation, setVacation] = useState(false);

  const todayCards = useMemo(
    () => [
      {
        label: "Quotes to send",
        value: sample.today.quotesToSend,
        href: "/orders?view=kanban&filter=quotes",
      },
      {
        label: "Proofs awaiting approval",
        value: sample.today.proofsAwaiting,
        href: "/orders?view=kanban&filter=proofs",
      },
      {
        label: "Orders blocked",
        value: sample.today.blockedOrders,
        href: "/orders?view=kanban&filter=blocked",
      },
      {
        label: "Pickups today",
        value: sample.today.pickupsToday,
        href: "/orders?view=kanban&filter=pickup-today",
      },
      {
        label: "Messages needing reply",
        value: sample.messages.length,
        href: "/messages?filter=unanswered",
      },
      {
        label: "New requests",
        value: sample.requests.length,
        href: "/requests?filter=new",
      },
    ],
    []
  );

  return (
    <div
      className={`transition-opacity duration-200 ${mounted ? "opacity-100" : "opacity-0"}`}
    >
      {/* page title */}
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Maker dashboard ·{" "}
            <span className="text-slate-500">{sample.maker.name}</span>
          </h1>
          <p className="mt-2 text-slate-600">
            Snapshot of today’s work, quick tools, and key metrics. Full order
            management lives in your Kanban board.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={vacation ? "warning" : "success"}>
            {vacation ? "On vacation (hidden)" : "Active maker"}
          </Badge>
          <button
            onClick={() => setVacation((v) => !v)}
            className="rounded-full bg-white px-3 py-1.5 text-sm font-medium ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
          >
            {vacation ? "Set Active" : "Start Vacation"}
          </button>
        </div>
      </div>

      {vacation && (
        <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Your store is in <strong>shadow close</strong>. You won’t appear in
          search/homepage and new orders are paused. Existing buyers can still
          message you.
        </div>
      )}

      {/* top row */}
      <div className="mt-4 grid grid-cols-1 items-start gap-4 md:grid-cols-12">
        {/* LEFT: Profile & KPIs */}
        <Card className="md:col-span-5">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-lg font-semibold text-white">
              TD
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-slate-900">
                {sample.maker.email}
              </p>
              <p className="text-sm text-slate-600">
                Member since {sample.maker.memberSince}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge tone="success">Verified</Badge>
                <Badge tone="info">Stripe Connected</Badge>
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
              <span>{sample.maker.completeness}%</span>
            </div>
            <Progress value={sample.maker.completeness} />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 p-3 text-center">
              <p className="text-2xl font-semibold text-slate-900">
                {sample.kpis.products}
              </p>
              <p className="text-xs text-slate-700">Products</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3 text-center">
              <p className="text-2xl font-semibold text-slate-900">
                {sample.kpis.trustScore}
              </p>
              <p className="text-xs text-slate-700">Trust score</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3 text-center">
              <p className="text-2xl font-semibold text-slate-900">
                {sample.kpis.revenueMonth}
              </p>
              <p className="text-xs text-slate-700">Revenue (MTD)</p>
            </div>
          </div>
        </Card>

        {/* RIGHT: Today’s work */}
        <Card className="md:col-span-7">
          <SectionHeader
            title="Today’s work"
            action={
              <a
                href="/orders?view=kanban"
                className="text-sm font-medium text-indigo-700 hover:underline"
              >
                View all in Kanban
              </a>
            }
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {todayCards.map((c) => (
              <a
                key={c.label}
                href={c.href}
                aria-label={`${c.label} (${c.value})`}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-xs font-semibold text-slate-900 ring-1 ring-slate-200">
                    {c.value}
                  </span>
                  <span>{c.label}</span>
                </div>
              </a>
            ))}
          </div>
        </Card>
      </div>

      {/* quick tools */}
      <Panel className="mt-4">
        <SectionHeader title="Quick tools" />
        <QuickTools />
      </Panel>

      {/* collapsibles */}
      <Collapsible
        title="Payments (Stripe Connect)"
        count={sample.payouts.length}
        open
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {sample.payouts.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
            >
              <div>
                <p className="font-medium text-slate-900">
                  {p.id} • {p.date}
                </p>
                <p className="text-sm text-slate-700">Payout</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone="success">{p.status}</Badge>
                <span className="font-semibold text-slate-900">{p.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </Collapsible>

      <Collapsible title="Quote requests" count={sample.requests.length}>
        {sample.requests.length ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {sample.requests.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-slate-200 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{r.title}</p>
                    <p className="text-sm text-slate-700">
                      {r.from} • {r.age} ago
                    </p>
                  </div>
                  <Badge tone={r.responses ? "neutral" : "warning"}>
                    {r.responses ? `${r.responses} responses` : "No response"}
                  </Badge>
                </div>
                <div className="mt-3 flex gap-2">
                  <a
                    href={`/requests/${r.id}`}
                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
                  >
                    Open
                  </a>
                  <a
                    href={`/requests/${r.id}/quote`}
                    className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
                  >
                    Send quote
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-6 text-sm text-slate-600">
            No requests right now.
          </div>
        )}
      </Collapsible>

      <Collapsible title="Messages" count={sample.messages.length}>
        {sample.messages.length ? (
          <div className="grid grid-cols-1 gap-3">
            {sample.messages.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">
                    {m.from}
                  </p>
                  <p className="truncate text-sm text-slate-700">{m.preview}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">{m.time}</span>
                  <a
                    href={`/messages/${m.id}`}
                    className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
                  >
                    Open
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-6 text-sm text-slate-600">
            Your inbox is clear.
          </div>
        )}
      </Collapsible>

      <Collapsible title="Products" count={sample.products.length}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {sample.products.map((p) => (
            <div
              key={p.id}
              className="group rounded-xl border border-slate-200 p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="grid h-24 w-full place-items-center rounded-lg bg-slate-100 text-3xl">
                📦
              </div>
              <div className="mt-3">
                <p className="truncate text-base font-medium text-slate-900">
                  {p.name}
                </p>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-slate-700">{p.visits} visits</span>
                  <span className="font-semibold text-slate-900">
                    {p.price}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <a
                    href={`/products/${p.id}/edit`}
                    className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
                  >
                    Edit
                  </a>
                  <a
                    href={`/products/${p.id}`}
                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
                  >
                    View
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Collapsible>

      {/* recent activity */}
      <Panel>
        <SectionHeader
          title="Recent activity"
          action={
            <a
              href="/orders?view=kanban"
              className="text-sm font-medium text-indigo-700 hover:underline"
            >
              Open Kanban
            </a>
          }
        />
        <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
          {sample.activity.map((a) => (
            <div key={a.id} className="flex items-center justify-between p-4">
              <p className="truncate text-sm font-medium text-slate-900">
                {a.text}
              </p>
              <span className="text-xs text-slate-500">{a.time}</span>
            </div>
          ))}
        </div>
      </Panel>

      <div className="mx-auto w-full pt-2 text-center text-xs text-slate-500">
        Prototype mock • Maker mode • UI only
      </div>
    </div>
  );
};

export default MakerDashboard;
