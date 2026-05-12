import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../lib/db";

export function useMetrics() {
  const transactions = useLiveQuery(() => db.transactions.toArray());

  if (!transactions) return null;

  let totalCapital = 0;
  let totalIncome = 0;
  let totalExpense = 0;
  let totalKopraPurchase = 0;

  transactions.forEach((t) => {
    if (t.type === "capital") {
      totalCapital += t.amount;
    } else if (t.type === "income") {
      totalIncome += t.amount;
    } else if (t.type === "expense") {
      totalExpense += t.amount;
      if (t.category === "kopra_purchase") {
        totalKopraPurchase += t.amount;
      }
    }
  });

  const profitLoss = totalIncome - totalExpense;
  const balance = totalCapital + profitLoss;

  return {
    totalCapital,
    totalIncome,
    totalExpense,
    totalKopraPurchase,
    profitLoss,
    balance,
  };
}
