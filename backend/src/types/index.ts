import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  inStock: number;
  category: string; // e.g., 'Tablets', 'Capsules', 'Syrup', 'Ointment'
  manufacturer: string;
  image: string; // url or placeholder
  createdAt: string;
}

export interface OrderItem {
  medicineId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string | null; // null for guest checkout
  customerName: string;
  phone: string;
  email: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface AuthUserPayload {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}
