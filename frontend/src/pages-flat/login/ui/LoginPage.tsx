'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, Form, Input, Button, Typography, App } from 'antd';
import { MailOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { signIn } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';

const { Title, Text } = Typography;

export const LoginPage = () => {
  const router = useRouter();
  const { message } = App.useApp();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);

  // Перенаправлення, якщо вже авторизований
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/catalog');
    }
  }, [isAuthenticated, router]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (res?.error) {
        message.error(res.error);
      } else {
        message.success('Раді бачити вас знову!');
        router.push('/catalog');
      }
    } catch (err) {
      message.error('Сталася непередбачувана помилка при вході');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '440px',
      margin: '60px auto',
      padding: '0 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => router.push('/catalog')}
        style={{ width: 'fit-content', padding: 0 }}
      >
        До каталогу ліків
      </Button>

      <Card style={{
        borderRadius: '16px',
        border: '1px solid #f0f0f0',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        padding: '12px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={3} style={{ margin: 0, fontWeight: 700, color: '#2d3436' }}>
            Вхід до кабінету
          </Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>
            Будь ласка, введіть ваші дані для входу
          </Text>
        </div>

        <Form
          name="login_form"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            label="Електронна пошта"
            name="email"
            rules={[
              { required: true, message: 'Будь ласка, введіть email' },
              { type: 'email', message: 'Введіть коректну електронну адресу' }
            ]}
          >
            <Input 
              prefix={<MailOutlined style={{ color: '#b2bec3' }} />} 
              placeholder="example@mail.com" 
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: 'Будь ласка, введіть пароль' }]}
            style={{ marginBottom: '8px' }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#b2bec3' }} />}
              placeholder="Введіть пароль..."
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <div style={{ textAlign: 'right', marginBottom: '24px' }}>
            <Link href="/register" style={{ fontSize: '13px', color: '#00b894', textDecoration: 'none', fontWeight: 500 }}>
              Немає акаунту? Зареєструватися
            </Link>
          </div>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{
                height: '46px',
                backgroundColor: '#00b894',
                borderColor: '#00b894',
                fontWeight: 600,
                borderRadius: '8px'
              }}
            >
              Увійти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
