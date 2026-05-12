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
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col p-6 md:p-10 max-w-4xl mx-auto pb-20"
    >
      <motion.header variants={itemVariants} className="mb-10 flex flex-col items-center text-center">
        <p className="text-xs uppercase tracking-[0.3em] font-bold text-olive-600 opacity-80 mb-3">Ringkasan Keuangan</p>
        <h1 className="font-serif text-5xl md:text-6xl text-brown-900 leading-tight">
          {companyName || "Beranda"}
        </h1>
        <div className="w-16 h-1 bg-terracotta-500 mt-6 rounded-full" />
      </motion.header>

      {/* Main Balance */}
      <motion.div variants={itemVariants}>
        <Card className="bg-olive-800 border-none shadow-2xl shadow-olive-900/20 mb-8 text-warm-bg relative overflow-hidden rounded-[2.5rem] p-8 md:p-12">
          {/* Decorative background elements */}
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-olive-600 rounded-full mix-blend-screen filter blur-3xl opacity-40 pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-terracotta-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-medium text-olive-100 mb-3">Saldo Berjalan</p>
              <h2 className="text-5xl md:text-7xl font-sans font-light tracking-tight">
                {formatCurrency(metrics?.balance || 0)}
              </h2>
            </div>

            <div className="flex flex-col gap-4 text-sm bg-white/5 backdrop-blur-md rounded-3xl p-5 border border-white/10 w-full md:w-auto">
              <div className="flex justify-between gap-8">
                <p className="text-[10px] uppercase tracking-[0.15em] text-olive-100/80">Modal Awal</p>
                <p className="font-semibold font-mono text-warm-surface">{formatCurrency(metrics?.totalCapital || 0)}</p>
              </div>
              <div className="flex justify-between gap-8 border-t border-white/10 pt-4">
                <p className="text-[10px] uppercase tracking-[0.15em] text-olive-100/80">Laba / Rugi</p>
                <p className={cn(
                  "font-semibold font-mono",
                  metrics?.profitLoss && metrics.profitLoss > 0 ? "text-olive-300" : "text-terracotta-400"
                )}>
                  {metrics?.profitLoss && metrics.profitLoss > 0 ? "+" : ""}{formatCurrency(metrics?.profitLoss || 0)}
                </p>
              </div>
              {metrics && metrics.appFee > 0 && (
                <div className="flex justify-between gap-8 border-t border-white/10 pt-4">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-olive-100/80">App Service Fee</p>
                  <p className="font-semibold font-mono text-terracotta-300">
                    {formatCurrency(metrics.appFee)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <motion.div variants={itemVariants}>
          <Card className="p-6 md:p-8 flex items-start gap-6 bg-warm-surface border-2 border-olive-50 hover:border-olive-100 transition-colors rounded-4xl shadow-sm">
            <div className="w-14 h-14 rounded-full bg-olive-50 flex items-center justify-center shrink-0">
              <ArrowUpRight className="text-olive-600 h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-brown-500 mb-2">Total Penjualan</p>
              <p className="font-sans font-medium text-3xl text-olive-800">
                {formatCurrency(metrics?.totalIncome || 0)}
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-6 md:p-8 flex items-start gap-6 bg-warm-surface border-2 border-terracotta-50 hover:border-terracotta-100 transition-colors rounded-4xl shadow-sm">
            <div className="w-14 h-14 rounded-full bg-terracotta-50 flex items-center justify-center shrink-0">
              <ArrowDownRight className="text-terracotta-600 h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-brown-500 mb-2">Total Pengeluaran</p>
              <p className="font-sans font-medium text-3xl text-terracotta-700 mb-1">
                {formatCurrency(metrics?.totalExpense || 0)}
              </p>
              <p className="text-xs font-semibold tracking-wider text-terracotta-600/60 uppercase">
                Kopra: {formatCurrency(metrics?.totalKopraPurchase || 0)}
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Recent Transactions List */}
      <motion.div variants={itemVariants} className="mb-4">
        <div className="flex justify-between items-end mb-8 px-2 border-b border-warm-border pb-6">
          <h3 className="font-serif text-3xl text-brown-900">Riwayat Terakhir</h3>
        </div>

        <div className="flex flex-col space-y-4">
          {recentTransactions?.length === 0 && (
            <div className="text-center py-12 text-brown-500 font-medium bg-warm-surface rounded-4xl border-2 border-dashed border-warm-border">
              Belum ada transaksi tercatat.
            </div>
          )}

          {recentTransactions?.map((tx) => {
            const isIncome = tx.type === "income";
            const isCapital = tx.type === "capital";
            return (
              <motion.div
                key={tx.id}
                whileHover={{ scale: 1.01, x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="bg-warm-surface border border-warm-border p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md hover:border-olive-200 cursor-default"
              >
                <div className="flex items-center space-x-4">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                    isIncome ? "bg-olive-50" : isCapital ? "bg-brown-50" : "bg-terracotta-50"
                  )}>
                    {isIncome ? <ArrowUpRight className="h-6 w-6 text-olive-600" /> :
                      isCapital ? <Wallet className="h-6 w-6 text-brown-500" /> :
                        <ArrowDownRight className="h-6 w-6 text-terracotta-600" />}
                  </div>
                  <div>
                    <p className="font-semibold text-md text-brown-900">{tx.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    <p className="text-xs font-light tracking-wider text-brown-500 mt-1">
                      {format(new Date(tx.date), "dd MMM yyyy", { locale: idLocale })}
                    </p>
                    <p className="text-xs font-light tracking-wider text-brown-500 mt-1">
                      {/* note */}
                      {tx.note}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "font-sans font-medium text-md",
                    isIncome || isCapital ? 'text-olive-700' : 'text-terracotta-700'
                  )}>
                    {isIncome || isCapital ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
