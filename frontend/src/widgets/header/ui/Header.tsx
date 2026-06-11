'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { Badge, Button, Dropdown, App, Drawer, Divider } from 'antd';
import { 
  ShoppingCartOutlined, 
  MedicineBoxOutlined, 
  UserOutlined, 
  LogoutOutlined,
  SunOutlined,
  MoonOutlined,
  GiftOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { RootState } from '@/app/store';
import { logout } from '@/entities/user/model/userSlice';
import { toggleTheme } from '@/entities/theme/model/themeSlice';

export const Header = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { message } = App.useApp();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const [sessionStatus, setSessionStatus] = React.useState<string>('Гість');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      let currentSessionStatus = sessionStorage.getItem('user_session_status');
      if (isAuthenticated && user) {
        currentSessionStatus = 'Ви увійшли в систему';
        sessionStorage.setItem('user_session_status', currentSessionStatus);
      } else if (!currentSessionStatus) {
        currentSessionStatus = 'Гість';
        sessionStorage.setItem('user_session_status', currentSessionStatus);
      }
      setSessionStatus(currentSessionStatus);
    }
  }, [isAuthenticated, user]);

  const isLinkActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const handleLogout = () => {
    dispatch(logout());
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('user_session_status', 'Гість');
      setSessionStatus('Гість');
    }
    message.success('Ви вийшли з акаунту');
    setMobileMenuOpen(false);
  };

  const menuItems = [
    {
      key: 'profile-info',
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
      key: 'profile-link',
      label: <Link href="/profile">Мій Профіль (Lab 4)</Link>,
      icon: <UserOutlined />,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: 'Вийти з акаунту',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
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
        <GiftOutlined style={{ fontSize: '16px' }} />
        <span>Отримайте знижку 10% на всі замовлення від 1000 грн!</span>
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

        {/* Навігація - ДЕСКТОП */}
        <nav className="desktop-only" style={{ alignItems: 'center', gap: '32px' }}>
          <Link href="/catalog" style={{
            fontSize: '15px',
            fontWeight: 550,
            color: isLinkActive('/catalog') ? '#00b894' : (themeMode === 'dark' ? '#f5f5f5' : '#2d3436'),
            textDecoration: 'none',
            borderBottom: isLinkActive('/catalog') ? '2px solid #00b894' : '2px solid transparent',
            padding: '4px 0',
            transition: 'color 0.2s, border-bottom-color 0.2s'
          }}>
            Каталог ліків
          </Link>
          <Link href="/about" style={{
            fontSize: '15px',
            fontWeight: 550,
            color: isLinkActive('/about') ? '#00b894' : (themeMode === 'dark' ? '#f5f5f5' : '#2d3436'),
            textDecoration: 'none',
            borderBottom: isLinkActive('/about') ? '2px solid #00b894' : '2px solid transparent',
            padding: '4px 0',
            transition: 'color 0.2s, border-bottom-color 0.2s'
          }}>
            Про нас
          </Link>
        </nav>

        {/* Користувачі та кошик */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Перемикач теми - ДЛЯ ВСІХ */}
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
            aria-label="Переключити тему оформлення"
          />

          {/* Кошик - ДЛЯ ВСІХ */}
          <Link href="/cart" style={{ display: 'flex', alignItems: 'center' }}>
            <Badge count={totalCount} size="small" showZero={false} color="#00b894">
              <Button
                type="text"
                icon={<ShoppingCartOutlined style={{ fontSize: '20px', color: themeMode === 'dark' ? '#f5f5f5' : '#2d3436' }} />}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                aria-label={`Кошик, ${totalCount} товарів`}
              />
            </Badge>
          </Link>

          {/* Панель профілю та входу - ДЕСКТОП */}
          <div className="desktop-only" style={{ alignItems: 'center', gap: '16px' }}>
            <Link href="/profile">
              <Button
                type="default"
                icon={<UserOutlined />}
                style={{ 
                  borderRadius: '8px',
                  fontWeight: 500
                }}
              >
                Профіль
              </Button>
            </Link>

            {isAuthenticated && user ? (
              <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
                <Button
                  type="primary"
                  style={{ 
                    backgroundColor: '#00b894', 
                    borderColor: '#00b894', 
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
                  style={{ backgroundColor: '#00b894', borderColor: '#00b894', borderRadius: '8px' }}
                >
                  Увійти
                </Button>
              </Link>
            )}
          </div>

          {/* Мобільна кнопка меню ("бургер") - МОБІЛЬНА */}
          <Button
            className="mobile-only"
            type="text"
            icon={<MenuOutlined style={{ fontSize: '20px', color: themeMode === 'dark' ? '#f5f5f5' : '#2d3436' }} />}
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Відкрити навігаційне меню"
            aria-expanded={mobileMenuOpen}
            style={{ display: 'none', alignItems: 'center', justifyContent: 'center' }}
          />
        </div>
      </header>

      {/* Мобільний слайд-навігатор (Drawer) */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MedicineBoxOutlined style={{ fontSize: '24px', color: '#00b894' }} />
            <span style={{ fontWeight: 700, color: themeMode === 'dark' ? '#ffffff' : '#2d3436' }}>Навігація</span>
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
        styles={{
          body: {
            backgroundColor: themeMode === 'dark' ? '#1f1f1f' : '#ffffff',
            color: themeMode === 'dark' ? '#ffffff' : '#2d3436',
            padding: '24px'
          },
          header: {
            backgroundColor: themeMode === 'dark' ? '#1f1f1f' : '#ffffff',
            borderBottom: themeMode === 'dark' ? '1px solid #303030' : '1px solid #f0f0f0',
          }
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
          {/* Інформація про користувача у меню */}
          {isAuthenticated && user && (
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: themeMode === 'dark' ? '#141414' : '#f9f9f9',
              border: `1px solid ${themeMode === 'dark' ? '#303030' : '#f0f0f0'}`
            }}>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>{user.name}</div>
              <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>{user.email}</div>
              <div style={{
                fontSize: '11px',
                color: '#00b894',
                fontWeight: 600,
                display: 'inline-block',
                padding: '2px 6px',
                backgroundColor: themeMode === 'dark' ? '#0d2b24' : '#e6f7f4',
                borderRadius: '4px'
              }}>
                {user.role === 'admin' ? 'Адміністратор' : 'Покупець'}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Link 
              href="/catalog" 
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: isLinkActive('/catalog') ? '#00b894' : (themeMode === 'dark' ? '#f5f5f5' : '#2d3436'),
                padding: '8px 0',
                display: 'block'
              }}
            >
              💊 Каталог ліків
            </Link>
            
            <Link 
              href="/about" 
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: isLinkActive('/about') ? '#00b894' : (themeMode === 'dark' ? '#f5f5f5' : '#2d3436'),
                padding: '8px 0',
                display: 'block'
              }}
            >
              ℹ️ Про нас
            </Link>

            <Link 
              href="/profile" 
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: isLinkActive('/profile') ? '#00b894' : (themeMode === 'dark' ? '#f5f5f5' : '#2d3436'),
                padding: '8px 0',
                display: 'block'
              }}
            >
              👤 Мій Профіль (Lab 4)
            </Link>
          </div>

          <Divider style={{ margin: '12px 0', borderColor: themeMode === 'dark' ? '#303030' : '#f0f0f0' }} />

          {/* Дії входу / виходу для мобільної панелі */}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {isAuthenticated && user ? (
              <Button
                type="primary"
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                style={{ width: '100%', borderRadius: '8px', fontWeight: 600, height: '40px' }}
              >
                Вийти з акаунту
              </Button>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} style={{ width: '100%' }}>
                <Button
                  type="primary"
                  style={{ width: '100%', backgroundColor: '#00b894', borderColor: '#00b894', borderRadius: '8px', fontWeight: 600, height: '40px' }}
                >
                  Увійти
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
};
