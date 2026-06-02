'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { initializeCart } from '@/entities/cart/model/cartSlice';

interface StoreProviderProps {
  children: React.ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  useEffect(() => {
    // Ініціалізуємо кошик з localStorage лише на клієнті для уникнення помилок гідрації
    store.dispatch(initializeCart());
  }, []);

  return <Provider store={store}>{children}</Provider>;
};
