'use client';

import React, { useEffect, useState } from 'react';
import { ConfigProvider, App, theme } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';
import { initTheme } from '@/entities/theme/model/themeSlice';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const dispatch = useDispatch();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    dispatch(initTheme());
    setMounted(true);
  }, [dispatch]);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', themeMode);
      if (themeMode === 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
      } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
      }
    }
  }, [themeMode, mounted]);

  const { defaultAlgorithm, darkAlgorithm } = theme;

  return (
    <ConfigProvider
      theme={{
        algorithm: themeMode === 'dark' ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorPrimary: '#00b894',
          borderRadius: 8,
          fontFamily: 'var(--font-geist-sans), sans-serif',
        },
      }}
    >
      <App style={{ minHeight: '100vh' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: themeMode === 'dark' ? '#141414' : '#f5f7fa',
          color: themeMode === 'dark' ? '#f5f5f5' : '#2d3436',
          transition: 'background-color 0.3s, color 0.3s'
        }}>
          {children}
        </div>
      </App>
    </ConfigProvider>
  );
};
