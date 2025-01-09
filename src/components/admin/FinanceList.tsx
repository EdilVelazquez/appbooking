import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PlusCircle, Filter, DollarSign, TrendingUp, TrendingDown, Edit2, Trash2, Settings, RefreshCw } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { FinanceRecord, TransactionType } from '../../types/finance';
import { Modal } from '../Modal';
import { CategoryManager } from './CategoryManager';

export const FinanceList: React.FC = () => {
  const { records, categories, isLoading, error, fetchRecords, fetchCategories, addRecord, updateRecord, deleteRecord } = useFinanceStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FinanceRecord | null>(null);
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    type: 'income' as TransactionType,
    amount: '',
    categoryId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
    reservationId: '',
  });

  useEffect(() => {
    fetchRecords();
    fetchCategories();
  }, []);

  const filteredRecords = records.filter(record => {
    const matchesType = filterType === 'all' || record.type === filterType;
    const matchesCategory = filterCategory === 'all' || record.categoryId === filterCategory;
    const matchesDate = (!dateRange.start || new Date(record.date) >= new Date(dateRange.start)) &&
                       (!dateRange.end || new Date(record.date) <= new Date(dateRange.end));
    return matchesType && matchesCategory && matchesDate;
  });

  const totals = filteredRecords.reduce((acc, record) => {
    if (record.type === 'income') {
      acc.income += record.amount;
    } else {
      acc.expenses += record.amount;
    }
    return acc;
  }, { income: 0, expenses: 0 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const record = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date),
    };

    if (selectedRecord) {
      await updateRecord(selectedRecord.id, record);
    } else {
      await addRecord(record);
    }

    setIsAddModalOpen(false);
    setSelectedRecord(null);
    setFormData({
      type: 'income',
      amount: '',
      categoryId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
      reservationId: '',
    });
  };

  const handleEdit = (record: FinanceRecord) => {
    setSelectedRecord(record);
    setFormData({
      type: record.type,
      amount: record.amount.toString(),
      categoryId: record.categoryId,
      date: format(new Date(record.date), 'yyyy-MM-dd'),
      notes: record.notes,
      reservationId: record.reservationId || '',
    });
    setIsAddModalOpen(true);
  };

  const resetFilters = () => {
    setFilterType('all');
    setFilterCategory('all');
    setDateRange({ start: '', end: '' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Ingresos Totales</p>
              <p className="text-2xl font-bold text-green-700">${totals.income.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Gastos Totales</p>
              <p className="text-2xl font-bold text-red-700">${totals.expenses.toFixed(2)}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Balance</p>
              <p className="text-2xl font-bold text-blue-700">${(totals.income - totals.expenses).toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <select
              className="border rounded px-3 py-2 min-w-[120px]"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as TransactionType | 'all')}
            >
              <option value="all">Todos los tipos</option>
              <option value="income">Ingresos</option>
              <option value="expense">Gastos</option>
            </select>

            <select
              className="border rounded px-3 py-2 min-w-[150px]"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">Todas las categorías</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <input
                type="date"
                className="border rounded px-3 py-2 w-[140px]"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
              <input
                type="date"
                className="border rounded px-3 py-2 w-[140px]"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>

            <button
              onClick={resetFilters}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md flex items-center hover:bg-gray-200 transition-colors whitespace-nowrap"
              title="Restablecer filtros"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Restablecer
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowCategoryManager(true)}
              className="bg-gray-600 text-white px-4 py-2 rounded-md flex items-center whitespace-nowrap"
            >
              <Settings className="w-5 h-5 mr-2" />
              Gestionar Categorías
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center whitespace-nowrap"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Nuevo Registro
            </button>
          </div>
        </div>

        {(filterType !== 'all' || filterCategory !== 'all' || dateRange.start || dateRange.end) && (
          <div className="text-sm text-gray-600 mt-2">
            Filtros activos: {' '}
            {filterType !== 'all' && (
              <span className="mr-2">
                Tipo: {filterType === 'income' ? 'Ingresos' : 'Gastos'}
              </span>
            )}
            {filterCategory !== 'all' && (
              <span className="mr-2">
                Categoría: {categories.find(c => c.id === filterCategory)?.name}
              </span>
            )}
            {dateRange.start && (
              <span className="mr-2">
                Desde: {format(new Date(dateRange.start), 'dd/MM/yyyy')}
              </span>
            )}
            {dateRange.end && (
              <span>
                Hasta: {format(new Date(dateRange.end), 'dd/MM/yyyy')}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notas</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRecords.map(record => {
              const category = categories.find(c => c.id === record.categoryId);
              return (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(record.date), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      record.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {record.type === 'income' ? 'Ingreso' : 'Gasto'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{category?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={record.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                      ${record.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">{record.notes}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(record)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('¿Estás seguro de que deseas eliminar este registro?')) {
                          deleteRecord(record.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedRecord(null);
          setFormData({
            type: 'income',
            amount: '',
            categoryId: '',
            date: format(new Date(), 'yyyy-MM-dd'),
            notes: '',
            reservationId: '',
          });
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold mb-4">
            {selectedRecord ? 'Editar Registro' : 'Nuevo Registro'}
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <select
              className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType })}
              required
            >
              <option value="income">Ingreso</option>
              <option value="expense">Gasto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <select
              className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories
                .filter(category => category.type === formData.type)
                .map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))
              }
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Monto</label>
            <input
              type="number"
              step="0.01"
              className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha</label>
            <input
              type="date"
              className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notas</label>
            <textarea
              className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Folio de Reservación (Opcional)</label>
            <input
              type="text"
              className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
              value={formData.reservationId}
              onChange={(e) => setFormData({ ...formData, reservationId: e.target.value })}
              placeholder="Ej: RES-001"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setSelectedRecord(null);
              }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              {selectedRecord ? 'Guardar Cambios' : 'Agregar Registro'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Category Manager Modal */}
      <Modal
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Gestionar Categorías</h2>
            <button
              onClick={() => setShowCategoryManager(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <CategoryManager />
        </div>
      </Modal>
    </div>
  );
};
