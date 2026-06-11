import { baseApi } from '@/shared/api/baseApi';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AdminOrder {
  id: string;
  userId: string | null;
  customerName: string;
  phone: string;
  email: string;
  items: { medicineId: string; name: string; price: number; quantity: number }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Users
    getUsers: build.query<AdminUser[], void>({
      query: () => '/auth/users',
      providesTags: ['User'],
    }),
    deleteUser: build.mutation<{ message: string; id: string }, string>({
      query: (id) => ({ url: `/auth/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),
    createUser: build.mutation<AdminUser, Omit<AdminUser, 'id' | 'createdAt'> & { password?: string }>({
      query: (body) => ({
        url: '/auth/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: build.mutation<AdminUser, { id: string; body: Partial<Omit<AdminUser, 'id' | 'createdAt'>> & { password?: string } }>({
      query: ({ id, body }) => ({
        url: `/auth/users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    // Orders (admin)
    getAdminOrders: build.query<AdminOrder[], void>({
      query: () => '/orders',
      providesTags: ['Order'],
    }),
    updateOrderStatus: build.mutation<AdminOrder, { id: string; status: string }>({
      query: ({ id, status }) => ({ url: `/orders/${id}`, method: 'PUT', body: { status } }),
      invalidatesTags: ['Order'],
    }),
    deleteOrder: build.mutation<{ message: string; id: string }, string>({
      query: (id) => ({ url: `/orders/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useDeleteUserMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = adminApi;
