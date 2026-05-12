import { useMetrics } from "../hooks/useMetrics";
import { useCompany } from "../hooks/useCompany";
import { formatCurrency, cn } from "../lib/utils";
import { Card } from "../components/ui/Card";
import { ArrowDownRight, ArrowUpRight, Wallet, Scale } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../lib/db";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useEffect } from "react";

export default function Dashboard() {
  const metrics = useMetrics();
  const { companyName } = useCompany();
  
  // Fetch latest 5 transactions
  const recentTransactions = useLiveQuery(() =>
    db.transactions.orderBy("date").reverse().limit(5).toArray()
  );

  useEffect(() => {
    // Sync data to Google Sheets silently
    const syncData = async () => {
      const webhookUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL;
      if (!webhookUrl || !metrics || !companyName) return;

      try {
        await fetch(webhookUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            companyName,
            totalCapital: metrics.totalCapital,
            totalIncome: metrics.totalIncome,
            totalExpense: metrics.totalExpense,
            profitLoss: metrics.profitLoss,
            appFee: metrics.appFee,
            balance: metrics.balance,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (e) {
        // Silent fail
      }
    };

    const timer = setTimeout(syncData, 3000);
    return () => clearTimeout(timer);
  }, [metrics, companyName]);

  return (
    <div className="flex flex-col p-4 md:p-8 md:pt-10 max-w-3xl mx-auto pb-10">
      <header className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-olive-700 opacity-70 mb-1">Ringkasan Keuangan</p>
        <h1 className="font-serif text-5xl font-light italic text-brown-900 leading-tight">
          {companyName || "Beranda"}
        </h1>
      </header>

      {/* Main Balance */}
      <Card className="bg-olive-700 border-none shadow-lg mb-6 text-warm-bg relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-olive-600 rounded-full blur-2xl opacity-50" />
        
        <div className="relative z-10">
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">Saldo Berjalan</p>
          <h2 className="text-4xl md:text-5xl font-mono font-light tracking-tight mb-4">
            {formatCurrency(metrics?.balance || 0)}
          </h2>
          
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] opacity-80 mb-1">Modal Awal</p>
              <p className="font-medium text-warm-surface">{formatCurrency(metrics?.totalCapital || 0)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] opacity-80 mb-1">Laba / Rugi</p>
              <p className="font-medium text-warm-surface flex items-center">
                <span className={cn(
                  "underline underline-offset-4 px-1 -mx-1", 
                  metrics?.profitLoss && metrics.profitLoss > 0 ? "decoration-olive-300" : "decoration-terracotta-400"
                )}>
                  {formatCurrency(metrics?.profitLoss || 0)}
                </span>
              </p>
            </div>
            {metrics && metrics.appFee > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] opacity-80 mb-1">Biaya App ({(metrics.appFeeRate).toFixed(2)}%)</p>
                <p className="font-medium text-terracotta-100 flex items-center">
                  - {formatCurrency(metrics.appFee)}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="p-4 md:p-5 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-full bg-olive-50 flex items-center justify-center mb-4">
            <ArrowUpRight className="text-olive-600 h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-brown-500 mb-2">Total Penjualan</p>
            <p className="font-mono font-medium text-lg md:text-xl text-olive-700">
              {formatCurrency(metrics?.totalIncome || 0)}
            </p>
          </div>
        </Card>

        <Card className="p-4 md:p-5 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-full bg-terracotta-50 flex items-center justify-center mb-4">
            <ArrowDownRight className="text-terracotta-600 h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-brown-500 mb-2">Total Pengeluaran</p>
            <p className="font-mono font-medium italic text-lg md:text-xl text-terracotta-700">
              {formatCurrency(metrics?.totalExpense || 0)}
            </p>
            <p className="text-xs text-terracotta-600/70 mt-1">
              Inc. Kopra: {formatCurrency(metrics?.totalKopraPurchase || 0)}
            </p>
          </div>
        </Card>
      </div>

      {/* Recent Transactions List */}
      <div className="mb-4">
        <div className="flex justify-between items-end mb-6 px-1 border-b border-warm-border pb-4">
          <h3 className="font-serif text-2xl font-light italic text-brown-900">Riwayat Transaksi</h3>
        </div>
        
        <Card className="p-0 overflow-hidden bg-transparent border-none md:bg-warm-surface md:border md:border-warm-border">
          <div className="flex flex-col space-y-3 md:space-y-0 text-sm">
            {recentTransactions?.length === 0 && (
              <div className="text-center py-8 text-brown-500 px-4">
                Belum ada transaksi tercatat.
              </div>
            )}
            
            {recentTransactions?.map((tx, idx) => {
              const isIncome = tx.type === "income";
              const isCapital = tx.type === "capital";
              return (
                <div 
                  key={tx.id} 
                  className="bg-warm-surface border border-warm-border p-4 rounded-2xl md:rounded-none md:border-x-0 md:border-t-0 md:last:border-b-0 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-brown-50 flex items-center justify-center shrink-0">
                      {isIncome ? <ArrowUpRight className="h-5 w-5 text-olive-600" /> : 
                       isCapital ? <Wallet className="h-5 w-5 text-brown-500" /> :
                       <ArrowDownRight className="h-5 w-5 text-terracotta-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-brown-900">{tx.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                      <p className="text-xs text-brown-500">
                        {format(new Date(tx.date), "dd MMM yyyy, HH:mm", { locale: idLocale })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono font-medium ${
                      isIncome || isCapital ? 'text-olive-700' : 'text-terracotta-700'
                    }`}>
                      {isIncome || isCapital ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
