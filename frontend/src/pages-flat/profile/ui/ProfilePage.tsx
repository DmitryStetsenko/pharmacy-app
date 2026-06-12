'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Form, Input, Button, Typography, Row, Col, Space, Badge, App, Alert, Tag, Divider, Spin } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  SaveOutlined, 
  ReloadOutlined,
  ClearOutlined,
  InfoCircleOutlined,
  HistoryOutlined,
  EnvironmentOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
  ShoppingOutlined,
  LockOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RootState } from '@/app/store';
import { clearCart } from '@/entities/cart/model/cartSlice';
import { logout } from '@/entities/user/model/userSlice';
import { useGetOrdersQuery } from '@/entities/order/api/orderApi';

const { Title, Text, Paragraph } = Typography;

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  const isDark = themeMode === 'dark';

  // sessionStorage state
  const [sessionStatus, setSessionStatus] = useState<string>('Гість');
  const [sessionId, setSessionId] = useState<string>('');

  // Fetch orders (only active query when authenticated)
  const { data: orders, isLoading: isOrdersLoading, refetch: refetchOrders } = useGetOrdersQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Initial load from localStorage and sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize sessionStorage
      let currentSessionStatus = sessionStorage.getItem('user_session_status');
      let currentSessionId = sessionStorage.getItem('user_session_id');

      if (isAuthenticated && user) {
        currentSessionStatus = 'Ви увійшли в систему';
        sessionStorage.setItem('user_session_status', currentSessionStatus);
      } else {
        currentSessionStatus = 'Гість';
        sessionStorage.setItem('user_session_status', currentSessionStatus);
      }

      if (!currentSessionId) {
        currentSessionId = 'sess_' + Math.random().toString(36).substring(2, 11);
        sessionStorage.setItem('user_session_id', currentSessionId);
      }

      setSessionStatus(currentSessionStatus);
      setSessionId(currentSessionId);

      // Restore or initialize form fields
      const savedContacts = localStorage.getItem('user_contact_data');
      let contactData = { name: '', email: '', phone: '', address: '' };

      if (savedContacts) {
        try {
          contactData = JSON.parse(savedContacts);
        } catch (e) {
          console.error('Failed to parse saved contact data', e);
        }
      }

      // If logged in, override name and email with official account details
      if (isAuthenticated && user) {
        contactData.name = user.name;
        contactData.email = user.email;
      }

      form.setFieldsValue(contactData);
    }
  }, [isAuthenticated, user, form]);

  // Refetch orders if user logs in
  useEffect(() => {
    if (isAuthenticated) {
      refetchOrders();
    }
  }, [isAuthenticated, refetchOrders]);

  // Handle Save to localStorage
  const handleSaveContacts = (values: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_contact_data', JSON.stringify(values));
      message.success(isAuthenticated ? 'Контактні дані збережено!' : 'Контактні дані збережено в localStorage!');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    message.info('Ви вийшли з акаунту');
    router.push('/');
  };

  // Handle Reset data (Self-reliance task 2)
  const handleResetAllData = () => {
    if (typeof window !== 'undefined') {
      // Clear localStorage items
      localStorage.removeItem('user_contact_data');
      localStorage.removeItem('pharmacy_cart');
      
      // Clear sessionStorage items
      sessionStorage.removeItem('user_session_status');
      sessionStorage.removeItem('user_session_id');

      // Clear Redux state
      dispatch(clearCart());
      dispatch(logout());

      // Reset local states
      form.resetFields();
      setSessionStatus('Гість');
      const newSessionId = 'sess_' + Math.random().toString(36).substring(2, 11);
      sessionStorage.setItem('user_session_id', newSessionId);
      setSessionId(newSessionId);

      message.success('Всі дані додатка (кошик, контакти, сесія) успішно скинуто!');
      router.push('/');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'processing';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Виконано';
      case 'pending': return 'В обробці';
      case 'cancelled': return 'Скасовано';
      default: return status;
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      <Title level={2} style={{ marginBottom: '8px', color: isDark ? '#ffffff' : '#2d3436', fontWeight: 700 }}>
        Профіль користувача
      </Title>
      <Paragraph type="secondary" style={{ marginBottom: '32px', fontSize: '15px' }}>
        Керування персональними налаштуваннями, збереженими контактами та перегляд замовлень.
      </Paragraph>

      <Space orientation="vertical" size={24} style={{ width: '100%' }}>
        
        {/* Account Card */}
        <Card 
          style={{ 
            borderRadius: '16px', 
            border: isDark ? '1px solid #303030' : '1px solid #f0f0f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
          }}
        >
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#00b894',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '24px',
                fontWeight: 700
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <Title level={3} style={{ margin: 0, fontWeight: 700, color: isDark ? '#ffffff' : '#2d3436' }}>
                  {user.name}
                </Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: '4px' }}>
                  {user.email}
                </Text>
                <Tag color="#00b894" style={{ fontWeight: 600 }}>
                  {user.role === 'admin' ? 'Адміністратор' : 'Покупець'}
                </Tag>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: isDark ? '#2c2c2c' : '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#bfbfbf',
                fontSize: '24px',
                margin: '0 auto 16px auto'
              }}>
                <UserOutlined />
              </div>
              <Title level={4} style={{ marginBottom: '8px', fontWeight: 600, color: isDark ? '#ffffff' : '#2d3436' }}>
                Ви увійшли як Гість
              </Title>
              <Paragraph type="secondary" style={{ maxWidth: '400px', margin: '0 auto 20px auto' }}>
                Увійдіть у свій обліковий запис, щоб переглядати історію замовлень та отримувати додаткові знижки.
              </Paragraph>
              <Space size={16}>
                <Link href="/login">
                  <Button type="primary" icon={<LoginOutlined />} style={{ backgroundColor: '#00b894', borderColor: '#00b894', borderRadius: '8px' }}>
                    Увійти
                  </Button>
                </Link>
                <Link href="/register">
                  <Button icon={<UserAddOutlined />} style={{ borderRadius: '8px' }}>
                    Реєстрація
                  </Button>
                </Link>
              </Space>
            </div>
          )}
        </Card>

        {/* Contact Form (localStorage persistence) */}
        <Card 
          title={
            <Space>
              <UserOutlined style={{ color: '#00b894' }} />
              <span>Контактні дані для оформлення замовлення</span>
            </Space>
          }
          style={{ 
            borderRadius: '16px', 
            border: isDark ? '1px solid #303030' : '1px solid #f0f0f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
          }}
        >
          {isAuthenticated ? (
            <Alert
              type="success"
              showIcon
              icon={<LockOutlined />}
              title="Ви авторизовані"
              description="Ім'я та email заповнено автоматично з вашого акаунту і не можуть бути змінені тут. Заповніть телефон та адресу доставки для швидкого оформлення замовлень."
              style={{ marginBottom: '20px', borderRadius: '10px' }}
            />
          ) : (
            <Paragraph style={{ fontSize: '13px', color: '#8c8c8c', marginBottom: '20px' }}>
              Ці дані використовуються для автоматичного заповнення форми на сторінці оформлення замовлення. Дані надійно зберігаються на вашому пристрої у локальному сховищі (`localStorage`).
            </Paragraph>
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSaveContacts}
            requiredMark={false}
            style={{ maxWidth: '600px' }}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Ім'я та прізвище"
                  name="name"
                  rules={[{ required: true, message: 'Будь ласка, введіть ім\'я' }]}
                >
                  <Input 
                    prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} 
                    placeholder="Прізвище та ім'я..." 
                    size="large" 
                    disabled={isAuthenticated}
                    style={{ borderRadius: '8px' }} 
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Електронна пошта (Email)"
                  name="email"
                  rules={[
                    { required: true, message: 'Будь ласка, введіть email' },
                    { type: 'email', message: 'Введіть коректний email' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined style={{ color: '#bfbfbf' }} />} 
                    placeholder="example@mail.com" 
                    size="large" 
                    disabled={isAuthenticated}
                    style={{ borderRadius: '8px' }} 
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Номер телефону"
              name="phone"
              rules={[
                { required: true, message: 'Будь ласка, введіть телефон' },
                { pattern: /^\+?3?8?(0\d{9})$/, message: 'Некоректний формат (наприклад: +380991234567)' }
              ]}
            >
              <Input 
                prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />} 
                placeholder="+380..." 
                size="large" 
                style={{ borderRadius: '8px' }} 
              />
            </Form.Item>

            <Form.Item
              label="Адреса доставки (за замовчуванням)"
              name="address"
            >
              <Input.TextArea 
                placeholder="Вул. Шевченка, буд. 10, кв. 5..." 
                rows={2}
                style={{ borderRadius: '8px' }} 
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: '20px' }}>
              <Space size={12} wrap>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SaveOutlined />}
                  size="large"
                  style={{ 
                    backgroundColor: '#00b894', 
                    borderColor: '#00b894', 
                    borderRadius: '8px',
                    fontWeight: 600
                  }}
                >
                  {isAuthenticated ? 'Зберегти контактні дані' : 'Зберегти без реєстрації'}
                </Button>
                {isAuthenticated && (
                  <Button
                    icon={<LogoutOutlined />}
                    size="large"
                    danger
                    onClick={handleLogout}
                    style={{ borderRadius: '8px', fontWeight: 600 }}
                  >
                    Вийти з акаунту
                  </Button>
                )}
              </Space>
            </Form.Item>
          </Form>
        </Card>

        {/* Order History Card */}
        <Card
          title={
            <Space>
              <HistoryOutlined style={{ color: '#00b894' }} />
              <span>Історія замовлень</span>
            </Space>
          }
          style={{ 
            borderRadius: '16px', 
            border: isDark ? '1px solid #303030' : '1px solid #f0f0f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
          }}
        >
          {!isAuthenticated ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Paragraph type="secondary">
                Будь ласка, <Link href="/login" style={{ color: '#00b894', fontWeight: 600 }}>увійдіть</Link>, щоб переглянути свою історію замовлень.
              </Paragraph>
            </div>
          ) : isOrdersLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" />
            </div>
          ) : !orders || orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <ShoppingOutlined style={{ fontSize: '40px', color: '#bfbfbf', marginBottom: '12px' }} />
              <Paragraph type="secondary">Ви ще не робили замовлень.</Paragraph>
              <Link href="/catalog">
                <Button type="primary" style={{ backgroundColor: '#00b894', borderColor: '#00b894', borderRadius: '8px' }}>
                  Перейти до покупок
                </Button>
              </Link>
            </div>
          ) : (
            <div>
              {orders.map((order) => (
                <div key={order.id} style={{ 
                  padding: '16px', 
                  border: isDark ? '1px solid #303030' : '1px solid #f0f0f0',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  backgroundColor: isDark ? '#1a1a1a' : '#fafafa'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    <div>
                      <Text strong style={{ fontSize: '15px' }}>Замовлення #{order.id.slice(-6).toUpperCase()}</Text>
                      <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                        {new Date(order.createdAt).toLocaleDateString('uk-UA')} {new Date(order.createdAt).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </div>
                    <Tag color={getStatusColor(order.status)} style={{ fontWeight: 600, textTransform: 'uppercase' }}>
                      {getStatusText(order.status)}
                    </Tag>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                        <Text type="secondary">{item.name} × {item.quantity}</Text>
                        <Text>{(item.price * item.quantity).toFixed(2)} грн</Text>
                      </div>
                    ))}
                  </div>

                  <Divider style={{ margin: '8px 0' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text type="secondary">Одержувач: <Text strong>{order.customerName}</Text></Text>
                    <Text strong style={{ fontSize: '16px', color: '#00b894' }}>
                      Сума: {order.totalAmount.toFixed(2)} грн
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

      </Space>
    </div>
  );
};
