'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  AdminUser,
  AdminOrder,
} from '@/entities/user/api/adminApi';
import { RootState } from '@/app/store';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:    { label: 'Очікує',      color: '#f59e0b' },
  processing: { label: 'Обробляється', color: '#3b82f6' },
  completed:  { label: 'Виконано',    color: '#10b981' },
  cancelled:  { label: 'Скасовано',   color: '#ef4444' },
};

const STATUSES = ['pending', 'processing', 'completed', 'cancelled'];

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useSelector((state: RootState) => state.user);
  const [activeTab, setActiveTab] = useState<'users' | 'orders'>('orders');

  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const { data: orders = [], isLoading: ordersLoading } = useGetAdminOrdersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  // Redirect non-admins
  if (!authLoading && (!user || user.role !== 'admin')) {
    router.replace('/');
    return null;
  }

  if (authLoading) {
    return (
      <div style={styles.loadingWrapper}>
        <div style={styles.spinner} />
        <p style={{ color: 'var(--text-secondary)' }}>Перевірка доступу...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>⚙️ Панель адміністратора</h1>
          <p style={styles.subtitle}>Управління користувачами та замовленнями</p>
        </div>
        <div style={styles.adminBadge}>
          <span>👤 {user?.name}</span>
          <span style={styles.roleBadge}>Admin</span>
        </div>
      </div>

      {/* Stats row */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <span style={styles.statNum}>{users.length}</span>
          <span style={styles.statLabel}>Користувачів</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statNum}>{orders.length}</span>
          <span style={styles.statLabel}>Замовлень</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statNum}>
            {orders.filter(o => o.status === 'pending').length}
          </span>
          <span style={styles.statLabel}>Нових</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statNum}>
            {orders.reduce((s, o) => s + o.totalAmount, 0).toFixed(2)}₴
          </span>
          <span style={styles.statLabel}>Сума замовлень</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(activeTab === 'orders' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('orders')}
        >
          📦 Замовлення ({orders.length})
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'users' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('users')}
        >
          👥 Користувачі ({users.length})
        </button>
      </div>

      {/* ORDERS TABLE */}
      {activeTab === 'orders' && (
        <div style={styles.tableWrapper}>
          {ordersLoading ? (
            <p style={{ color: 'var(--text-secondary)', padding: '1rem' }}>Завантаження...</p>
          ) : orders.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', padding: '1rem' }}>Замовлень ще немає.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.theadRow}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Клієнт</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Сума</th>
                  <th style={styles.th}>Статус</th>
                  <th style={styles.th}>Дата</th>
                  <th style={styles.th}>Дії</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: AdminOrder) => (
                  <tr key={order.id} style={styles.tr}>
                    <td style={styles.td}>
                      <code style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {order.id.slice(0, 12)}…
                      </code>
                    </td>
                    <td style={styles.td}>{order.customerName}</td>
                    <td style={styles.td} >{order.email}</td>
                    <td style={styles.td}>
                      <strong>{order.totalAmount.toFixed(2)}₴</strong>
                    </td>
                    <td style={styles.td}>
                      <select
                        value={order.status}
                        style={{
                          ...styles.statusSelect,
                          borderColor: STATUS_LABELS[order.status]?.color,
                          color: STATUS_LABELS[order.status]?.color,
                        }}
                        onChange={(e) =>
                          updateOrderStatus({ id: order.id, status: e.target.value })
                        }
                      >
                        {STATUSES.map(s => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s].label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={styles.td}>
                      {new Date(order.createdAt).toLocaleDateString('uk-UA')}
                    </td>
                    <td style={styles.td}>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => {
                          if (confirm(`Видалити замовлення ${order.id}?`)) {
                            deleteOrder(order.id);
                          }
                        }}
                      >
                        🗑 Видалити
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* USERS TABLE */}
      {activeTab === 'users' && (
        <div style={styles.tableWrapper}>
          {usersLoading ? (
            <p style={{ color: 'var(--text-secondary)', padding: '1rem' }}>Завантаження...</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.theadRow}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Ім&apos;я</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Роль</th>
                  <th style={styles.th}>Зареєстровано</th>
                  <th style={styles.th}>Дії</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u: AdminUser) => (
                  <tr key={u.id} style={styles.tr}>
                    <td style={styles.td}>
                      <code style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {u.id}
                      </code>
                    </td>
                    <td style={styles.td}>{u.name}</td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.rolePill,
                        background: u.role === 'admin' ? 'rgba(139,92,246,0.15)' : 'rgba(16,185,129,0.15)',
                        color: u.role === 'admin' ? '#8b5cf6' : '#10b981',
                      }}>
                        {u.role === 'admin' ? '🔑 Admin' : '👤 User'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {new Date(u.createdAt).toLocaleDateString('uk-UA')}
                    </td>
                    <td style={styles.td}>
                      {u.id !== user?.id ? (
                        <button
                          style={styles.deleteBtn}
                          onClick={() => {
                            if (confirm(`Видалити користувача ${u.email}?`)) {
                              deleteUser(u.id);
                            }
                          }}
                        >
                          🗑 Видалити
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          (ви)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '2rem 1.5rem',
  },
  loadingWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh',
    gap: '1rem',
  },
  spinner: {
    width: 40,
    height: 40,
    border: '3px solid var(--border-color)',
    borderTop: '3px solid var(--primary)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    margin: 0,
    fontSize: '1.75rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  subtitle: {
    margin: '4px 0 0',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
  },
  adminBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
  },
  roleBadge: {
    background: 'rgba(139,92,246,0.15)',
    color: '#8b5cf6',
    padding: '2px 10px',
    borderRadius: '999px',
    fontWeight: 700,
    fontSize: '0.8rem',
    border: '1px solid rgba(139,92,246,0.3)',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statNum: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: 'var(--primary)',
  },
  statLabel: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '1.5rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0',
  },
  tab: {
    padding: '0.6rem 1.25rem',
    borderRadius: '8px 8px 0 0',
    border: '1px solid transparent',
    borderBottom: 'none',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
    marginBottom: '-1px',
  },
  tabActive: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderBottom: '1px solid var(--bg-secondary)',
    color: 'var(--primary)',
  },
  tableWrapper: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem',
  },
  theadRow: {
    borderBottom: '2px solid var(--border-color)',
    background: 'rgba(0,0,0,0.1)',
  },
  th: {
    padding: '0.85rem 1rem',
    textAlign: 'left',
    color: 'var(--text-muted)',
    fontWeight: 600,
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  tr: {
    borderBottom: '1px solid var(--border-color)',
    transition: 'background 0.15s',
  },
  td: {
    padding: '0.85rem 1rem',
    color: 'var(--text-primary)',
    verticalAlign: 'middle',
  },
  statusSelect: {
    background: 'transparent',
    border: '1px solid',
    borderRadius: '6px',
    padding: '3px 8px',
    fontWeight: 600,
    fontSize: '0.82rem',
    cursor: 'pointer',
    outline: 'none',
  },
  deleteBtn: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#ef4444',
    borderRadius: '6px',
    padding: '4px 10px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  rolePill: {
    padding: '3px 10px',
    borderRadius: '999px',
    fontWeight: 600,
    fontSize: '0.8rem',
  },
};
