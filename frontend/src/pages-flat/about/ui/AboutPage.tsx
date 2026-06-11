'use client';

import React from 'react';
import { Card, Row, Col, Typography, Timeline, Divider } from 'antd';
import { SafetyCertificateOutlined, TeamOutlined, HeartOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';

const { Title, Paragraph, Text } = Typography;

export const AboutPage = () => {
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const isDark = themeMode === 'dark';

  const textColor = isDark ? '#f5f5f5' : '#2d3436';
  const secondaryTextColor = isDark ? '#b2bec3' : '#636e72';
  const cardBorderColor = isDark ? '#303030' : '#f0f0f0';

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px', color: textColor }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <MedicineBoxOutlined style={{ fontSize: '48px', color: '#00b894', marginBottom: '16px' }} />
        <Title level={1} style={{ color: textColor, margin: 0, fontWeight: 800 }}>
          Про Аптеку <span style={{ color: '#00b894' }}>Здоров'я</span>
        </Title>
        <Paragraph style={{ color: secondaryTextColor, fontSize: '16px', marginTop: '12px' }}>
          Ми працюємо для того, щоб якісні та доступні ліки були у кожній домівці.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: '48px' }}>
        <Col xs={24} md={12}>
          <Title level={3} style={{ color: textColor }}>Наша місія</Title>
          <Paragraph style={{ color: secondaryTextColor, fontSize: '15px', lineHeight: '1.6' }}>
            Аптека Здоров'я — це сучасний сервіс швидкого замовлення та доставки сертифікованих медикаментів. 
            Ми об'єднуємо передові технології та фармацевтичну експертизу, щоб забезпечити наших клієнтів 
            найкращими препаратами за доступними цінами.
          </Paragraph>
          <Paragraph style={{ color: secondaryTextColor, fontSize: '15px', lineHeight: '1.6' }}>
            Кожен наш крок спрямований на покращення якості обслуговування, дотримання найвищих стандартів 
            зберігання ліків та спрощення процесу покупки для пацієнтів будь-якого віку.
          </Paragraph>
        </Col>
        <Col xs={24} md={12}>
          <Title level={3} style={{ color: textColor }}>Чому обирають нас</Title>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <SafetyCertificateOutlined style={{ fontSize: '24px', color: '#00b894', marginTop: '4px' }} />
              <div>
                <Text strong style={{ color: textColor, display: 'block' }}>Сертифікація та ліцензії</Text>
                <Text style={{ color: secondaryTextColor }}>Тільки оригінальні препарати від надійних дистриб'юторів.</Text>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <HeartOutlined style={{ fontSize: '24px', color: '#00b894', marginTop: '4px' }} />
              <div>
                <Text strong style={{ color: textColor, display: 'block' }}>Турбота про кожного</Text>
                <Text style={{ color: secondaryTextColor }}>Кваліфіковані консультації та індивідуальний підхід до кожного клієнта.</Text>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <TeamOutlined style={{ fontSize: '24px', color: '#00b894', marginTop: '4px' }} />
              <div>
                <Text strong style={{ color: textColor, display: 'block' }}>Професійна команда</Text>
                <Text style={{ color: secondaryTextColor }}>Наші фармацевти постійно підвищують свою кваліфікацію.</Text>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Divider style={{ borderColor: cardBorderColor }} />

      <Title level={3} style={{ color: textColor, textAlign: 'center', marginBottom: '32px' }}>Історія нашого розвитку</Title>
      
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Timeline
          mode="alternate"
          items={[
            {
              children: <span style={{ color: textColor }}>2024 рік — Заснування першої офлайн аптеки та формування команди експертів.</span>,
              color: '#00b894'
            },
            {
              children: <span style={{ color: textColor }}>2025 рік — Відкриття мережі з 10 аптек та запуск власної лабораторії контролю якості.</span>,
              color: '#00b894'
            },
            {
              children: <span style={{ color: textColor }}>2026 рік — Запуск сучасної онлайн платформи для замовлення ліків та інтеграція клієнт-сервісу.</span>,
              color: '#00b894'
            }
          ]}
        />
      </div>
    </div>
  );
};
