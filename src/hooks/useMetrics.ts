import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../lib/db";

export function useMetrics() {
  const transactions = useLiveQuery(() => db.transactions.toArray());

  if (!transactions) return null;

  let totalCapital = 0;
  let totalIncome = 0;
  let totalExpense = 0;
  let totalKopraPurchase = 0;
  let totalAllocation = 0;

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
    } else if (t.type === "allocation") {
      totalAllocation += t.amount;
    }
  });

  const profitLoss = totalIncome - totalExpense;

  const appFeeRate = 0.8;
  let appFee = 0;
  if (profitLoss > 0) {
    appFee = profitLoss * (appFeeRate / 100);
  }

  const balance = totalCapital + profitLoss - totalAllocation - appFee;

  return {
    totalCapital,
    totalIncome,
    totalExpense,
    totalKopraPurchase,
    totalAllocation,
    profitLoss,
    appFee,
    appFeeRate,
    balance,
  };
}
