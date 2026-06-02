import { baseApi } from '@/shared/api/baseApi';
import { User } from '../model/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, LoginPayload>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Order'], // Очищуємо кеш замовлень при зміні користувача
    }),
    register: build.mutation<AuthResponse, RegisterPayload>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Order'],
    }),
    getMe: build.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = userApi;
