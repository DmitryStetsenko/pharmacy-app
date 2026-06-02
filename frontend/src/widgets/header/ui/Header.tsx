'use client';

import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { Badge, Button } from 'antd';
import { ShoppingCartOutlined, MedicineBoxOutlined, UserOutlined } from '@ant-design/icons';
import { RootState } from '@/app/store';

export const Header = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #f0f0f0',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      height: '64px',
      boxSizing: 'border-box'
    }}>
      {/* Логотип */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <MedicineBoxOutlined style={{ fontSize: '28px', color: '#00b894' }} />
        <span style={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#2d3436',
          letterSpacing: '0.5px'
        }}>
          Аптека <span style={{ color: '#00b894' }}>Здоров'я</span>
        </span>
      </Link>

      {/* Навігація */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link href="/catalog" style={{
          fontSize: '15px',
          fontWeight: 500,
          color: '#2d3436',
          textDecoration: 'none',
          transition: 'color 0.2s'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#00b894')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#2d3436')}
        >
          Каталог ліків
        </Link>
      </nav>

      {/* Користувачі та кошик */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link href="/cart" style={{ display: 'flex', alignItems: 'center' }}>
          <Badge count={totalCount} size="small" showZero={false} color="#00b894">
            <Button
              type="text"
              icon={<ShoppingCartOutlined style={{ fontSize: '20px' }} />}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            />
          </Badge>
        </Link>

        {/* Профіль */}
        <Link href="/login">
          <Button
            type="primary"
            icon={<UserOutlined />}
            style={{ backgroundColor: '#00b894', borderColor: '#00b894' }}
          >
            Увійти
          </Button>
        </Link>
      </div>
    </header>
  );
};
