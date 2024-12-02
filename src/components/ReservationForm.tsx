import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useReservationStore } from '../store/useReservationStore';

interface ReservationFormProps {
  roomId: number;
  checkIn: Date;
  checkOut: Date;
  onBack: () => void;
}

interface FormData {
  guestName: string;
  email: string;
  phone: string;
  numberOfGuests: number;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({
  roomId,
  checkIn,
  checkOut,
  onBack,
}) => {
  const navigate = useNavigate();
  const { addReservation, isRoomAvailable } = useReservationStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    // Double-check availability before submitting
    if (!isRoomAvailable(roomId, checkIn, checkOut)) {
      alert('Sorry, this room is no longer available for the selected dates.');
      return;
    }

    try {
      await addReservation({
        id: Date.now(),
        roomId,
        checkIn,
        checkOut,
        ...data,
        status: 'confirmed',
        createdAt: new Date(),
      });
      alert('Reservation submitted successfully!');
      navigate('/');
    } catch (error) {
      alert('Failed to submit reservation. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Calendar
      </button>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            {...register('guestName', { required: 'Name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.guestName && (
            <p className="mt-1 text-sm text-red-600">{errors.guestName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            {...register('phone', { required: 'Phone number is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Number of Guests
          </label>
          <input
            type="number"
            min="1"
            {...register('numberOfGuests', {
              required: 'Number of guests is required',
              min: { value: 1, message: 'At least 1 guest is required' },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.numberOfGuests && (
            <p className="mt-1 text-sm text-red-600">{errors.numberOfGuests.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Complete Reservation
        </button>
      </form>
    </motion.div>
  );
};