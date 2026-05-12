import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { db, TransactionType, TransactionCategory } from "../lib/db";
import { cn, parseNumberInput } from "../lib/utils";

const TABS: { id: TransactionCategory; label: string; type: TransactionType }[] = [
  { id: "kopra_sale", label: "Penjualan", type: "income" },
  { id: "kopra_purchase", label: "Pembelian", type: "expense" },
  { id: "operational", label: "Operasional", type: "expense" },
  { id: "bank_deposit", label: "Setor Bank", type: "allocation" },
  { id: "profit_sharing", label: "Bagi Hasil", type: "allocation" },
  { id: "other", label: "Lainnya", type: "expense" },
  { id: "tambah_modal", label: "Modal", type: "capital" },
];

export default function AddTransaction() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TransactionCategory>("kopra_purchase");
  
  const [amountStr, setAmountStr] = useState("");
  const [quantityStr, setQuantityStr] = useState("");
  const [priceStr, setPriceStr] = useState("");
  const [note, setNote] = useState("");
  const [dateStr, setDateStr] = useState(() => new Date().toISOString().split('T')[0]);

  const selectedTab = TABS.find((t) => t.id === activeTab)!;

  const isKopra = activeTab === "kopra_purchase" || activeTab === "kopra_sale";

  // Auto calculate total if quantity and price are filled
  const handleQuantityChange = (val: string) => {
    setQuantityStr(val);
    const q = parseNumberInput(val) || 0;
    const p = parseNumberInput(priceStr) || 0;
    if (p > 0) setAmountStr(new Intl.NumberFormat('id-ID').format(q * p));
  };

  const handlePriceChange = (val: string) => {
    setPriceStr(val);
    const q = parseNumberInput(quantityStr) || 0;
    const p = parseNumberInput(val) || 0;
    if (q > 0) setAmountStr(new Intl.NumberFormat('id-ID').format(q * p));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseNumberInput(amountStr);
    if (!amount || amount <= 0) return alert("Peringatan: Nominal tidak valid");

    try {
      await db.transactions.add({
        type: selectedTab.type,
        category: activeTab,
        amount,
        quantity: isKopra ? parseNumberInput(quantityStr) : undefined,
        pricePerUnit: isKopra ? parseNumberInput(priceStr) : undefined,
        date: new Date(dateStr + "T00:00:00").toISOString(),
        note: note || "",
      });
      // reset form
      setAmountStr("");
      setQuantityStr("");
      setPriceStr("");
      setNote("");
      navigate("/history");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan");
    }
  };

  return (
    <div className="flex flex-col p-4 md:p-8 md:pt-10 max-w-3xl mx-auto pb-10">
      <header className="mb-6 border-b border-warm-border pb-4 flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-olive-700 opacity-70">Aksi Cepat</p>
          <h1 className="font-serif text-5xl font-light italic text-brown-900 leading-tight">Catat</h1>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-warm-surface border border-warm-border p-1.5 rounded-full flex overflow-x-auto hide-scrollbar mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-5 py-2.5 rounded-full text-[10px] uppercase tracking-[0.1em] font-medium transition-all whitespace-nowrap flex-1",
              activeTab === tab.id
                ? "bg-brown-900 text-warm-bg shadow-sm"
                : "text-brown-500 hover:text-brown-900 hover:bg-olive-50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          {isKopra && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-brown-900 px-1">Jumlah (Kg)</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="Contoh: 1500"
                  value={quantityStr}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className="font-mono text-lg"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-brown-900 px-1">Harga / Kg</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="Contoh: 7500"
                  value={priceStr}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className="font-mono text-lg"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-brown-900 px-1">
              {isKopra ? "Total (Rp)" : "Nominal (Rp)"}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-500 font-medium">Rp</span>
              <Input
                type="text"
                inputMode="numeric"
                required
                value={amountStr}
                onChange={(e) => {
                  const val = e.target.value;
                  // Allow manual override if needed
                  setAmountStr(new Intl.NumberFormat('id-ID').format(parseNumberInput(val) || 0));
                }}
                className="font-mono text-xl pl-12 h-14"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-brown-900 px-1">Tanggal</label>
            <Input
              type="date"
              required
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-brown-900 px-1">Keterangan (Opsional)</label>
            <Input
              type="text"
              placeholder="Catatan tambahan..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full h-14 text-base">
              Simpan Transaksi
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
