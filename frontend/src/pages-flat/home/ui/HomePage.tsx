'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Card, Row, Col, Typography, Space } from 'antd';
import { SearchOutlined, SafetyCertificateOutlined, TrophyOutlined, CarOutlined, RightOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export const HomePage = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    if (searchValue.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchValue.trim())}`);
    } else {
      router.push('/catalog');
    }
  };

  const categories = [
    { title: 'Знеболювальні', key: 'painkillers', color: '#ffeaa7' },
    { title: 'Вітаміни та БАДи', key: 'vitamins', color: '#fab1a0' },
    { title: 'Простуда та грип', key: 'cold', color: '#81ecec' },
    { title: 'Серце та судини', key: 'cardio', color: '#ff7675' },
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
            backgroundColor: '#ffffff',
            padding: '6px',
            borderRadius: '30px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Input
              placeholder="Введіть назву ліків (наприклад, Парацетамол)..."
              bordered={false}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onPressEnter={handleSearch}
              style={{ flex: 1, fontSize: '16px', paddingLeft: '16px' }}
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
            <Card hoverable styles={{ body: { textAlign: 'center', padding: '32px 24px' } }} style={{ borderRadius: '16px', border: '1px solid #f0f0f0' }}>
              <SafetyCertificateOutlined style={{ fontSize: '40px', color: '#00b894', marginBottom: '16px' }} />
              <Title level={4} style={{ marginTop: 0, marginBottom: '12px', fontSize: '18px' }}>100% Сертифіковано</Title>
              <Paragraph style={{ color: '#636e72', margin: 0 }}>Усі медикаменти проходять суворий державний контроль та мають сертифікати якості.</Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable styles={{ body: { textAlign: 'center', padding: '32px 24px' } }} style={{ borderRadius: '16px', border: '1px solid #f0f0f0' }}>
              <TrophyOutlined style={{ fontSize: '40px', color: '#00b894', marginBottom: '16px' }} />
              <Title level={4} style={{ marginTop: 0, marginBottom: '12px', fontSize: '18px' }}>Найкращі Ціни</Title>
              <Paragraph style={{ color: '#636e72', margin: 0 }}>Ми працюємо напряму з дистриб'юторами, гарантуючи чесну вартість ліків.</Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable styles={{ body: { textAlign: 'center', padding: '32px 24px' } }} style={{ borderRadius: '16px', border: '1px solid #f0f0f0' }}>
              <CarOutlined style={{ fontSize: '40px', color: '#00b894', marginBottom: '16px' }} />
              <Title level={4} style={{ marginTop: 0, marginBottom: '12px', fontSize: '18px' }}>Швидке Отримання</Title>
              <Paragraph style={{ color: '#636e72', margin: 0 }}>Забирайте замовлення в найближчій аптеці вже за 30 хвилин після оформлення.</Paragraph>
            </Card>
          </Col>
        </Row>
      </section>

      {/* Швидкі категорії */}
      <section style={{ maxWidth: '1200px', margin: '60px auto 0 auto', padding: '0 24px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '32px', fontSize: '28px', color: '#2d3436' }}>
          Популярні категорії товарів
        </Title>
        <Row gutter={[24, 24]}>
          {categories.map((cat) => (
            <Col xs={12} sm={12} md={6} key={cat.key}>
              <Card
                hoverable
                onClick={() => router.push(`/catalog?category=${cat.title}`)}
                styles={{
                  body: {
                    padding: '24px',
                    textAlign: 'center',
                    height: '140px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: `linear-gradient(135deg, ${cat.color}22 0%, ${cat.color}44 100%)`
                  }
                }}
                style={{
                  borderRadius: '16px',
                  border: `1px solid ${cat.color}66`
                }}
              >
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#2d3436', marginBottom: '8px' }}>
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
    </div>
  );
};
