import React, { useState } from 'react';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { FinanceCategory, TransactionType } from '../../types/finance';
import { Modal } from '../Modal';

export const CategoryManager: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useFinanceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<FinanceCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'income' as TransactionType,
  });

  const handleEdit = (category: FinanceCategory) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (category: FinanceCategory) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría? Esto podría afectar a los registros existentes.')) {
      await deleteCategory(category.id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory) {
      await updateCategory(selectedCategory.id, formData);
    } else {
      await addCategory(formData);
    }
    setIsModalOpen(false);
    setSelectedCategory(null);
    setFormData({ name: '', type: 'income' });
  };

  return (
    <>
      <div className="mb-4">
        <button
          onClick={() => {
            setSelectedCategory(null);
            setFormData({ name: '', type: 'income' });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Nueva Categoría
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map(category => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    category.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {category.type === 'income' ? 'Ingreso' : 'Gasto'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(category)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false);
        setSelectedCategory(null);
        setFormData({ name: '', type: 'income' });
      }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold mb-4">
            {selectedCategory ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

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

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedCategory(null);
                setFormData({ name: '', type: 'income' });
              }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              {selectedCategory ? 'Guardar Cambios' : 'Agregar Categoría'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
