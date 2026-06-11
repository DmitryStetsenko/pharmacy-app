'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  Space, 
  Tag, 
  Dropdown, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Tabs, 
  App as AntdApp, 
  Typography,
  Spin
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  ShoppingOutlined,
  MedicineBoxOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  DownOutlined,
  SettingOutlined,
  DollarCircleOutlined,
  EyeOutlined,
  MailOutlined
} from '@ant-design/icons';
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  AdminUser,
  AdminOrder,
} from '@/entities/user/api/adminApi';
import {
  useGetMedicinesQuery,
  useCreateMedicineMutation,
  useUpdateMedicineMutation,
  useDeleteMedicineMutation,
} from '@/entities/medicine/api/medicineApi';
import { Medicine } from '@/entities/medicine/model/types';
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
  const { message } = AntdApp.useApp();
  const { user, isLoading: authLoading } = useSelector((state: RootState) => state.user);
  
  // API Queries & Mutations
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const { data: orders = [], isLoading: ordersLoading } = useGetAdminOrdersQuery();
  const { data: medicinesData, isLoading: medicinesLoading } = useGetMedicinesQuery({ limit: 100 });
  const medicines = medicinesData?.medicines || [];

  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [createMedicine] = useCreateMedicineMutation();
  const [updateMedicine] = useUpdateMedicineMutation();
  const [deleteMedicine] = useDeleteMedicineMutation();

  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  // Modals state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userForm] = Form.useForm();

  const [isMedicineModalOpen, setIsMedicineModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [medicineForm] = Form.useForm();

  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // Redirect non-admins
  React.useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.replace('/');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: '16px' }}>
        <Spin size="large" />
        <p style={{ color: 'var(--text-secondary)' }}>Перевірка доступу...</p>
      </div>
    );
  }

  // --- Handlers ---
  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      await updateOrderStatus({ id, status }).unwrap();
      message.success('Статус замовлення успішно оновлено');
    } catch (err: any) {
      message.error(err?.data?.message || 'Помилка при оновленні статусу');
    }
  };

  const handleOpenUserModal = (userToEdit?: AdminUser) => {
    if (userToEdit) {
      setEditingUser(userToEdit);
      userForm.setFieldsValue({
        name: userToEdit.name,
        email: userToEdit.email,
        role: userToEdit.role,
        password: '', // blank by default when editing
      });
    } else {
      setEditingUser(null);
      userForm.resetFields();
    }
    setIsUserModalOpen(true);
  };

  const handleUserFormSubmit = async (values: any) => {
    try {
      if (editingUser) {
        await updateUser({
          id: editingUser.id,
          body: {
            name: values.name,
            email: values.email,
            role: values.role,
            ...(values.password ? { password: values.password } : {}),
          }
        }).unwrap();
        message.success('Користувача успішно оновлено');
      } else {
        await createUser({
          name: values.name,
          email: values.email,
          role: values.role,
          password: values.password,
        }).unwrap();
        message.success('Користувача успішно створено');
      }
      setIsUserModalOpen(false);
      userForm.resetFields();
      setEditingUser(null);
    } catch (err: any) {
      message.error(err?.data?.message || 'Помилка збереження користувача');
    }
  };

  const handleDeleteUser = (id: string, email: string) => {
    Modal.confirm({
      title: 'Ви впевнені, що хочете видалити цього користувача?',
      content: `Користувач: ${email}`,
      okText: 'Видалити',
      okType: 'danger',
      cancelText: 'Скасувати',
      onOk: async () => {
        try {
          await deleteUser(id).unwrap();
          message.success('Користувача успішно видалено');
        } catch (err: any) {
          message.error(err?.data?.message || 'Помилка при видаленні користувача');
        }
      }
    });
  };

  const handleOpenMedicineModal = (medicineToEdit?: Medicine) => {
    if (medicineToEdit) {
      setEditingMedicine(medicineToEdit);
      medicineForm.setFieldsValue(medicineToEdit);
    } else {
      setEditingMedicine(null);
      medicineForm.resetFields();
    }
    setIsMedicineModalOpen(true);
  };

  const handleMedicineFormSubmit = async (values: any) => {
    try {
      if (editingMedicine) {
        await updateMedicine({
          id: editingMedicine.id,
          body: values,
        }).unwrap();
        message.success('Медикамент успішно оновлено');
      } else {
        await createMedicine(values).unwrap();
        message.success('Медикамент успішно створено');
      }
      setIsMedicineModalOpen(false);
      medicineForm.resetFields();
      setEditingMedicine(null);
    } catch (err: any) {
      message.error(err?.data?.message || 'Помилка збереження медикаменту');
    }
  };

  const handleDeleteMedicine = (id: string, name: string) => {
    Modal.confirm({
      title: 'Ви впевнені, що хочете видалити цей медикамент?',
      content: `Медикамент: ${name}`,
      okText: 'Видалити',
      okType: 'danger',
      cancelText: 'Скасувати',
      onOk: async () => {
        try {
          await deleteMedicine(id).unwrap();
          message.success('Медикамент успішно видалено');
        } catch (err: any) {
          message.error(err?.data?.message || 'Помилка при видаленні медикаменту');
        }
      }
    });
  };

  const handleViewOrderDetails = (order: AdminOrder) => {
    setSelectedOrder(order);
    setIsOrderDetailsModalOpen(true);
  };

  const handleDeleteOrder = (id: string) => {
    Modal.confirm({
      title: 'Ви впевнені, що хочете видалити це замовлення?',
      content: `ID замовлення: ${id}`,
      okText: 'Видалити',
      okType: 'danger',
      cancelText: 'Скасувати',
      onOk: async () => {
        try {
          await deleteOrder(id).unwrap();
          message.success('Замовлення успішно видалено');
        } catch (err: any) {
          message.error(err?.data?.message || 'Помилка при видаленні замовлення');
        }
      }
    });
  };

  // --- Table Columns ---
  const orderColumns = [
    {
      title: 'ID замовлення',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <Typography.Text copyable code style={{ fontSize: '12px' }}>
          {id.slice(0, 12)}…
        </Typography.Text>
      ),
    },
    {
      title: 'Клієнт',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Сума',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => <strong>{amount.toFixed(2)}₴</strong>,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: AdminOrder) => (
        <Select
          value={status}
          onChange={(newStatus) => handleUpdateOrderStatus(record.id, newStatus)}
          style={{ width: 140 }}
          options={STATUSES.map(s => ({
            value: s,
            label: (
              <span style={{ color: STATUS_LABELS[s].color }}>
                {STATUS_LABELS[s].label}
              </span>
            )
          }))}
        />
      ),
    },
    {
      title: 'Дата',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('uk-UA'),
    },
    {
      title: 'Дії',
      key: 'actions',
      render: (_: any, record: AdminOrder) => {
        const items = [
          {
            key: 'details',
            label: 'Деталі',
            icon: <EyeOutlined />,
            onClick: () => handleViewOrderDetails(record),
          },
          {
            key: 'delete',
            label: 'Видалити',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => handleDeleteOrder(record.id),
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={['click']}>
            <Button size="small">
              Дії <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  const userColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <code style={{ fontSize: '11px' }}>{id}</code>,
    },
    {
      title: "Ім'я",
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
      render: (role: 'user' | 'admin') => (
        <Tag color={role === 'admin' ? 'purple' : 'cyan'}>
          {role === 'admin' ? 'Адміністратор' : 'Користувач'}
        </Tag>
      ),
    },
    {
      title: 'Дата реєстрації',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => date ? new Date(date).toLocaleDateString('uk-UA') : '-',
    },
    {
      title: 'Дії',
      key: 'actions',
      render: (_: any, record: AdminUser) => {
        const items = [
          {
            key: 'edit',
            label: 'Редагувати',
            icon: <EditOutlined />,
            onClick: () => handleOpenUserModal(record),
          },
          {
            key: 'delete',
            label: 'Видалити',
            icon: <DeleteOutlined />,
            danger: true,
            disabled: record.id === user?.id,
            onClick: () => handleDeleteUser(record.id, record.email),
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={['click']}>
            <Button size="small">
              Дії <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  const medicineColumns = [
    {
      title: 'Зображення',
      dataIndex: 'image',
      key: 'image',
      render: (image: string, record: Medicine) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img 
          src={image || '/placeholder-medicine.png'} 
          alt={record.name} 
          style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px' }} 
        />
      ),
    },
    {
      title: 'Назва',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <strong>{name}</strong>,
    },
    {
      title: 'Категорія',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Виробник',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
    },
    {
      title: 'Ціна',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => <span>{price.toFixed(2)}₴</span>,
    },
    {
      title: 'На складі',
      dataIndex: 'inStock',
      key: 'inStock',
      render: (stock: number) => (
        <Tag color={stock > 0 ? 'green' : 'red'}>
          {stock > 0 ? `${stock} шт` : 'Немає в наявності'}
        </Tag>
      ),
    },
    {
      title: 'Дії',
      key: 'actions',
      render: (_: any, record: Medicine) => {
        const items = [
          {
            key: 'edit',
            label: 'Редагувати',
            icon: <EditOutlined />,
            onClick: () => handleOpenMedicineModal(record),
          },
          {
            key: 'delete',
            label: 'Видалити',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => handleDeleteMedicine(record.id, record.name),
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={['click']}>
            <Button size="small">
              Дії <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  // Statistics
  const totalUsers = users.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalMedicines = medicines.length;

  const tabItems = [
    {
      key: 'orders',
      label: (
        <span>
          <ShoppingOutlined /> Замовлення ({orders.length})
        </span>
      ),
      children: (
        <Table
          columns={orderColumns}
          dataSource={orders}
          rowKey="id"
          loading={ordersLoading}
          pagination={{ pageSize: 10 }}
        />
      ),
    },
    {
      key: 'users',
      label: (
        <span>
          <TeamOutlined /> Користувачі ({users.length})
        </span>
      ),
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => handleOpenUserModal()}
            >
              Додати користувача
            </Button>
          </div>
          <Table
            columns={userColumns}
            dataSource={users}
            rowKey="id"
            loading={usersLoading}
            pagination={{ pageSize: 10 }}
          />
        </div>
      ),
    },
    {
      key: 'medicines',
      label: (
        <span>
          <MedicineBoxOutlined /> Медикаменти ({medicines.length})
        </span>
      ),
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => handleOpenMedicineModal()}
            >
              Додати медикамент
            </Button>
          </div>
          <Table
            columns={medicineColumns}
            dataSource={medicines}
            rowKey="id"
            loading={medicinesLoading}
            pagination={{ pageSize: 10 }}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Typography.Title level={2} style={{ margin: 0 }}>
            <SettingOutlined /> Панель адміністратора
          </Typography.Title>
          <Typography.Text type="secondary">
            Управління користувачами, замовленнями та базою товарів
          </Typography.Text>
        </div>
        <Card size="small" variant="borderless" style={{ background: 'transparent' }}>
          <Space>
            <UserOutlined />
            <Typography.Text strong>{user?.name}</Typography.Text>
            <Tag color="purple">Admin</Tag>
          </Space>
        </Card>
      </div>

      {/* Stats Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Користувачів"
              value={totalUsers}
              prefix={<TeamOutlined style={{ color: '#00b894' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Замовлень"
              value={totalOrders}
              prefix={<ShoppingOutlined style={{ color: '#00b894' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Медикаментів"
              value={totalMedicines}
              prefix={<MedicineBoxOutlined style={{ color: '#00b894' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Сума замовлень"
              value={totalRevenue}
              precision={2}
              suffix="₴"
              prefix={<DollarCircleOutlined style={{ color: '#00b894' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Tabs */}
      <Card variant="borderless" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
        <Tabs defaultActiveKey="orders" items={tabItems} />
      </Card>

      {/* Order Details Modal */}
      <Modal
        title={
          <span>
            <ShoppingOutlined /> Деталі замовлення
          </span>
        }
        open={isOrderDetailsModalOpen}
        onCancel={() => {
          setIsOrderDetailsModalOpen(false);
          setSelectedOrder(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setIsOrderDetailsModalOpen(false);
            setSelectedOrder(null);
          }}>
            Закрити
          </Button>
        ]}
        width={700}
      >
        {selectedOrder && (
          <Space direction="vertical" size="large" style={{ width: '100%', marginTop: '16px' }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Typography.Text type="secondary">Клієнт:</Typography.Text>
                <div><strong>{selectedOrder.customerName}</strong></div>
              </Col>
              <Col span={12}>
                <Typography.Text type="secondary">Email / Телефон:</Typography.Text>
                <div>{selectedOrder.email} / {selectedOrder.phone}</div>
              </Col>
              <Col span={12}>
                <Typography.Text type="secondary">Дата створення:</Typography.Text>
                <div>{new Date(selectedOrder.createdAt).toLocaleString('uk-UA')}</div>
              </Col>
              <Col span={12}>
                <Typography.Text type="secondary">Статус:</Typography.Text>
                <div>
                  <Tag color={STATUS_LABELS[selectedOrder.status]?.color}>
                    {STATUS_LABELS[selectedOrder.status]?.label}
                  </Tag>
                </div>
              </Col>
            </Row>

            <Table
              dataSource={selectedOrder.items}
              rowKey="medicineId"
              pagination={false}
              size="small"
              columns={[
                {
                  title: 'ID препарату',
                  dataIndex: 'medicineId',
                  key: 'medicineId',
                  render: (id: string) => <code style={{ fontSize: '11px' }}>{id}</code>,
                },
                {
                  title: 'Назва',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: 'Ціна',
                  dataIndex: 'price',
                  key: 'price',
                  render: (price: number) => <span>{price.toFixed(2)}₴</span>,
                },
                {
                  title: 'Кількість',
                  dataIndex: 'quantity',
                  key: 'quantity',
                },
                {
                  title: 'Сума',
                  key: 'subtotal',
                  render: (_, item) => <strong>{(item.price * item.quantity).toFixed(2)}₴</strong>,
                },
              ]}
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4} align="right">
                      <strong>Загальна сума:</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <strong>{selectedOrder.totalAmount.toFixed(2)}₴</strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </Space>
        )}
      </Modal>

      {/* User Add/Edit Modal */}
      <Modal
        title={
          <span>
            {editingUser ? <EditOutlined /> : <PlusOutlined />} {editingUser ? 'Редагувати користувача' : 'Додати нового користувача'}
          </span>
        }
        open={isUserModalOpen}
        onCancel={() => {
          setIsUserModalOpen(false);
          userForm.resetFields();
          setEditingUser(null);
        }}
        onOk={() => userForm.submit()}
        okText={editingUser ? 'Зберегти' : 'Створити'}
        cancelText="Скасувати"
      >
        <Form
          form={userForm}
          layout="vertical"
          onFinish={handleUserFormSubmit}
          style={{ marginTop: '16px' }}
        >
          <Form.Item
            name="name"
            label="Ім'я"
            rules={[{ required: true, message: 'Будь ласка, введіть ім\'я' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Іван Іванов" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Будь ласка, введіть email' },
              { type: 'email', message: 'Будь ласка, введіть коректний email' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="ivan@example.com" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Пароль"
            rules={[{ required: !editingUser, message: 'Будь ласка, введіть пароль (мінімум 6 символів)', min: 6 }]}
          >
            <Input.Password placeholder={editingUser ? 'Залиште порожнім, якщо не бажаєте змінювати' : 'Введіть пароль'} />
          </Form.Item>
          <Form.Item
            name="role"
            label="Роль"
            initialValue="user"
            rules={[{ required: true, message: 'Будь ласка, виберіть роль' }]}
          >
            <Select
              options={[
                { value: 'user', label: 'Користувач' },
                { value: 'admin', label: 'Адміністратор' }
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Medicine Add/Edit Modal */}
      <Modal
        title={
          <span>
            {editingMedicine ? <EditOutlined /> : <PlusOutlined />} {editingMedicine ? 'Редагувати медикамент' : 'Додати новий медикамент'}
          </span>
        }
        open={isMedicineModalOpen}
        onCancel={() => {
          setIsMedicineModalOpen(false);
          medicineForm.resetFields();
          setEditingMedicine(null);
        }}
        onOk={() => medicineForm.submit()}
        okText={editingMedicine ? 'Зберегти' : 'Створити'}
        cancelText="Скасувати"
        width={600}
      >
        <Form
          form={medicineForm}
          layout="vertical"
          onFinish={handleMedicineFormSubmit}
          style={{ marginTop: '16px' }}
        >
          <Form.Item
            name="name"
            label="Назва препарату"
            rules={[{ required: true, message: 'Будь ласка, введіть назву медикаменту' }]}
          >
            <Input placeholder="Парацетамол" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Опис"
            rules={[{ required: true, message: 'Будь ласка, введіть опис' }]}
          >
            <Input.TextArea rows={3} placeholder="Застосовується для..." />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Ціна (₴)"
                rules={[{ required: true, message: 'Введіть ціну' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} precision={2} placeholder="120.50" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="inStock"
                label="Кількість на складі"
                rules={[{ required: true, message: 'Введіть кількість' }]}
              >
                <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="50" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Категорія"
                rules={[{ required: true, message: 'Введіть категорію' }]}
              >
                <Input placeholder="Знеболювальні" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="manufacturer"
                label="Виробник"
                rules={[{ required: true, message: 'Введіть виробника' }]}
              >
                <Input placeholder="Дарниця" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="image"
            label="URL зображення"
            rules={[{ required: true, message: 'Введіть посилання на зображення' }]}
          >
            <Input placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
