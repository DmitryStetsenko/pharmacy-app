'use client';

import React from 'react';
import { Card, Button, Badge, Typography } from 'antd';
import { ShoppingCartOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { Medicine } from '../model/types';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '@/entities/cart/model/cartSlice';
import { RootState } from '@/app/store';

const { Text, Title, Paragraph } = Typography;

interface MedicineCardProps {
  medicine: Medicine;
}

export const MedicineCard = ({ medicine }: MedicineCardProps) => {
  const dispatch = useDispatch();
  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find((item) => item.medicine.id === medicine.id)
  );

  const currentQuantityInCart = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = medicine.inStock <= 0;
  const isMaxStockReached = currentQuantityInCart >= medicine.inStock;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock && !isMaxStockReached) {
      dispatch(addItem(medicine));
    }
  };

  return (
    <Card
      hoverable
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid #f0f0f0'
      }}
      styles={{
        body: {
          padding: '16px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }
      }}
      cover={
        <div style={{
          height: '200px',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}>
          {isOutOfStock ? (
            <Badge.Ribbon text="Немає в наявності" color="red" />
          ) : isMaxStockReached ? (
            <Badge.Ribbon text="Макс. у кошику" color="orange" />
          ) : (
            <Badge.Ribbon text={`${medicine.category}`} color="#00b894" />
          )}

          {medicine.image ? (
            <img
              src={medicine.image}
              alt={medicine.name}
              style={{ maxHeight: '160px', maxWidth: '90%', objectFit: 'contain' }}
            />
          ) : (
            <MedicineBoxOutlined style={{ fontSize: '64px', color: '#b2bec3' }} />
          )}
        </div>
      }
    >
      <div style={{ marginBottom: '16px' }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {medicine.manufacturer}
        </Text>
        <Title level={4} style={{ margin: '4px 0 8px 0', fontSize: '18px', fontWeight: 600 }}>
          {medicine.name}
        </Title>
        <Paragraph ellipsis={{ rows: 2 }} style={{ color: '#636e72', fontSize: '13px', margin: 0 }}>
          {medicine.description}
        </Paragraph>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <Text style={{ fontSize: '13px', color: '#b2bec3' }}>Ціна</Text>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#2d3436' }}>
              {medicine.price.toFixed(2)} грн
            </div>
          </div>
          <Text type={isOutOfStock ? "danger" : "secondary"} style={{ fontSize: '12px' }}>
            {isOutOfStock ? "Закінчився" : `В наявності: ${medicine.inStock} шт.`}
          </Text>
        </div>

        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={handleAddToCart}
          disabled={isOutOfStock || isMaxStockReached}
          block
          style={{
            height: '40px',
            backgroundColor: isOutOfStock || isMaxStockReached ? undefined : '#00b894',
            borderColor: isOutOfStock || isMaxStockReached ? undefined : '#00b894',
            fontWeight: 600,
            borderRadius: '8px'
          }}
        >
          {isOutOfStock ? "Немає в наявності" : isMaxStockReached ? "Вже у кошику" : "Додати в кошик"}
        </Button>
      </div>
    </Card>
  );
};
