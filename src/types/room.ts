export interface Room {
  id: number;
  name: string;
  description: string;
  price: number;
  capacity: number;
  images: string[];
  amenities: string[];
}

export interface Booking {
  id: number;
  roomId: number;
  checkIn: Date;
  checkOut: Date;
  guestName: string;
  email: string;
  phone: string;
  numberOfGuests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}