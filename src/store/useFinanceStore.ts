import { create } from 'zustand';
import { collection, addDoc, getDocs, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FinanceRecord, FinanceCategory } from '../types/finance';

interface FinanceStore {
  records: FinanceRecord[];
  categories: FinanceCategory[];
  isLoading: boolean;
  error: string | null;
  fetchRecords: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addRecord: (record: Omit<FinanceRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  addCategory: (category: Omit<FinanceCategory, 'id'>) => Promise<void>;
  updateRecord: (id: string, record: Partial<FinanceRecord>) => Promise<void>;
  updateCategory: (id: string, category: Partial<FinanceCategory>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  records: [],
  categories: [],
  isLoading: false,
  error: null,

  fetchRecords: async () => {
    set({ isLoading: true, error: null });
    try {
      const q = query(collection(db, 'finance_records'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const records = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as FinanceRecord[];
      set({ records, isLoading: false });
    } catch (error) {
      set({ error: 'Error al cargar los registros financieros', isLoading: false });
      console.error('Error fetching records:', error);
    }
  },

  fetchCategories: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'finance_categories'));
      const categories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as FinanceCategory[];
      set({ categories });
    } catch (error) {
      console.error('Error fetching categories:', error);
      set({ error: 'Error al cargar las categorías' });
    }
  },

  addRecord: async (record) => {
    try {
      const now = new Date();
      await addDoc(collection(db, 'finance_records'), {
        ...record,
        createdAt: now,
        updatedAt: now,
      });
      get().fetchRecords();
    } catch (error) {
      console.error('Error adding record:', error);
      set({ error: 'Error al agregar el registro' });
    }
  },

  addCategory: async (category) => {
    try {
      await addDoc(collection(db, 'finance_categories'), category);
      get().fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      set({ error: 'Error al agregar la categoría' });
    }
  },

  updateRecord: async (id, record) => {
    try {
      const recordRef = doc(db, 'finance_records', id);
      await updateDoc(recordRef, {
        ...record,
        updatedAt: new Date(),
      });
      get().fetchRecords();
    } catch (error) {
      console.error('Error updating record:', error);
      set({ error: 'Error al actualizar el registro' });
    }
  },

  updateCategory: async (id, category) => {
    try {
      const categoryRef = doc(db, 'finance_categories', id);
      await updateDoc(categoryRef, category);
      get().fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      set({ error: 'Error al actualizar la categoría' });
    }
  },

  deleteRecord: async (id) => {
    try {
      await deleteDoc(doc(db, 'finance_records', id));
      get().fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      set({ error: 'Error al eliminar el registro' });
    }
  },

  deleteCategory: async (id) => {
    try {
      await deleteDoc(doc(db, 'finance_categories', id));
      get().fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      set({ error: 'Error al eliminar la categoría' });
    }
  },
}));
