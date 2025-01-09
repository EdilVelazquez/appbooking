import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoomList } from './admin/RoomList';
import { AdminCalendar } from './AdminCalendar';
import { ReservationList } from './admin/ReservationList';
import { FinanceList } from './admin/FinanceList';
import { LogOut, Calendar, List, BedDouble, DollarSign } from 'lucide-react';

type Tab = 'calendar' | 'list' | 'rooms' | 'finance';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('rooms');
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </button>
          </div>
          <div className="flex space-x-4 pb-4">
            <button
              onClick={() => setActiveTab('rooms')}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                activeTab === 'rooms'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BedDouble className="w-5 h-5 mr-2" />
              Habitaciones
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                activeTab === 'calendar'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Calendario
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                activeTab === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-5 h-5 mr-2" />
              Reservaciones
            </button>
            <button
              onClick={() => setActiveTab('finance')}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                activeTab === 'finance'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <DollarSign className="w-5 h-5 mr-2" />
              Finanzas
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'rooms' && <RoomList />}
        {activeTab === 'calendar' && <AdminCalendar />}
        {activeTab === 'list' && <ReservationList />}
        {activeTab === 'finance' && <FinanceList />}
      </main>
    </div>
  );
};