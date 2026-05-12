import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, TransactionCategory, Transaction } from "../lib/db";
import { formatCurrency } from "../lib/utils";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Trash2, ArrowUpRight, ArrowDownRight, Wallet, Download } from "lucide-react";
import { Card } from "../components/ui/Card";
import { cn } from "../lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useCompany } from "../hooks/useCompany";
import { useMetrics } from "../hooks/useMetrics";

const FILTER_TABS: { id: "all" | TransactionCategory; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "kopra_purchase", label: "Pembelian" },
  { id: "kopra_sale", label: "Penjualan" },
  { id: "operational", label: "Operasional" },
  { id: "bank_deposit", label: "Setor Bank" },
  { id: "profit_sharing", label: "Bagi Hasil" },
  { id: "other", label: "Lainnya" },
  { id: "tambah_modal", label: "Modal" },
];

export default function History() {
  const [activeFilter, setActiveFilter] = useState<"all" | TransactionCategory>("all");
  const [filterDate, setFilterDate] = useState("");
  const { companyName } = useCompany();
  const metrics = useMetrics();

  // set default date to today
  useEffect(() => {
    setFilterDate(format(new Date(), "yyyy-MM-dd"));
  }, []);

  const transactions = useLiveQuery(
    () => {
      let collection = db.transactions.orderBy("date").reverse();

      if (activeFilter !== "all" || filterDate) {
        return collection.filter((tx) => {
          let match = true;
          if (activeFilter !== "all" && tx.category !== activeFilter) match = false;
          if (filterDate && format(new Date(tx.date), "yyyy-MM-dd") !== filterDate) match = false;
          return match;
        }).toArray();
      }

      return collection.toArray();
    },
    [activeFilter, filterDate]
  );

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      await db.transactions.delete(id);
    }
  };

  const handleExportPDF = () => {
    if (!transactions || transactions.length === 0) return;

    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(`Laporan ${companyName || 'DanaTani'}`, 14, 22);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Kategori: ${FILTER_TABS.find(t => t.id === activeFilter)?.label}`, 14, 30);
    if (filterDate) {
      doc.text(`Tanggal Filter: ${format(new Date(filterDate), "dd MMMM yyyy", { locale: idLocale })}`, 14, 36);
    }
    doc.text(`Waktu Cetak: ${format(new Date(), "dd MMMM yyyy, HH:mm", { locale: idLocale })}`, 14, filterDate ? 42 : 36);

    let currentY = filterDate ? 50 : 44;

    if (metrics) {
      doc.setFontSize(10);
      doc.text(`Total Laba / Rugi: ${formatCurrency(metrics.profitLoss)}`, 14, currentY);
      doc.text(`Biaya Aplikasi: ${formatCurrency(metrics.appFee)}`, 14, currentY + 6);
      currentY += 14;
    }

    const tableData = transactions.map((tx) => [
      format(new Date(tx.date), "dd/MM/yyyy HH:mm"),
      tx.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      tx.type === "income" || tx.type === "capital" ? formatCurrency(tx.amount) : "-",
      tx.type === "expense" || tx.type === "allocation" ? formatCurrency(tx.amount) : "-",
      tx.note || "-"
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [["Tanggal", "Kategori", "Pemasukan", "Pengeluaran", "Keterangan"]],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [90, 90, 64] }, // Match olive-700
      styles: { fontSize: 9 },
    });

    doc.save(`Laporan_${companyName ? companyName.replace(/\s+/g, '_') : 'DanaTani'}_${format(new Date(), "dd-MM-yyyy")}.pdf`);
  };

  return (
    <div className="flex flex-col p-4 md:p-8 md:pt-10 max-w-3xl mx-auto pb-10">
      <header className="mb-6 border-b border-warm-border pb-4 flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-olive-700 opacity-70">Laporan</p>
          <h1 className="font-serif text-5xl font-light italic text-brown-900 leading-tight">Riwayat</h1>
        </div>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2 bg-warm-surface border border-warm-border rounded-full hover:bg-olive-50 transition-colors text-brown-900"
          title="Download PDF"
        >
          <Download className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-widest font-bold hidden sm:inline">Export PDF</span>
        </button>
      </header>

      {/* Filters Container */}
      <div className="flex flex-col space-y-4 mb-6">
        {/* Date Filter */}
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-brown-900">Tanggal:</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="rounded-full border border-warm-border bg-warm-surface px-4 py-2 text-sm text-brown-900 focus:outline-none focus:ring-1 focus:ring-brown-900"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate("")}
              className="text-xs text-terracotta-600 hover:text-terracotta-700 font-medium"
            >
              Reset
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 space-x-2 pb-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={cn(
                "px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-medium transition-all whitespace-nowrap border",
                activeFilter === tab.id
                  ? "bg-brown-900 text-warm-bg border-brown-900 shadow-sm"
                  : "bg-warm-surface border-warm-border text-brown-500 hover:text-brown-900 hover:bg-olive-50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-0 overflow-hidden bg-transparent border-none rounded-none md:bg-warm-surface md:border md:border-warm-border">
        {(!transactions || transactions.length === 0) && (
          <div className="text-center py-12 text-brown-500 flex flex-col items-center">
            <HistoryIcon />
            <p className="mt-4">Belum ada transaksi di kategori ini.</p>
          </div>
        )}

        <div className="flex flex-col space-y-3 md:space-y-0 text-sm">
          {transactions?.map((tx) => {
            const isIncome = tx.type === "income";
            const isCapital = tx.type === "capital";

            return (
              <div
                key={tx.id}
                className="group bg-warm-surface border border-warm-border p-4 rounded-2xl md:rounded-none md:border-x-0 md:border-t-0 md:last:border-b-0 flex items-center justify-between transition-colors hover:bg-brown-50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-warm-surface flex items-center justify-center shrink-0">
                    {isIncome ? <ArrowUpRight className="h-5 w-5 text-olive-600" /> :
                      isCapital ? <Wallet className="h-5 w-5 text-brown-500" /> :
                        <ArrowDownRight className="h-5 w-5 text-terracotta-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-brown-900 capitalize">
                      {tx.category.replace('_', ' ')}
                    </p>
                    <div className="flex flex-wrap space-x-2 items-center text-xs text-brown-500 mt-0.5">
                      <span>{format(new Date(tx.date), "dd MMM yyyy", { locale: idLocale })}</span>
                      {tx.note && (
                        <>
                          {/* <span>•</span> */}
                          <span className="truncate max-w-[100px] sm:max-w-[150px]">{tx.note}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`font-mono font-medium ${isIncome || isCapital ? 'text-olive-700' : 'text-terracotta-700'
                      }`}>
                      {isIncome || isCapital ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                    {tx.quantity && tx.pricePerUnit && (
                      <p className="text-xs text-brown-500 mt-0.5 font-mono">
                        {tx.quantity} kg @ {formatCurrency(tx.pricePerUnit)}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(tx.id)}
                    className="p-2 text-brown-300 hover:text-terracotta-600 hover:bg-terracotta-50 rounded-full transition-colors md:opacity-0 group-hover:opacity-100"
                    title="Hapus Transaksi"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

    </div>
  );
}

function HistoryIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-brown-300">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
