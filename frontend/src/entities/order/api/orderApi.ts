import { baseApi } from '@/shared/api/baseApi';

export interface OrderItem {
  medicineId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string | null;
  customerName: string;
  phone: string;
  email: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface CreateOrderPayload {
  customerName: string;
  phone: string;
  email: string;
  items: {
    medicineId: string;
    quantity: number;
  }[];
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createOrder: build.mutation<Order, CreateOrderPayload>({
      query: (payload) => ({
        url: '/orders',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Medicine'], // Оновлюємо ліки у каталозі, оскільки кількість на складі (inStock) зменшилась!
    }),
    getOrders: build.query<Order[], void>({
      query: () => '/orders',
      providesTags: ['Order'],
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrdersQuery } = orderApi;
