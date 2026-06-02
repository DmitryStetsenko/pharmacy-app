'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Row, Col, Card, Button, Typography, Badge, Spin, Result, Divider, Space, App } from 'antd';
import { ArrowLeftOutlined, ShoppingCartOutlined, CheckOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useGetMedicineByIdQuery } from '@/entities/medicine/api/medicineApi';
import { addItem, removeItem, updateQuantity } from '@/entities/cart/model/cartSlice';

const { Title, Text, Paragraph } = Typography;

interface MedicineDetailsPageProps {
  id: string;
}

export const MedicineDetailsPage = ({ id }: MedicineDetailsPageProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { message } = App.useApp();

  const { data: medicine, isLoading, error } = useGetMedicineByIdQuery(id);
  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find((item) => item.medicine.id === id)
  );

  const currentQuantityInCart = cartItem ? cartItem.quantity : 0;
  
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" description="Завантаження деталей препарату..." />
      </div>
    );
  }

  if (error || !medicine) {
    return (
      <div style={{ padding: '40px 24px' }}>
        <Result
          status="404"
          title="404"
          subTitle="На жаль, запитуваний препарат не знайдено або він більше недоступний."
          extra={
            <Button type="primary" onClick={() => router.push('/catalog')} style={{ backgroundColor: '#00b894', borderColor: '#00b894' }}>
              Повернутися до каталогу
            </Button>
          }
        />
      </div>
    );
  }

  const isOutOfStock = medicine.inStock <= 0;
  const isMaxStockReached = currentQuantityInCart >= medicine.inStock;

  const handleAddToCart = () => {
    if (!isOutOfStock && !isMaxStockReached) {
      dispatch(addItem(medicine));
      message.success(`${medicine.name} додано до кошика!`);
    }
  };

  const handleIncrement = () => {
    if (isMaxStockReached) {
      message.warning(`Немає більше одиниць на складі (${medicine.inStock} шт. максимум)`);
      return;
    }
    dispatch(updateQuantity({ id: medicine.id, quantity: currentQuantityInCart + 1 }));
  };

  const handleDecrement = () => {
    if (currentQuantityInCart === 1) {
      dispatch(removeItem(medicine.id));
      message.info(`${medicine.name} видалено з кошика`);
    } else {
      dispatch(updateQuantity({ id: medicine.id, quantity: currentQuantityInCart - 1 }));
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '32px auto', padding: '0 24px' }}>
      {/* Кнопка Повернутися */}
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => router.push('/catalog')}
        style={{ marginBottom: '24px', paddingLeft: 0, fontWeight: 500, color: '#2d3436' }}
      >
        Назад до каталогу
      </Button>

      <Card style={{
        borderRadius: '16px',
        border: '1px solid #f0f0f0',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden'
      }}>
        <Row gutter={[32, 32]}>
          {/* Фото ліків */}
          <Col xs={24} md={10}>
            <div style={{
              height: '350px',
              backgroundColor: '#f8f9fa',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '12px',
              border: '1px solid #f0f0f0',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {medicine.image ? (
                <img
                  src={medicine.image}
                  alt={medicine.name}
                  style={{ maxHeight: '280px', maxWidth: '90%', objectFit: 'contain' }}
                />
              ) : (
                <MedicineBoxOutlined style={{ fontSize: '120px', color: '#b2bec3' }} />
              )}

              {/* Статус на складі у вигляді плашки */}
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px'
              }}>
                <Badge
                  count={isOutOfStock ? 'Немає в наявності' : medicine.category}
                  style={{
                    backgroundColor: isOutOfStock ? '#ff7675' : '#00b894',
                    fontSize: '12px',
                    padding: '0 10px',
                    height: '24px',
                    lineHeight: '24px',
                    borderRadius: '12px',
                    fontWeight: 600
                  }}
                />
              </div>
            </div>
          </Col>

          {/* Інформація про товар */}
          <Col xs={24} md={14} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <Text type="secondary" style={{ fontSize: '14px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                {medicine.manufacturer}
              </Text>
              <Title level={2} style={{ margin: '8px 0 16px 0', fontWeight: 700, color: '#2d3436', fontSize: '28px' }}>
                {medicine.name}
              </Title>

              <Divider style={{ margin: '16px 0' }} />

              <div style={{ marginBottom: '24px' }}>
                <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                  Опис препарату
                </Text>
                <Paragraph style={{ color: '#2d3436', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
                  {medicine.description}
                </Paragraph>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Форма випуску</Text>
                    <div style={{ fontWeight: 600, color: '#2d3436', fontSize: '14px', marginTop: '4px' }}>
                      {medicine.category}
                    </div>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Виробник</Text>
                    <div style={{ fontWeight: 600, color: '#2d3436', fontSize: '14px', marginTop: '4px' }}>
                      {medicine.manufacturer}
                    </div>
                  </Col>
                </Row>
              </div>
            </div>

            <div>
              <Divider style={{ margin: '16px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: '13px' }}>Роздрібна ціна</Text>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: '#2d3436', lineHeight: 1.2 }}>
                    {medicine.price.toFixed(2)} <span style={{ fontSize: '18px', fontWeight: 600 }}>грн</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <Text type={isOutOfStock ? 'danger' : 'secondary'} style={{ fontSize: '14px', fontWeight: 500 }}>
                    {isOutOfStock ? 'Немає на складі' : `В наявності на складі: ${medicine.inStock} шт.`}
                  </Text>

                  {/* Кнопки кошика */}
                  {currentQuantityInCart > 0 ? (
                    <Space size="middle">
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #00b894',
                        borderRadius: '8px',
                        padding: '4px',
                        backgroundColor: '#f5fcfb'
                      }}>
                        <Button 
                          type="text" 
                          onClick={handleDecrement}
                          style={{ color: '#00b894', fontWeight: 'bold', fontSize: '16px' }}
                        >
                          -
                        </Button>
                        <Text style={{ margin: '0 16px', fontWeight: 700, color: '#00b894', fontSize: '15px' }}>
                          {currentQuantityInCart}
                        </Text>
                        <Button 
                          type="text" 
                          onClick={handleIncrement}
                          disabled={isMaxStockReached}
                          style={{ color: '#00b894', fontWeight: 'bold', fontSize: '16px' }}
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        type="default"
                        icon={<CheckOutlined style={{ color: '#00b894' }} />}
                        onClick={() => router.push('/cart')}
                        style={{ height: '42px', borderRadius: '8px', fontWeight: 600 }}
                      >
                        Перейти до кошика
                      </Button>
                    </Space>
                  ) : (
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      size="large"
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      style={{
                        height: '46px',
                        backgroundColor: isOutOfStock ? undefined : '#00b894',
                        borderColor: isOutOfStock ? undefined : '#00b894',
                        fontWeight: 600,
                        borderRadius: '8px',
                        padding: '0 24px'
                      }}
                    >
                      Додати до кошика
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
