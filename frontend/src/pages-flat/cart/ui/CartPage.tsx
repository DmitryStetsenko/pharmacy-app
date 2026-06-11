'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Row, Col, Card, Button, Typography, Divider, Empty } from 'antd';
import { 
  DeleteOutlined, 
  PlusOutlined, 
  MinusOutlined, 
  ShoppingCartOutlined, 
  ArrowLeftOutlined,
  GiftOutlined,
  InfoCircleOutlined 
} from '@ant-design/icons';
import { RootState } from '@/app/store';
import { removeItem, updateQuantity, clearCart } from '@/entities/cart/model/cartSlice';
import { MedicineBoxOutlined } from '@ant-design/icons';
import { Modal } from '@/shared/ui/modal/Modal';
import { useToast } from '@/shared/ui/toast/ToastContext';

const { Title, Text, Paragraph } = Typography;

export const CartPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { items, totalAmount } = useSelector((state: RootState) => state.cart);
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const isDark = themeMode === 'dark';

  const [isRemoveItemModalOpen, setIsRemoveItemModalOpen] = React.useState(false);
  const [itemToRemove, setItemToRemove] = React.useState<string | null>(null);
  const [isClearCartModalOpen, setIsClearCartModalOpen] = React.useState(false);

  const discountThreshold = 1000;
  const discountRate = 0.1; // 10%
  const hasDiscount = totalAmount >= discountThreshold;
  const discountAmount = hasDiscount ? parseFloat((totalAmount * discountRate).toFixed(2)) : 0;
  const finalAmount = totalAmount - discountAmount;

  const handleQuantityChange = (id: string, currentQty: number, change: number, maxStock: number) => {
    const newQty = currentQty + change;
    if (newQty <= 0) {
      confirmRemoveItem(id);
      return;
    }
    if (newQty > maxStock) {
      showToast(`Недостатньо товару на складі. Максимальна кількість: ${maxStock} шт.`, 'warning');
      return;
    }
    dispatch(updateQuantity({ id, quantity: newQty }));
  };

  const confirmRemoveItem = (id: string) => {
    setItemToRemove(id);
    setIsRemoveItemModalOpen(true);
  };

  const handleRemoveItemConfirm = () => {
    if (itemToRemove) {
      dispatch(removeItem(itemToRemove));
      showToast('Товар видалено з кошика', 'success');
      setItemToRemove(null);
    }
  };

  const confirmClearCart = () => {
    setIsClearCartModalOpen(true);
  };

  const handleClearCartConfirm = () => {
    dispatch(clearCart());
    showToast('Кошик очищено', 'success');
  };

  const getMedicineName = (id: string | null) => {
    if (!id) return '';
    const item = items.find((i) => i.medicine.id === id);
    return item ? item.medicine.name : '';
  };

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: '800px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div style={{ marginBottom: '24px' }}>
              <Title level={4} style={{ color: '#2d3436', margin: '0 0 8px 0' }}>
                Ваш кошик порожній
              </Title>
              <Text type="secondary">
                Додайте ліки з каталогу, щоб зробити замовлення.
              </Text>
            </div>
          }
        >
          <Button 
            type="primary" 
            size="large"
            icon={<ShoppingCartOutlined />}
            onClick={() => router.push('/catalog')}
            style={{ 
              backgroundColor: '#00b894', 
              borderColor: '#00b894', 
              borderRadius: '8px', 
              height: '46px',
              fontWeight: 600
            }}
          >
            Перейти до каталогу
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.push('/catalog')}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          Назад до каталогу
        </Button>
      </div>

      <Title level={2} style={{ marginBottom: '32px', color: '#2d3436', fontWeight: 700 }}>
        Кошик покупок
      </Title>

      <Row gutter={[24, 24]}>
        {/* Список товарів ліворуч */}
        <Col xs={24} lg={16}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {items.map((item) => {
              const maxStock = item.medicine.inStock;
              const isMaxReached = item.quantity >= maxStock;

              return (
                <Card 
                  key={item.medicine.id}
                  style={{ borderRadius: '16px', border: '1px solid #f0f0f0', overflow: 'hidden' }}
                  styles={{ body: { padding: '20px' } }}
                >
                  <Row gutter={[16, 16]} align="middle">
                    {/* Фото товару */}
                    <Col xs={8} sm={4}>
                      <div style={{ 
                        height: '80px', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '12px', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        border: '1px solid #f0f0f0'
                      }}>
                        {item.medicine.image ? (
                          <img 
                            src={item.medicine.image} 
                            alt={item.medicine.name} 
                            style={{ maxHeight: '70px', maxWidth: '90%', objectFit: 'contain' }}
                          />
                        ) : (
                          <MedicineBoxOutlined style={{ fontSize: '32px', color: '#b2bec3' }} />
                        )}
                      </div>
                    </Col>

                    {/* Інформація про товар */}
                    <Col xs={16} sm={10}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {item.medicine.manufacturer}
                      </Text>
                      <Title level={5} style={{ margin: '2px 0 6px 0', fontWeight: 600 }}>
                        {item.medicine.name}
                      </Title>
                      <span style={{ fontSize: '13px', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#e8f8f5', color: '#00b894', fontWeight: 500 }}>
                        {item.medicine.category}
                      </span>
                    </Col>

                    {/* Зміна кількості */}
                    <Col xs={14} sm={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d9d9d9', borderRadius: '8px', overflow: 'hidden' }}>
                        <Button 
                          type="text" 
                          icon={<MinusOutlined />} 
                          onClick={() => handleQuantityChange(item.medicine.id, item.quantity, -1, maxStock)}
                          style={{ height: '36px', width: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        />
                        <span style={{ width: '40px', textAlign: 'center', fontWeight: 600, fontSize: '15px' }}>
                          {item.quantity}
                        </span>
                        <Button 
                          type="text" 
                          icon={<PlusOutlined />} 
                          onClick={() => handleQuantityChange(item.medicine.id, item.quantity, 1, maxStock)}
                          disabled={isMaxReached}
                          style={{ height: '36px', width: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        />
                      </div>
                      
                      {isMaxReached && (
                        <Text type="warning" style={{ fontSize: '11px', marginTop: '6px', textAlign: 'center' }}>
                          Досягнуто ліміт складу ({maxStock} шт.)
                        </Text>
                      )}
                    </Col>

                    {/* Ціна та видалення */}
                    <Col xs={10} sm={4} style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#2d3436' }}>
                        {(item.medicine.price * item.quantity).toFixed(2)} грн
                      </div>
                      <Text type="secondary" style={{ fontSize: '12px', marginBottom: '8px' }}>
                        {item.medicine.price.toFixed(2)} грн/шт
                      </Text>
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => confirmRemoveItem(item.medicine.id)}
                        style={{ padding: 0, height: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        Видалити
                      </Button>
                    </Col>
                  </Row>
                </Card>
              );
            })}
          </div>
        </Col>

        {/* Підсумкова панель праворуч */}
        <Col xs={24} lg={8}>
          <Card 
            style={{ 
              borderRadius: '16px', 
              border: '1px solid #f0f0f0', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
              position: 'sticky',
              top: '88px'
            }}
          >
            <Title level={4} style={{ marginBottom: '20px', fontWeight: 700 }}>
              Підсумок замовлення
            </Title>
            
            {!hasDiscount ? (
              <div style={{
                backgroundColor: isDark ? '#11211b' : '#f6ffed',
                border: isDark ? '1px solid #1c3d32' : '#b7eb8f',
                borderRadius: '8px',
                padding: '10px 12px',
                marginBottom: '16px',
                fontSize: '12px',
                color: isDark ? '#39e5c2' : '#389e0d',
                fontWeight: 500,
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}>
                <InfoCircleOutlined style={{ fontSize: '14px' }} />
                <span>Додайте товарів ще на <strong>{(1000 - totalAmount).toFixed(2)} грн</strong>, щоб отримати знижку <strong>10%</strong>!</span>
              </div>
            ) : (
              <div style={{
                backgroundColor: isDark ? '#11211b' : '#f6ffed',
                border: isDark ? '1px solid #1c3d32' : '#b7eb8f',
                borderRadius: '8px',
                padding: '10px 12px',
                marginBottom: '16px',
                fontSize: '12px',
                color: isDark ? '#39e5c2' : '#389e0d',
                fontWeight: 600,
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}>
                <GiftOutlined style={{ fontSize: '14px' }} />
                <span>Ви отримали знижку <strong>10%</strong> на замовлення!</span>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <Text type="secondary">Кількість товарів</Text>
              <Text strong>{items.reduce((sum, item) => sum + item.quantity, 0)} шт.</Text>
            </div>

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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
              <Text style={{ fontSize: '16px', fontWeight: 600 }}>До сплати</Text>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#00b894' }}>
                {finalAmount.toFixed(2)} грн
              </div>
            </div>

            <Button 
              type="primary" 
              size="large" 
              block
              onClick={() => router.push('/checkout')}
              style={{ 
                height: '48px', 
                backgroundColor: '#00b894', 
                borderColor: '#00b894', 
                fontWeight: 600, 
                borderRadius: '8px',
                marginBottom: '12px'
              }}
            >
              Перейти до оформлення
            </Button>

            <Button 
              type="default" 
              danger 
              block 
              onClick={confirmClearCart}
              style={{ borderRadius: '8px', height: '40px' }}
            >
              Очистити кошик
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Модальне вікно для підтвердження видалення окремого товару */}
      <Modal
        isOpen={isRemoveItemModalOpen}
        onClose={() => {
          setIsRemoveItemModalOpen(false);
          setItemToRemove(null);
        }}
        title="Підтвердження видалення"
        confirmText="Видалити"
        cancelText="Скасувати"
        confirmType="danger"
        onConfirm={handleRemoveItemConfirm}
      >
        <p style={{ margin: 0 }}>
          Ви впевнені, що хочете видалити <strong>{getMedicineName(itemToRemove)}</strong> з вашого кошика?
        </p>
      </Modal>

      {/* Модальне вікно для підтвердження очищення кошика */}
      <Modal
        isOpen={isClearCartModalOpen}
        onClose={() => setIsClearCartModalOpen(false)}
        title="Очищення кошика"
        confirmText="Очистити все"
        cancelText="Скасувати"
        confirmType="danger"
        onConfirm={handleClearCartConfirm}
      >
        <p style={{ margin: 0 }}>
          Ви впевнені, що хочете повністю очистити ваш кошик? Цю дію не можна скасувати.
        </p>
      </Modal>
    </div>
  );
};
