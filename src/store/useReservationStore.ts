import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Room, Booking } from '../types/room';
import { rooms } from '../data/rooms';
import * as db from '../utils/db';

interface ReservationStore {
  rooms: Room[];
  reservations: Booking[];
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  addReservation: (reservation: Omit<Booking, 'id'>) => Promise<void>;
  cancelReservation: (id: number) => Promise<void>;
  isRoomAvailable: (roomId: number, checkIn: Date, checkOut: Date, excludeReservationId?: number) => boolean;
  getAvailableRooms: (checkIn: Date, checkOut: Date) => Room[];
}

export const useReservationStore = create<ReservationStore>()(
  persist(
    (set, get) => ({
      rooms,
      reservations: [],
      isLoading: false,
      error: null,

      initialize: async () => {
        set({ isLoading: true, error: null });
        try {
          const reservations = await db.getReservations();
          set({ reservations, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      addReservation: async (reservation) => {
        const { isRoomAvailable } = get();
        
        // Check if room is available before adding reservation
        if (!isRoomAvailable(reservation.roomId, reservation.checkIn, reservation.checkOut)) {
          throw new Error('Room is not available for the selected dates');
        }

        set({ isLoading: true, error: null });
        try {
          const id = await db.addReservation(reservation);
          const newReservation = { ...reservation, id };
          set((state) => ({
            reservations: [...state.reservations, newReservation],
            isLoading: false,
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      cancelReservation: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await db.updateReservation(id, { status: 'cancelled' });
          set((state) => ({
            reservations: state.reservations.map((res) =>
              res.id === id ? { ...res, status: 'cancelled' } : res
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      isRoomAvailable: (roomId, checkIn, checkOut, excludeReservationId) => {
        const { reservations } = get();
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        return !reservations.some(
          (res) =>
            res.roomId === roomId &&
            res.status !== 'cancelled' &&
            res.id !== excludeReservationId &&
            !(new Date(res.checkOut) <= checkInDate || new Date(res.checkIn) >= checkOutDate)
        );
      },

      getAvailableRooms: (checkIn, checkOut) => {
        const { rooms, isRoomAvailable } = get();
        return rooms.filter((room) => isRoomAvailable(room.id, checkIn, checkOut));
      },
    }),
    {
      name: 'hotel-storage',
      partialize: (state) => ({
        reservations: state.reservations,
      }),
    }
  )
);