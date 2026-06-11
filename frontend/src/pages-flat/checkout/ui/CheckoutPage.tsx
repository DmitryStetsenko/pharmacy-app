'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { 
  Row, 
  Col, 
  Card, 
  Form, 
  Input, 
  Button, 
  Radio, 
  Typography, 
  Divider, 
  Result, 
  App 
} from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { RootState } from '@/app/store';
import { clearCart } from '@/entities/cart/model/cartSlice';
import { useCreateOrderMutation } from '@/entities/order/api/orderApi';

const { Title, Text, Paragraph } = Typography;

export const CheckoutPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { message } = App.useApp();
  
  const { items, totalAmount } = useSelector((state: RootState) => state.cart);
  const discountThreshold = 1000;
  const discountRate = 0.1; // 10%
  const hasDiscount = totalAmount >= discountThreshold;
  const discountAmount = hasDiscount ? parseFloat((totalAmount * discountRate).toFixed(2)) : 0;
  const finalAmount = totalAmount - discountAmount;

  const [createOrder, { isLoading, data: createdOrder, isSuccess, error }] = useCreateOrderMutation();
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [form] = Form.useForm();

  // Redirect if cart is empty and order wasn't successfully placed
  useEffect(() => {
    if (items.length === 0 && !isSuccess) {
      router.push('/cart');
    }
  }, [items, isSuccess, router]);

  // Handle successful order creation
  useEffect(() => {
    if (isSuccess && createdOrder) {
      dispatch(clearCart());
      message.success('Замовлення успішно оформлено!');
    }
  }, [isSuccess, createdOrder, dispatch, message]);

  // Handle server errors
  useEffect(() => {
    if (error) {
      const errorData = error as any;
      const errorMsg = errorData.data?.message || 'Помилка при створенні замовлення. Спробуйте ще раз.';
      message.error(errorMsg);
    }
  }, [error, message]);

  const onFinish = async (values: any) => {
    const orderItems = items.map(item => ({
      medicineId: item.medicine.id,
      quantity: item.quantity
    }));

    try {
      await createOrder({
        customerName: values.customerName,
        phone: values.phone,
        email: values.email,
        items: orderItems
      }).unwrap();
    } catch (e) {
      // Errors are handled in useEffect above
    }
  };

  // If order was successfully created, show success screen
  if (isSuccess && createdOrder) {
    return (
      <div style={{ maxWidth: '600px', margin: '60px auto', padding: '0 24px' }}>
        <Card style={{ borderRadius: '16px', border: '1px solid #f0f0f0', textAlign: 'center', padding: '20px' }}>
          <Result
            status="success"
            title="Замовлення успішно створено!"
            subTitle={
              <div style={{ marginTop: '16px' }}>
                <Paragraph style={{ fontSize: '16px', fontWeight: 600, color: '#2d3436' }}>
                  Номер замовлення: <span style={{ color: '#00b894' }}>{createdOrder.id}</span>
                </Paragraph>
                <Paragraph type="secondary">
                  Дякуємо за покупку! Ми надіслали підтвердження на електронну адресу <strong>{createdOrder.email}</strong>.
                  Наш провізор зв'яжеться з вами по телефону <strong>{createdOrder.phone}</strong> для підтвердження.
                </Paragraph>
              </div>
            }
            extra={[
              <Button 
                type="primary" 
                key="catalog" 
                size="large"
                onClick={() => router.push('/catalog')}
                style={{ 
                  backgroundColor: '#00b894', 
                  borderColor: '#00b894', 
                  borderRadius: '8px', 
                  height: '46px',
                  fontWeight: 600
                }}
              >
                Повернутися до каталогу
              </Button>,
              <Button 
                key="home" 
                size="large"
                onClick={() => router.push('/')}
                style={{ borderRadius: '8px', height: '46px' }}
              >
                На головну
              </Button>
            ]}
          />
        </Card>
      </div>
    );
  }

  // Avoid flash of empty screen if redirecting
  if (items.length === 0) {
    return null;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.push('/cart')}
          style={{ display: 'flex', alignItems: 'center', padding: 0 }}
        >
          Повернутися до кошика
        </Button>
      </div>

      <Title level={2} style={{ marginBottom: '32px', color: '#2d3436', fontWeight: 700 }}>
        Оформлення замовлення
      </Title>

      <Row gutter={[24, 24]}>
        {/* Форма оформлення зліва */}
        <Col xs={24} lg={15}>
          <Card style={{ borderRadius: '16px', border: '1px solid #f0f0f0' }}>
            <Title level={4} style={{ marginBottom: '24px', fontWeight: 600 }}>
              Контактні дані покупця
            </Title>

            <Form
              form={form}
              layout="vertical"
              name="checkout_form"
              onFinish={onFinish}
              requiredMark={false}
              initialValues={{ deliveryType: 'pickup' }}
            >
              <Form.Item
                label="Прізвище та ім'я"
                name="customerName"
                rules={[{ required: true, message: 'Будь ласка, введіть ваше прізвище та ім\'я' }]}
              >
                <Input placeholder="Введіть ім'я..." size="large" style={{ borderRadius: '8px' }} />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Телефон"
                    name="phone"
                    rules={[
                      { required: true, message: 'Будь ласка, введіть номер телефону' },
                      { pattern: /^\+?3?8?(0\d{9})$/, message: 'Некоректний формат телефону (наприклад: +380991234567)' }
                    ]}
                  >
                    <Input placeholder="+380..." size="large" style={{ borderRadius: '8px' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Електронна пошта (Email)"
                    name="email"
                    rules={[
                      { required: true, message: 'Будь ласка, введіть вашу електронну пошту' },
                      { type: 'email', message: 'Введіть коректну електронну адресу' }
                    ]}
                  >
                    <Input placeholder="example@mail.com" size="large" style={{ borderRadius: '8px' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Divider style={{ margin: '24px 0' }} />

              <Title level={4} style={{ marginBottom: '20px', fontWeight: 600 }}>
                Спосіб отримання
              </Title>

              <Form.Item name="deliveryType">
                <Radio.Group 
                  onChange={(e) => setDeliveryType(e.target.value)} 
                  style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
                  <Radio value="pickup">
                    <div style={{ marginLeft: '8px' }}>
                      <Text strong style={{ display: 'block' }}>Самовивіз з аптеки (Безкоштовно)</Text>
                      <Text type="secondary" style={{ fontSize: '13px' }}>
                        м. Київ, вул. Хрещатик, 22. Забрати можна через 30 хвилин після підтвердження.
                      </Text>
                    </div>
                  </Radio>
                  <Radio value="delivery">
                    <div style={{ marginLeft: '8px' }}>
                      <Text strong style={{ display: 'block' }}>Доставка кур'єром (Безкоштовно)</Text>
                      <Text type="secondary" style={{ fontSize: '13px' }}>
                        Доставка по Києву протягом 2 годин.
                      </Text>
                    </div>
                  </Radio>
                </Radio.Group>
              </Form.Item>

              {deliveryType === 'delivery' && (
                <Form.Item
                  label="Адреса доставки"
                  name="address"
                  rules={[{ required: true, message: 'Будь ласка, введіть адресу доставки' }]}
                >
                  <Input.TextArea 
                    placeholder="Введіть вулицю, будинок, квартиру..." 
                    rows={3} 
                    style={{ borderRadius: '8px' }} 
                  />
                </Form.Item>
              )}

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={isLoading}
                style={{ 
                  height: '48px', 
                  backgroundColor: '#00b894', 
                  borderColor: '#00b894', 
                  fontWeight: 600, 
                  borderRadius: '8px',
                  marginTop: '24px'
                }}
              >
                Підтвердити замовлення
              </Button>
            </Form>
          </Card>
        </Col>

        {/* Список покупок справа */}
        <Col xs={24} lg={9}>
          <Card style={{ borderRadius: '16px', border: '1px solid #f0f0f0', position: 'sticky', top: '88px' }}>
            <Title level={4} style={{ marginBottom: '20px', fontWeight: 600 }}>
              Ваше замовлення
            </Title>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {items.map((item) => (
                <div 
                  key={item.medicine.id} 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    padding: '12px 0', 
                    borderBottom: '1px solid #f0f0f0' 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginBottom: '4px' }}>
                    <Text style={{ fontSize: '14px', color: '#2d3436' }}>{item.medicine.name}</Text>
                    <Text style={{ fontSize: '14px', color: '#2d3436' }}>{(item.medicine.price * item.quantity).toFixed(2)} грн</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <Text type="secondary">{item.medicine.manufacturer}</Text>
                    <Text type="secondary">{item.quantity} шт. × {item.medicine.price.toFixed(2)} грн</Text>
                  </div>
                </div>
              ))}
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <Text type="secondary">Сума за товари</Text>
              <Text strong>{totalAmount.toFixed(2)} грн</Text>
            </div>

            {hasDiscount && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <Text type="secondary">Знижка (10% від 1000 грн)</Text>
                <Text type="danger" strong>-{discountAmount.toFixed(2)} грн</Text>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <Text type="secondary">Доставка</Text>
              <Text type="success" strong>Безкоштовно</Text>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Text style={{ fontSize: '16px', fontWeight: 600 }}>Загальна сума</Text>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#00b894' }}>
                {finalAmount.toFixed(2)} грн
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
