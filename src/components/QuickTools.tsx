import React from "react";
import { Plus, FileEdit, QrCode, Package } from "lucide-react";

const QuickTools: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <a
        href="/orders/new-quote"
        className="flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
      >
        <Plus className="h-4 w-4 text-slate-500" />
        Create Quote
      </a>

      <a
        href="/proofs/start"
        className="flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
      >
        <FileEdit className="h-4 w-4 text-slate-500" />
        Start Proof
      </a>

      <a
        href="/qr/scan-buyer"
        className="flex h-10 items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
      >
        <QrCode className="h-4 w-4" />
        Scan Buyer QR
      </a>

      <a
        href="/products/new"
        className="flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
      >
        <Package className="h-4 w-4 text-slate-500" />
        Add Product
      </a>
    </div>
  );
};

export default QuickTools;
