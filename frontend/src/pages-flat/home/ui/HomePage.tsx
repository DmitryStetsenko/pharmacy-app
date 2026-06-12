'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Card, Row, Col, Typography } from 'antd';
import { SearchOutlined, SafetyCertificateOutlined, TrophyOutlined, CarOutlined, RightOutlined, RobotOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';

const { Title, Paragraph } = Typography;

export const HomePage = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const isDark = themeMode === 'dark';

  const textColor = isDark ? '#f5f5f5' : '#2d3436';
  const secondaryTextColor = isDark ? '#b2bec3' : '#636e72';
  const cardBorderColor = isDark ? '#303030' : '#f0f0f0';

  const handleSearch = () => {
    if (searchValue.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchValue.trim())}`);
    } else {
      router.push('/catalog');
    }
  };

  const categories = [
    { title: 'Таблетки', key: 'Tablets', color: '#ffeaa7' },
    { title: 'Капсули', key: 'Capsules', color: '#fab1a0' },
    { title: 'Сиропи', key: 'Syrup', color: '#81ecec' },
    { title: 'Мазі', key: 'Ointment', color: '#ff7675' },
  ];

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Геро-секція */}
      <section style={{
        background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
        color: '#ffffff',
        padding: '80px 24px',
        textAlign: 'center',
        borderBottomLeftRadius: '40px',
        borderBottomRightRadius: '40px',
        boxShadow: '0 10px 30px rgba(0, 184, 148, 0.2)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Title level={1} style={{ color: '#ffffff', fontSize: '42px', fontWeight: 800, marginBottom: '16px' }}>
            Турбота про ваше здоров'я — наш головний пріоритет
          </Title>
          <Paragraph style={{ color: '#e6f7ff', fontSize: '18px', marginBottom: '40px', fontWeight: 400 }}>
            Швидкий пошук, актуальні ціни, лише ліцензовані препарати та зручне отримання в аптеках вашого міста.
          </Paragraph>

          {/* Пошук */}
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: isDark ? '#1f1f1f' : '#ffffff',
            padding: '6px',
            borderRadius: '30px',
            boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            border: isDark ? '1px solid #303030' : 'none'
          }}>
            <Input
              placeholder="Введіть назву ліків (наприклад, Парацетамол)..."
              variant="borderless"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onPressEnter={handleSearch}
              style={{ flex: 1, fontSize: '16px', paddingLeft: '16px', color: textColor }}
            />
            <Button
              type="primary"
              shape="round"
              size="large"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              style={{
                height: '48px',
                backgroundColor: '#00b894',
                borderColor: '#00b894',
                fontSize: '16px',
                fontWeight: 600,
                padding: '0 24px'
              }}
            >
              Знайти
            </Button>
          </div>
        </div>
      </section>

      {/* Переваги сервісу */}
      <section style={{ maxWidth: '1200px', margin: '60px auto 0 auto', padding: '0 24px' }}>
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} md={8}>
            <Card hoverable styles={{ body: { textAlign: 'center', padding: '32px 24px' } }} style={{ borderRadius: '16px', border: `1px solid ${cardBorderColor}` }}>
              <SafetyCertificateOutlined style={{ fontSize: '40px', color: '#00b894', marginBottom: '16px' }} />
              <Title level={4} style={{ marginTop: 0, marginBottom: '12px', fontSize: '18px', color: textColor }}>100% Сертифіковано</Title>
              <Paragraph style={{ color: secondaryTextColor, margin: 0 }}>Усі медикаменти проходять суворий державний контроль та мають сертифікати якості.</Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable styles={{ body: { textAlign: 'center', padding: '32px 24px' } }} style={{ borderRadius: '16px', border: `1px solid ${cardBorderColor}` }}>
              <TrophyOutlined style={{ fontSize: '40px', color: '#00b894', marginBottom: '16px' }} />
              <Title level={4} style={{ marginTop: 0, marginBottom: '12px', fontSize: '18px', color: textColor }}>Найкращі Ціни</Title>
              <Paragraph style={{ color: secondaryTextColor, margin: 0 }}>Ми працюємо напряму з дистриб'юторами, гарантуючи чесну вартість ліків.</Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable styles={{ body: { textAlign: 'center', padding: '32px 24px' } }} style={{ borderRadius: '16px', border: `1px solid ${cardBorderColor}` }}>
              <CarOutlined style={{ fontSize: '40px', color: '#00b894', marginBottom: '16px' }} />
              <Title level={4} style={{ marginTop: 0, marginBottom: '12px', fontSize: '18px', color: textColor }}>Швидке Отримання</Title>
              <Paragraph style={{ color: secondaryTextColor, margin: 0 }}>Забирайте замовлення в найближчій аптеці вже за 30 хвилин після оформлення.</Paragraph>
            </Card>
          </Col>
        </Row>
      </section>

      {/* Швидкі категорії */}
      <section style={{ maxWidth: '1200px', margin: '60px auto 0 auto', padding: '0 24px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '32px', fontSize: '28px', color: textColor }}>
          Популярні категорії товарів
        </Title>
        <Row gutter={[24, 24]}>
          {categories.map((cat) => (
            <Col xs={12} sm={12} md={6} key={cat.key}>
              <Card
                hoverable
                onClick={() => router.push(`/catalog?category=${cat.key}`)}
                styles={{
                  body: {
                    padding: '24px',
                    textAlign: 'center',
                    height: '140px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: isDark 
                      ? `linear-gradient(135deg, ${cat.color}11 0%, ${cat.color}22 100%)`
                      : `linear-gradient(135deg, ${cat.color}22 0%, ${cat.color}44 100%)`
                  }
                }}
                style={{
                  borderRadius: '16px',
                  border: isDark ? `1px solid ${cat.color}33` : `1px solid ${cat.color}66`
                }}
              >
                <span style={{ fontSize: '18px', fontWeight: 700, color: textColor, marginBottom: '8px' }}>
                  {cat.title}
                </span>
                <Button type="text" icon={<RightOutlined />} style={{ color: '#00b894' }}>
                  Перейти
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* Блок ШІ-аналізатора */}
      <section style={{ maxWidth: '1200px', margin: '60px auto 0 auto', padding: '0 24px' }}>
        <Card
          hoverable
          styles={{
            body: {
              padding: '40px',
              borderRadius: '24px',
              background: isDark
                ? 'linear-gradient(135deg, #0f2b26 0%, #151e22 100%)'
                : 'linear-gradient(135deg, #e6fcf5 0%, #f0fdfa 100%)',
              border: isDark ? '1px solid #1a3c35' : '1px solid #c3fae8',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center'
            }
          }}
          style={{
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: isDark ? '0 10px 30px rgba(0, 184, 148, 0.1)' : '0 10px 30px rgba(0, 184, 148, 0.05)'
          }}
          onClick={() => router.push('/symptoms')}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: isDark ? '#1a3c35' : '#c3fae8',
            marginBottom: '20px',
            color: '#00b894'
          }}>
            <RobotOutlined style={{ fontSize: '32px' }} />
          </div>

          <Title level={2} style={{ color: textColor, marginBottom: '16px', fontSize: '28px', fontWeight: 800 }}>
            Інтелектуальний аналізатор симптомів
          </Title>

          <Paragraph style={{ color: secondaryTextColor, fontSize: '16px', maxWidth: '700px', marginBottom: '32px', lineHeight: '1.7' }}>
            Відчуваєте нездужання? Наш тестовий сервіс на базі штучного інтелекту допоможе провести швидку попередню оцінку вашого стану. Оберіть симптоми та отримайте миттєві рекомендації щодо подальших дій та можливих категорій допоміжних засобів.
          </Paragraph>

          <Button 
            type="primary" 
            size="large" 
            icon={<ThunderboltOutlined />} 
            style={{ 
              height: '48px', 
              backgroundColor: '#00b894', 
              borderColor: '#00b894', 
              borderRadius: '24px',
              fontWeight: 600,
              padding: '0 32px',
              fontSize: '16px'
            }}
          >
            Спробувати аналізатор
          </Button>
        </Card>
      </section>
    </div>
  );
};
