'use client';

import React from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { Badge, Button, Dropdown, App } from 'antd';
import { 
  ShoppingCartOutlined, 
  MedicineBoxOutlined, 
  UserOutlined, 
  LogoutOutlined,
  SunOutlined,
  MoonOutlined 
} from '@ant-design/icons';
import { RootState } from '@/app/store';
import { logout } from '@/entities/user/model/userSlice';
import { toggleTheme } from '@/entities/theme/model/themeSlice';

export const Header = () => {
  const dispatch = useDispatch();
  const { message } = App.useApp();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const menuItems = [
    {
      key: 'profile',
      label: (
        <div style={{ padding: '4px 8px' }}>
          <div style={{ fontWeight: 600, color: themeMode === 'dark' ? '#ffffff' : '#2d3436' }}>{user?.name}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{user?.email}</div>
          <div style={{ fontSize: '11px', color: '#00b894', marginTop: '2px', fontWeight: 600 }}>
            {user?.role === 'admin' ? 'Адміністратор' : 'Покупець'}
          </div>
        </div>
      ),
      disabled: true,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: 'Вийти з акаунту',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        dispatch(logout());
        message.success('Ви вийшли з акаунту');
      },
    },
  ];

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Промо-банер про знижку */}
      <div style={{
        backgroundColor: themeMode === 'dark' ? '#0b3c32' : '#e8f8f5',
        color: themeMode === 'dark' ? '#39e5c2' : '#00b894',
        textAlign: 'center',
        padding: '6px 24px',
        fontSize: '13px',
        fontWeight: 600,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        borderBottom: themeMode === 'dark' ? '1px solid #303030' : '1px solid #e2f5f1',
        transition: 'background-color 0.3s, color 0.3s, border-bottom 0.3s'
      }}>
        <span>🎉 Отримайте знижку 10% на всі замовлення від 1000 грн!</span>
      </div>
      <header style={{
        width: '100%',
        backgroundColor: themeMode === 'dark' ? '#1f1f1f' : '#ffffff',
        borderBottom: themeMode === 'dark' ? '1px solid #303030' : '1px solid #f0f0f0',
        boxShadow: themeMode === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: '64px',
        boxSizing: 'border-box',
        transition: 'background-color 0.3s, border-bottom 0.3s, box-shadow 0.3s'
      }}>
      {/* Логотип */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <MedicineBoxOutlined style={{ fontSize: '28px', color: '#00b894' }} />
        <span style={{
          fontSize: '20px',
          fontWeight: 700,
          color: themeMode === 'dark' ? '#ffffff' : '#2d3436',
          letterSpacing: '0.5px',
          transition: 'color 0.3s'
        }}>
          Аптека <span style={{ color: '#00b894' }}>Здоров'я</span>
        </span>
      </Link>

      {/* Навігація */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link href="/catalog" style={{
          fontSize: '15px',
          fontWeight: 500,
          color: themeMode === 'dark' ? '#f5f5f5' : '#2d3436',
          textDecoration: 'none',
          transition: 'color 0.2s'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#00b894')}
        onMouseLeave={(e) => (e.currentTarget.style.color = themeMode === 'dark' ? '#f5f5f5' : '#2d3436')}
        >
          Каталог ліків
        </Link>
        <Link href="/about" style={{
          fontSize: '15px',
          fontWeight: 500,
          color: themeMode === 'dark' ? '#f5f5f5' : '#2d3436',
          textDecoration: 'none',
          transition: 'color 0.2s'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#00b894')}
        onMouseLeave={(e) => (e.currentTarget.style.color = themeMode === 'dark' ? '#f5f5f5' : '#2d3436')}
        >
          Про нас
        </Link>
      </nav>

      {/* Користувачі та кошик */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Перемикач теми */}
        <Button
          type="text"
          icon={themeMode === 'dark' 
            ? <SunOutlined style={{ fontSize: '18px', color: '#ffb142' }} /> 
            : <MoonOutlined style={{ fontSize: '18px', color: '#2d3436' }} />
          }
          onClick={() => dispatch(toggleTheme())}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: themeMode === 'dark' ? '#f5f5f5' : '#2d3436'
          }}
        />

        <Link href="/cart" style={{ display: 'flex', alignItems: 'center' }}>
          <Badge count={totalCount} size="small" showZero={false} color="#00b894">
            <Button
              type="text"
              icon={<ShoppingCartOutlined style={{ fontSize: '20px', color: themeMode === 'dark' ? '#f5f5f5' : '#2d3436' }} />}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            />
          </Badge>
        </Link>

        {/* Профіль */}
        {isAuthenticated && user ? (
          <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
            <Button
              type="default"
              icon={<UserOutlined />}
              style={{ 
                borderColor: '#00b894', 
                color: '#00b894', 
                fontWeight: 600,
                borderRadius: '8px'
              }}
            >
              {user.name.split(' ')[0]}
            </Button>
          </Dropdown>
        ) : (
          <Link href="/login">
            <Button
              type="primary"
              icon={<UserOutlined />}
              style={{ backgroundColor: '#00b894', borderColor: '#00b894', borderRadius: '8px' }}
            >
              Увійти
            </Button>
          </Link>
        )}
      </div>
    </header>
  </div>
  );
};
