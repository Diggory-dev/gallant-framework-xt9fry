import React, { useMemo, useState } from "react";
import { Badge } from "../components/ui";
import { Filter, Search, Plus, MoreHorizontal } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* ================== Types ================== */
type StageId = "new" | "quotes" | "proof" | "inprod" | "ready" | "done";

type KanbanItem = {
  id: string;
  title: string;
  buyer: string;
  eta?: string;
  amount?: string;
  tags?: Array<{
    tone: "warning" | "success" | "neutral" | "info";
    label: string;
  }>;
};

type Stage = { id: StageId; label: string };

/* ================== Data (mock) ================== */
const STAGES: Stage[] = [
  { id: "new", label: "New" },
  { id: "quotes", label: "Quotes" },
  { id: "proof", label: "Proof" },
  { id: "inprod", label: "In production" },
  { id: "ready", label: "Ready/Pickup" },
  { id: "done", label: "Completed" },
];

const INITIAL: Record<StageId, KanbanItem[]> = {
  new: [
    {
      id: "ORD-1052",
      title: "DTF on 20 tees",
      buyer: "Local Print Co.",
      tags: [{ tone: "neutral", label: "New" }],
    },
  ],
  quotes: [
    {
      id: "REQ-318",
      title: "Embroidery on 12 polos",
      buyer: "Green Gym",
      tags: [{ tone: "warning", label: "Quote due" }],
    },
  ],
  proof: [
    {
      id: "ORD-1042",
      title: "Custom Hoodie",
      buyer: "HSD Crafts",
      eta: "Tomorrow",
      tags: [{ tone: "success", label: "Approve proof" }],
    },
  ],
  inprod: [
    {
      id: "ORD-1039",
      title: "Laser Engraved Card",
      buyer: "TeeDee",
      eta: "2 days",
      tags: [{ tone: "neutral", label: "In production" }],
    },
  ],
  ready: [
    {
      id: "ORD-1037",
      title: "DTF on 20 tees",
      buyer: "Local Print Co.",
      eta: "Fri",
      tags: [{ tone: "info", label: "Pickup" }],
    },
  ],
  done: [
    {
      id: "ORD-1001",
      title: "Engraved Bottle",
      buyer: "Atlas Events",
      amount: "$84.00",
      tags: [{ tone: "success", label: "Paid" }],
    },
  ],
};

/* ================== Helpers ================== */
const cn = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");
const chip =
  "inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700";

/* Map itemId -> stageId (for quick lookups) */
function buildIndexMap(columns: Record<StageId, KanbanItem[]>) {
  const idx = new Map<string, { stage: StageId; index: number }>();
  (Object.keys(columns) as StageId[]).forEach((stage) => {
    columns[stage].forEach((it, i) => idx.set(it.id, { stage, index: i }));
  });
  return idx;
}

