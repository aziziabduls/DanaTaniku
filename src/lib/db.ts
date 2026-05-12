import Dexie, { type EntityTable } from 'dexie';

export type TransactionType = 'capital' | 'income' | 'expense';
export type TransactionCategory = 
  | 'modal_awal' 
  | 'tambah_modal' 
  | 'kopra_purchase' 
  | 'kopra_sale' 
  | 'operational' 
  | 'other';

export interface Transaction {
  id?: number;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  quantity?: number;
  pricePerUnit?: number;
  date: string; // ISO string
  note: string;
}

const db = new Dexie('DanaTaniDB') as Dexie & {
  transactions: EntityTable<Transaction, 'id'>;
};

// Schema declaration
db.version(1).stores({
  transactions: '++id, type, category, date, amount'
});

export { db };
