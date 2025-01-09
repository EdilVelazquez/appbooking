export type TransactionType = 'income' | 'expense';

export type FinanceCategory = {
  id: string;
  name: string;
  type: TransactionType;
};

export type FinanceRecord = {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  date: Date;
  notes: string;
  reservationId?: string; // Optional reference to a reservation
  createdAt: Date;
  updatedAt: Date;
};
