'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, Form, Input, Button, Typography, App } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { signIn } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useRegisterMutation } from '@/entities/user/api/userApi';

const { Title, Text } = Typography;

export const RegisterPage = () => {
  const router = useRouter();
  const { message } = App.useApp();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const [registerUser, { isLoading: isRegistering }] = useRegisterMutation();
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
      // 1. Реєструємо на бекенді
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      }).unwrap();

      message.success('Реєстрація успішна! Входимо до системи...');

      // 2. Логінимо через NextAuth
      const res = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (res?.error) {
        message.error(res.error);
      } else {
        message.success('Ласкаво просимо!');
        router.push('/catalog');
      }
    } catch (err: any) {
      const errorMsg = err?.data?.message || 'Помилка при реєстрації. Можливо, такий користувач вже існує.';
      message.error(errorMsg);
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
            Реєстрація
          </Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>
            Створіть акаунт для доступу до кабінету
          </Text>
        </div>

        <Form
          name="register_form"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            label="Повне ім'я"
            name="name"
            rules={[{ required: true, message: 'Будь ласка, введіть ім\'я' }]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#b2bec3' }} />} 
              placeholder="Іван Іванов" 
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

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
            rules={[
              { required: true, message: 'Будь ласка, введіть пароль' },
              { min: 6, message: 'Пароль має бути не менше 6 символів' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#b2bec3' }} />}
              placeholder="Мінімум 6 символів..."
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            label="Підтвердження паролю"
            name="confirm"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Будь ласка, підтвердіть пароль' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Паролі не збігаються!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#b2bec3' }} />}
              placeholder="Повторіть пароль..."
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <div style={{ textAlign: 'right', marginBottom: '24px' }}>
            <Link href="/login" style={{ fontSize: '13px', color: '#00b894', textDecoration: 'none', fontWeight: 500 }}>
              Вже є акаунт? Увійти
            </Link>
          </div>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading || isRegistering}
              style={{
                height: '46px',
                backgroundColor: '#00b894',
                borderColor: '#00b894',
                fontWeight: 600,
                borderRadius: '8px'
              }}
            >
              Зареєструватися
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
