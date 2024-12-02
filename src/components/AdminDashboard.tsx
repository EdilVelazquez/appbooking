import React, { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { LogOut, Calendar as CalendarIcon, List, XCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useReservationStore } from '../store/useReservationStore';
import { AdminCalendar } from './AdminCalendar';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { reservations, rooms, cancelReservation } = useReservationStore();
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCancelReservation = async (id: number) => {
    try {
      await cancelReservation(id);
      alert('Reservation cancelled successfully');
    } catch (error) {
      alert('Failed to cancel reservation');
    }
  };

  const sortedReservations = [...reservations].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Reservation Management</h1>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`flex items-center px-3 py-1 rounded ${
                view === 'list'
                  ? 'bg-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4 mr-1" />
              List
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`flex items-center px-3 py-1 rounded ${
                view === 'calendar'
                  ? 'bg-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CalendarIcon className="w-4 h-4 mr-1" />
              Calendar
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedReservations.map((reservation) => {
                  const room = rooms.find((r) => r.id === reservation.roomId);
                  return (
                    <tr key={reservation.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.guestName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{room?.name}</div>
                        <div className="text-sm text-gray-500">
                          {reservation.numberOfGuests} guests
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(new Date(reservation.checkIn), 'MMM d, yyyy')} -
                          {format(new Date(reservation.checkOut), 'MMM d, yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            reservation.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : reservation.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {reservation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {reservation.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelReservation(reservation.id)}
                            className="flex items-center text-red-600 hover:text-red-900"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <AdminCalendar />
      )}
    </div>
  );
};