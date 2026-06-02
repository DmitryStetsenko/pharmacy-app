'use client';

import React from 'react';
import { GithubOutlined, BookOutlined } from '@ant-design/icons';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const apiDocsUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000'}/api-docs`;

  return (
    <footer style={{
      backgroundColor: '#2d3436',
      color: '#b2bec3',
      padding: '40px 24px 20px 24px',
      borderTop: '3px solid #00b894',
      fontSize: '14px',
      lineHeight: '1.6'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '40px',
        marginBottom: '40px'
      }}>
        {/* Коротко про проєкт */}
        <div>
          <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
            Аптека <span style={{ color: '#00b894' }}>Здоров'я</span>
          </h3>
          <p style={{ margin: 0 }}>
            Ваш надійний онлайн-провідник у світі здоров'я та краси. Тільки сертифіковані препарати, швидке замовлення та зручне отримання.
          </p>
        </div>

        {/* Швидкі посилання */}
        <div>
          <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
            Навігація
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '8px' }}>
              <a href="/catalog" style={{ color: '#b2bec3', textDecoration: 'none', transition: 'color 0.2s' }}
                 onMouseEnter={(e) => (e.currentTarget.style.color = '#00b894')}
                 onMouseLeave={(e) => (e.currentTarget.style.color = '#b2bec3')}>
                Каталог ліків
              </a>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <a href="/cart" style={{ color: '#b2bec3', textDecoration: 'none', transition: 'color 0.2s' }}
                 onMouseEnter={(e) => (e.currentTarget.style.color = '#00b894')}
                 onMouseLeave={(e) => (e.currentTarget.style.color = '#b2bec3')}>
                Кошик покупця
              </a>
            </li>
          </ul>
        </div>

        {/* Розробка */}
        <div>
          <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
            Розробка
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GithubOutlined style={{ color: '#00b894' }} />
              <a href="https://github.com/DmitryStetsenko/pharmacy-app"
                 target="_blank"
                 rel="noopener noreferrer"
                 style={{ color: '#b2bec3', textDecoration: 'none', transition: 'color 0.2s' }}
                 onMouseEnter={(e) => (e.currentTarget.style.color = '#00b894')}
                 onMouseLeave={(e) => (e.currentTarget.style.color = '#b2bec3')}>
                GitHub Репозиторій
              </a>
            </li>
            <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOutlined style={{ color: '#00b894' }} />
              <a href={apiDocsUrl}
                 target="_blank"
                 rel="noopener noreferrer"
                 style={{ color: '#b2bec3', textDecoration: 'none', transition: 'color 0.2s' }}
                 onMouseEnter={(e) => (e.currentTarget.style.color = '#00b894')}
                 onMouseLeave={(e) => (e.currentTarget.style.color = '#b2bec3')}>
                API Документація (Swagger)
              </a>
            </li>
          </ul>
        </div>

        {/* Контакти та інфо */}
        <div>
          <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
            Університетський проєкт
          </h3>
          <p style={{ margin: 0, fontStyle: 'italic' }}>
            Клієнт-серверний застосунок розроблено в рамках курсового проєкту з вебтехнологій.
          </p>
        </div>
      </div>

      {/* Копірайт */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        borderTop: '1px solid #4a5457',
        paddingTop: '20px',
        textAlign: 'center',
        fontSize: '13px'
      }}>
        <p style={{ margin: 0 }}>
          &copy; {currentYear} Аптека Здоров'я. Усі права захищені.
        </p>
      </div>
    </footer>
  );
};
