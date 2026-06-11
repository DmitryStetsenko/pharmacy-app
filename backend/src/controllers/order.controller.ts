import { Response } from 'express';
import { validationResult } from 'express-validator';
import { db } from '../data/db';
import { Order, OrderItem, AuthenticatedRequest } from '../types';

export const createOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { customerName, phone, email, items } = req.body;
  const userId = req.user ? req.user.id : null;

  try {
    const orderItems: OrderItem[] = [];
    let totalAmount = 0;

    // Validate items and check stock
    for (const item of items) {
      const medicine = db.medicines.find(m => m.id === item.medicineId);
      if (!medicine) {
        res.status(404).json({ message: `Medicine with ID ${item.medicineId} not found` });
        return;
      }

      if (medicine.inStock < item.quantity) {
        res.status(400).json({ 
          message: `Insufficient stock for ${medicine.name}. Available: ${medicine.inStock}, Requested: ${item.quantity}` 
        });
        return;
      }

      // Deduct stock
      medicine.inStock -= item.quantity;

      const itemTotal = medicine.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        medicineId: medicine.id,
        name: medicine.name,
        price: medicine.price,
        quantity: item.quantity
      });
    }

    // Apply 10% discount if total order amount exceeds 1000 UAH
    let finalAmount = totalAmount;
    if (totalAmount >= 1000) {
      finalAmount = totalAmount * 0.9;
    }

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      userId,
      customerName,
      phone,
      email,
      items: orderItems,
      totalAmount: parseFloat(finalAmount.toFixed(2)),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    db.orders.push(newOrder);

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to place order' });
  }
};

export const getOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    if (req.user.role === 'admin') {
      const { userId } = req.query;
      if (userId) {
        const userOrders = db.orders.filter(o => o.userId === userId);
        res.status(200).json(userOrders);
        return;
      }
      res.status(200).json(db.orders);
      return;
    }

    const userOrders = db.orders.filter(o => o.userId === req.user?.id);
    res.status(200).json(userOrders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve orders' });
  }
};

// GET /orders/:id
export const getOrderById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const order = db.orders.find(o => o.id === id);

  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  // Allow only owner or admin
  if (req.user?.role !== 'admin' && order.userId !== req.user?.id) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  res.status(200).json(order);
};

// PUT /orders/:id — update status (admin only)
export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  const allowed = ['pending', 'processing', 'completed', 'cancelled'];
  if (!allowed.includes(status)) {
    res.status(400).json({ message: `Invalid status. Allowed: ${allowed.join(', ')}` });
    return;
  }

  const order = db.orders.find(o => o.id === id);
  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  order.status = status;
  res.status(200).json(order);
};

// DELETE /orders/:id (admin only)
export const deleteOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const index = db.orders.findIndex(o => o.id === id);

  if (index === -1) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  db.orders.splice(index, 1);
  res.status(200).json({ message: 'Order deleted', id });
};
