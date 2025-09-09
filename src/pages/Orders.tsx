import React from "react";
import { useSearchParams } from "react-router-dom";
import OrdersKanban from "./OrdersKanban";

/**
 * Orders page router
 * - When ?view=kanban, render maker Kanban board (scaffold)
 * - Otherwise, show your existing list/table placeholder
 */

const Orders: React.FC = () => {
  const [params] = useSearchParams();
  const view = params.get("view");

  if (view === "kanban") {
    return <OrdersKanban />;
  }

  // Fallback: your current orders view (replace with your real list/table)
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900">
        Orders
      </h1>
      <p className="mb-4 text-sm text-slate-600">
        List view coming soon. Switch to{" "}
        <a
          href="/orders?view=kanban"
          className="font-medium text-indigo-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 rounded-sm"
        >
          Kanban
        </a>
        .
      </p>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center text-sm text-slate-600">
        Table/list placeholder
      </div>
    </div>
  );
};

export default Orders;
