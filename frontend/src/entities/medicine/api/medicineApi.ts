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
      providesTags: ['Medicine'],
    }),
    getMedicineById: build.query<Medicine, string>({
      query: (id) => `/medicines/${id}`,
      providesTags: (result, error, id) => [{ type: 'Medicine', id }],
    }),
  }),
});

export const { useGetMedicinesQuery, useGetMedicineByIdQuery } = medicineApi;
