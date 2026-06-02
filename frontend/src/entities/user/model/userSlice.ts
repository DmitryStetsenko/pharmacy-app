import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserState } from './types';

const initialState: UserState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isLoading = false;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
    initializeAuth: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
          try {
            state.token = token;
            state.user = JSON.parse(userStr);
            state.isAuthenticated = true;
          } catch (e) {
            // Очищуємо невалідні дані
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      }
      state.isLoading = false;
    },
  },
});

export const { setCredentials, logout, initializeAuth } = userSlice.actions;
export default userSlice.reducer;