/* ================== Page ================== */
const OrdersKanban: React.FC = () => {
  const [query, setQuery] = useState("");
  const [columns, setColumns] =
    useState<Record<StageId, KanbanItem[]>>(INITIAL);

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  // Drag overlay state
  const [activeId, setActiveId] = useState<string | null>(null);
  const indexMap = useMemo(() => buildIndexMap(columns), [columns]);
  const activeItem = activeId ? findItem(columns, activeId) : null;

  const filtered = useMemo(() => {
    if (!query.trim()) return columns;
    const q = query.toLowerCase();
    const next: Record<StageId, KanbanItem[]> = {
      new: [],
      quotes: [],
      proof: [],
      inprod: [],
      ready: [],
      done: [],
    };
    (Object.keys(columns) as StageId[]).forEach((k) => {
      next[k] = columns[k].filter((i) =>
        (i.title + i.id + i.buyer).toLowerCase().includes(q)
      );
    });
    return next;
  }, [columns, query]);

  function onDragStart(e: DragStartEvent) {
    const id = String(e.active.id);
    setActiveId(id);
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;

    const activeKey = String(active.id);
    const overId = String(over.id);

    // If dropped over a column header (we use stage id as droppable id) -> move to end of that column
    if (isStageId(overId)) {
      moveBetweenLists(
        activeKey,
        indexMap.get(activeKey)!,
        overId,
        columns,
        setColumns
      );
      return;
    }

    // Otherwise, it's over another card
    const from = indexMap.get(activeKey);
    const to = indexMap.get(overId);
    if (!from || !to) return;

    if (from.stage === to.stage) {
      // Reorder within same column
      setColumns((prev) => ({
        ...prev,
        [from.stage]: arrayMove(prev[from.stage], from.index, to.index),
      }));
    } else {
      // Move across columns at target position
      setColumns((prev) => {
        const src = [...prev[from.stage]];
        const [moved] = src.splice(from.index, 1);
        const dst = [...prev[to.stage]];
        dst.splice(to.index, 0, moved);
        return { ...prev, [from.stage]: src, [to.stage]: dst };
      });
    }
  }

  return (
    <div className="transition-opacity duration-200">
      {/* Header (airier spacing) */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Orders · Kanban
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Drag cards to update stage. Click a card to open details.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search orders…"
              className="w-72 rounded-full border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300">
            <Filter className="h-4 w-4 text-slate-500" />
            Filters
          </button>
          <a
            href="/requests/new"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
          >
            <Plus className="h-4 w-4" />
            New order
          </a>
        </div>
      </div>

      {/* Board: horizontally scrollable, wide gutters, airy columns */}
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-2">
          {STAGES.map((stage) => {
            const items = filtered[stage.id];
            return (
              <Column
                key={stage.id}
                id={stage.id}
                title={stage.label}
                count={items.length}
              >
                <SortableContext
                  items={items.map((i) => i.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex min-h-[320px] flex-col gap-3">
                    {items.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-6 text-center text-sm text-slate-600">
                        No items
                      </div>
                    ) : (
                      items.map((it) => <CardDraggable key={it.id} item={it} />)
                    )}
                  </div>
                </SortableContext>
              </Column>
            );
          })}
        </div>

        {/* Drag overlay (floating preview) */}
        <DragOverlay>
          {activeItem ? <CardGhost item={activeItem} /> : null}
        </DragOverlay>
      </DndContext>

      <div className="mx-auto w-full pt-4 text-center text-xs text-slate-500">
        Prototype board • Maker mode
      </div>
    </div>
  );
};

export default OrdersKanban;

/* =============== Column =============== */
function Column({
  id,
  title,
  count,
  children,
}: {
  id: StageId;
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  // Make the whole column droppable by giving it the stage id as droppable target
  return (
    <div
      id={id}
      className="w-[320px] shrink-0 rounded-2xl border border-slate-200 bg-white p-4"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700">
            {count}
          </span>
        </div>
        <button
          className="rounded-full p-1 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
          aria-label={`Lane actions for ${title}`}
        >
          <MoreHorizontal className="h-4 w-4 text-slate-500" />
        </button>
      </div>
      {children}
    </div>
  );
}

/* =============== Sortable Card =============== */
function CardDraggable({ item }: { item: KanbanItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : 1,
    boxShadow: isDragging ? "0 8px 24px rgba(15, 23, 42, 0.12)" : undefined,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm outline-none transition hover:bg-slate-50 hover:shadow"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") window.location.href = `/orders/${item.id}`;
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-900">
            {item.title}
          </h3>
          <p className="truncate text-[11px] text-slate-600">
            {item.id} • {item.buyer}
          </p>
        </div>
        {item.amount && (
          <span className="shrink-0 text-sm font-semibold text-slate-900">
            {item.amount}
          </span>
        )}
      </div>

      {(item.eta || item.tags?.length) && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {item.eta && <span className={chip}>ETA {item.eta}</span>}
          {item.tags?.map((t, i) => (
            <Badge key={i} tone={t.tone}>
              {t.label}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <a
          href={`/orders/${item.id}`}
          className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
        >
          Open
        </a>
        <a
          href={`/messages/new?order=${item.id}`}
          className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
        >
          Message
        </a>
      </div>
    </article>
  );
}

/* =============== Drag Overlay Card (ghost) =============== */
function CardGhost({ item }: { item: KanbanItem }) {
  return (
    <div className="w-[320px]">
      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {item.title}
            </h3>
            <p className="truncate text-[11px] text-slate-600">
              {item.id} • {item.buyer}
            </p>
          </div>
          {item.amount && (
            <span className="shrink-0 text-sm font-semibold text-slate-900">
              {item.amount}
            </span>
          )}
        </div>
        {(item.eta || item.tags?.length) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {item.eta && <span className={chip}>ETA {item.eta}</span>}
            {item.tags?.map((t, i) => (
              <Badge key={i} tone={t.tone}>
                {t.label}
              </Badge>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}

/* =============== Utils =============== */
function isStageId(v: string): v is StageId {
  return ["new", "quotes", "proof", "inprod", "ready", "done"].includes(v);
}

function findItem(columns: Record<StageId, KanbanItem[]>, id: string) {
  for (const k of Object.keys(columns) as StageId[]) {
    const f = columns[k].find((i) => i.id === id);
    if (f) return f;
  }
  return null;
}

function moveBetweenLists(
  itemId: string,
  from: { stage: StageId; index: number },
  toStage: StageId,
  state: Record<StageId, KanbanItem[]>,
  setState: React.Dispatch<React.SetStateAction<Record<StageId, KanbanItem[]>>>
) {
  const fromList = state[from.stage];
  const [moved] = fromList.slice(from.index, from.index + 1);
  if (!moved) return;

  setState((prev) => {
    const src = [...prev[from.stage]];
    src.splice(from.index, 1);
    const dst = [...prev[toStage], moved];
    return { ...prev, [from.stage]: src, [toStage]: dst };
  });
}
