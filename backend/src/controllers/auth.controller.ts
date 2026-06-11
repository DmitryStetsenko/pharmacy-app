import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { db } from '../data/db';
import { User, AuthenticatedRequest } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'pharmacy_app_secret_key_123';
const JWT_EXPIRES_IN = '15m'; // Short-lived access token
const REFRESH_JWT_EXPIRES_IN = '7d'; // Long-lived refresh token

// In-memory storage for active refresh tokens and failed login tracking
const refreshTokens = new Set<string>();
const failedLogins = new Map<string, number>();

export const register = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password, name } = req.body;

  try {
    const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      res.status(400).json({ message: 'User with this email already exists' });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser: User = {
      id: `usr_${Date.now()}`,
      email: email.toLowerCase(),
      passwordHash,
      name,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { id: newUser.id },
      JWT_SECRET + '_refresh',
      { expiresIn: REFRESH_JWT_EXPIRES_IN }
    );

    refreshTokens.add(refreshToken);

    res.status(201).json({
      token,
      refreshToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  try {
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Track failed attempt
      const attempts = (failedLogins.get(email.toLowerCase()) || 0) + 1;
      failedLogins.set(email.toLowerCase(), attempts);
      if (attempts >= 3) {
        console.warn(`[SECURITY WARNING] Multiple failed login attempts (${attempts}) for email: ${email} from IP: ${req.ip}`);
      }

      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      // Track failed attempt
      const attempts = (failedLogins.get(email.toLowerCase()) || 0) + 1;
      failedLogins.set(email.toLowerCase(), attempts);
      if (attempts >= 3) {
        console.warn(`[SECURITY WARNING] Multiple failed login attempts (${attempts}) for email: ${email} from IP: ${req.ip}`);
      }

      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    // Reset failed logins count on successful login
    failedLogins.delete(email.toLowerCase());

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      JWT_SECRET + '_refresh',
      { expiresIn: REFRESH_JWT_EXPIRES_IN }
    );

    refreshTokens.add(refreshToken);

    res.status(200).json({
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const user = db.users.find(u => u.id === req.user?.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user profile' });
  }
};

// Admin: list all users (without password hashes)
export const getUsers = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const safeUsers = db.users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      createdAt: u.createdAt
    }));
    res.status(200).json(safeUsers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve users' });
  }
};

// Admin: delete a user by id
export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  if (req.user?.id === id) {
    res.status(400).json({ message: 'Cannot delete your own account' });
    return;
  }

  const index = db.users.findIndex(u => u.id === id);
  if (index === -1) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const deleted = db.users.splice(index, 1)[0];
  res.status(200).json({ message: 'User deleted', id: deleted.id });
};

// POST /api/auth/refresh
export const refresh = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).json({ message: 'Refresh token is required' });
    return;
  }

  if (!refreshTokens.has(refreshToken)) {
    res.status(403).json({ message: 'Invalid or expired refresh token' });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET + '_refresh') as any;
    const user = db.users.find(u => u.id === decoded.id);
    if (!user) {
      res.status(403).json({ message: 'User not found' });
      return;
    }

    const newToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({ token: newToken });
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

// Admin: create a new user (with specific role)
export const createUser = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password, name, role } = req.body;

  try {
    const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      res.status(400).json({ message: 'User with this email already exists' });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser: User = {
      id: `usr_${Date.now()}`,
      email: email.toLowerCase(),
      passwordHash,
      name,
      role: role || 'user',
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);

    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      createdAt: newUser.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user' });
  }
};

// Admin: update an existing user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { id } = req.params;
  const { email, password, name, role } = req.body;

  try {
    const user = db.users.find(u => u.id === id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const emailExists = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        res.status(400).json({ message: 'User with this email already exists' });
        return;
      }
      user.email = email.toLowerCase();
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      user.passwordHash = bcrypt.hashSync(password, salt);
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user' });
  }
};
