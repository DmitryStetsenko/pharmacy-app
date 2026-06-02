'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { SessionProvider, useSession } from 'next-auth/react';
import { store } from '@/app/store';
import { initializeCart } from '@/entities/cart/model/cartSlice';
import { initializeAuth, setCredentials, logout } from '@/entities/user/model/userSlice';

interface StoreProviderProps {
  children: React.ReactNode;
}

const AuthSync = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken && session.user) {
      store.dispatch(
        setCredentials({
          user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: session.user.role as 'user' | 'admin',
          },
          token: session.accessToken,
        })
      );
    } else if (status === 'unauthenticated') {
      store.dispatch(logout());
    }
  }, [session, status]);

  return <>{children}</>;
};

export const StoreProvider = ({ children }: StoreProviderProps) => {
  useEffect(() => {
    // Ініціалізуємо кошик та авторизацію з localStorage лише на клієнті
    store.dispatch(initializeCart());
    store.dispatch(initializeAuth());
  }, []);

  return (
    <Provider store={store}>
      <SessionProvider>
        <AuthSync>{children}</AuthSync>
      </SessionProvider>
    </Provider>
  );
};
