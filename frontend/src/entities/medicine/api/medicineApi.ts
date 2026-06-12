import { baseApi } from '@/shared/api/baseApi';
import { Medicine } from '../model/types';

export interface GetMedicinesResponse {
  medicines: Medicine[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GetMedicinesParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export const medicineApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMedicines: build.query<GetMedicinesResponse, GetMedicinesParams>({
      query: (params) => ({
        url: '/medicines',
        params,
      }),
      transformResponse: (response: {
        medicines: Medicine[];
        totalCount: number;
        page: number;
        totalPages: number;
      }) => ({
        medicines: response.medicines,
        total: response.totalCount,
        page: response.page,
        totalPages: response.totalPages,
      }),
      providesTags: ['Medicine'],
    }),
    getMedicineById: build.query<Medicine, string>({
      query: (id) => `/medicines/${id}`,
      providesTags: (result, error, id) => [{ type: 'Medicine', id }],
    }),
    createMedicine: build.mutation<Medicine, Omit<Medicine, 'id'>>({
      query: (body) => ({
        url: '/medicines',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Medicine'],
    }),
    updateMedicine: build.mutation<Medicine, { id: string; body: Partial<Omit<Medicine, 'id'>> }>({
      query: ({ id, body }) => ({
        url: `/medicines/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => ['Medicine', { type: 'Medicine', id }],
    }),
    deleteMedicine: build.mutation<{ message: string; id: string }, string>({
      query: (id) => ({
        url: `/medicines/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Medicine'],
    }),
  }),
});

export const {
  useGetMedicinesQuery,
  useGetMedicineByIdQuery,
  useCreateMedicineMutation,
  useUpdateMedicineMutation,
  useDeleteMedicineMutation,
} = medicineApi;
