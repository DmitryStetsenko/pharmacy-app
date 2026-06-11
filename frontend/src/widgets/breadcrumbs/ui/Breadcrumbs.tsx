'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';

const routeNameMap: Record<string, string> = {
  catalog: 'Каталог ліків',
  cart: 'Кошик',
  checkout: 'Оформлення замовлення',
  about: 'Про нас',
  login: 'Вхід',
  register: 'Реєстрація',
  profile: 'Профіль',
};

export const Breadcrumbs = () => {
  const pathname = usePathname();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const isDark = themeMode === 'dark';

  if (!pathname || pathname === '/') {
    return null;
  }

  const pathnames = pathname.split('/').filter((x) => x);

  const breadcrumbItems = [
    {
      title: (
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isDark ? '#b2bec3' : '#636e72' }}>
          <HomeOutlined style={{ fontSize: '14px' }} />
          <span>Головна</span>
        </Link>
      ),
    },
    ...pathnames.map((segment, index) => {
      const url = `/${pathnames.slice(0, index + 1).join('/')}`;
      const isLast = index === pathnames.length - 1;
      
      const isDetail = pathnames[index - 1] === 'catalog';
      
      let titleText = routeNameMap[segment] || segment;
      if (isDetail) {
        titleText = 'Деталі препарату';
      }

      return {
        title: isLast ? (
          <span style={{ color: isDark ? '#ffffff' : '#2d3436', fontWeight: 500 }}>{titleText}</span>
        ) : (
          <Link href={url} style={{ color: isDark ? '#b2bec3' : '#636e72' }}>{titleText}</Link>
        ),
      };
    }),
  ];

  return (
    <div style={{
      maxWidth: '1200px',
      width: '100%',
      margin: '24px auto 0 auto',
      padding: '0 24px',
      boxSizing: 'border-box',
    }}>
      <Breadcrumb items={breadcrumbItems} />
    </div>
  );
};
