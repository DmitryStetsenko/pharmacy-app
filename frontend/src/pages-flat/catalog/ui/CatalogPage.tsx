'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Row, Col, Card, Radio, Input, Button, Typography, Pagination, Spin, Empty } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useGetMedicinesQuery } from '@/entities/medicine/api/medicineApi';
import { MedicineCard } from '@/entities/medicine/ui/MedicineCard';

const { Title, Text } = Typography;

export const CatalogPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const isDark = themeMode === 'dark';

  const textColor = isDark ? '#f5f5f5' : '#2d3436';
  const cardBorderColor = isDark ? '#303030' : '#f0f0f0';

  // Зчитуємо параметри з URL
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(searchParam);
  const [debouncedSearch, setDebouncedSearch] = useState(searchParam);

  // Дебаунс для пошуку (300мс)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // При зміні фільтрів оновлюємо URL
  const updateUrl = (newParams: { category?: string; search?: string; page?: number }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newParams.category !== undefined) {
      if (newParams.category) params.set('category', newParams.category);
      else params.delete('category');
      params.set('page', '1'); // Скидаємо сторінку при зміні категорії
    }

    if (newParams.search !== undefined) {
      if (newParams.search) params.set('search', newParams.search);
      else params.delete('search');
      params.set('page', '1'); // Скидаємо сторінку при пошуку
    }

    if (newParams.page !== undefined) {
      params.set('page', newParams.page.toString());
    }

    router.push(`/catalog?${params.toString()}`);
  };

  // Оновлюємо поле пошуку, якщо змінився URL (наприклад, перехід з головної)
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Запит до бекенду
  const { data, isLoading, isFetching, error } = useGetMedicinesQuery({
    category: categoryParam || undefined,
    search: debouncedSearch || undefined,
    page: pageParam,
    limit: 6, // Показуємо по 6 товарів на сторінці
  });

  const handleResetFilters = () => {
    setSearchInput('');
    router.push('/catalog');
  };

  const categories = [
    { label: 'Всі форми випуску', value: '' },
    { label: 'Таблетки', value: 'Tablets' },
    { label: 'Капсули', value: 'Capsules' },
    { label: 'Сиропи', value: 'Syrup' },
    { label: 'Мазі', value: 'Ointment' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      <Title level={2} style={{ marginBottom: '32px', color: textColor }}>
        Каталог медикаментів
      </Title>

      <Row gutter={[24, 24]}>
        {/* Панель фільтрів ліворуч */}
        <Col xs={24} lg={6}>
          <Card
            title="Фільтрувати ліки"
            style={{ borderRadius: '16px', border: `1px solid ${cardBorderColor}`, position: 'sticky', top: '88px' }}
            extra={
              <Button type="text" icon={<ReloadOutlined />} onClick={handleResetFilters}>
                Скинути
              </Button>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
              {/* Пошук */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Пошук за назвою</Text>
                <Input
                  placeholder="Введіть назву..."
                  prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    updateUrl({ search: e.target.value });
                  }}
                  allowClear
                />
              </div>

              {/* Категорії */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Форма випуску</Text>
                <Radio.Group
                  value={categoryParam}
                  onChange={(e) => updateUrl({ category: e.target.value })}
                  style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                >
                  {categories.map((cat) => (
                    <Radio key={cat.value} value={cat.value}>
                      {cat.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </div>
            </div>
          </Card>
        </Col>

        {/* Список товарів праворуч */}
        <Col xs={24} lg={18}>
          {isLoading || isFetching ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
              <Spin size="large">
                <div style={{ marginTop: '12px', color: '#00b894' }}>Завантаження товарів...</div>
              </Spin>
            </div>
          ) : error ? (
            <Card style={{ textAlign: 'center', borderRadius: '16px', border: `1px solid ${cardBorderColor}` }}>
              <Empty description="Помилка при завантаженні ліків. Перевірте підключення до бекенду." />
            </Card>
          ) : !data || data.medicines.length === 0 ? (
            <Card style={{ textAlign: 'center', borderRadius: '16px', border: `1px solid ${cardBorderColor}` }}>
              <Empty description="Не знайдено товарів за вибраними фільтрами." />
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
              <Row gutter={[16, 16]}>
                {data.medicines.map((medicine) => (
                  <Col xs={24} sm={12} md={8} key={medicine.id}>
                    <MedicineCard medicine={medicine} />
                  </Col>
                ))}
              </Row>

              {/* Пагінація */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                <Pagination
                  current={data.page}
                  total={data.total}
                  pageSize={6}
                  onChange={(page) => updateUrl({ page })}
                  showSizeChanger={false}
                />
              </div>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};
