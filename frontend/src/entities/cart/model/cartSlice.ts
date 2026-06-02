import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Medicine } from '@/entities/medicine/model/types';

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
}

const loadCartFromStorage = (): CartState => {
  if (typeof window === 'undefined') {
    return { items: [], totalAmount: 0 };
  }
  try {
    const savedCart = localStorage.getItem('pharmacy_cart');
    return savedCart ? JSON.parse(savedCart) : { items: [], totalAmount: 0 };
  } catch (error) {
    return { items: [], totalAmount: 0 };
  }
};

const saveCartToStorage = (state: CartState) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pharmacy_cart', JSON.stringify(state));
  }
};

const initialState: CartState = { items: [], totalAmount: 0 }; // Будемо синхронізувати в клієнтському провайдері для уникнення Hydration Mismatch

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    initializeCart: (state) => {
      const loaded = loadCartFromStorage();
      state.items = loaded.items;
      state.totalAmount = loaded.totalAmount;
    },
    addItem: (state, action: PayloadAction<Medicine>) => {
      const existingItem = state.items.find(item => item.medicine.id === action.payload.id);
      if (existingItem) {
        if (existingItem.quantity < action.payload.inStock) {
          existingItem.quantity += 1;
        }
      } else {
        state.items.push({ medicine: action.payload, quantity: 1 });
      }
      state.totalAmount = parseFloat(state.items.reduce((sum, item) => sum + item.medicine.price * item.quantity, 0).toFixed(2));
      saveCartToStorage(state);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.medicine.id !== action.payload);
      state.totalAmount = parseFloat(state.items.reduce((sum, item) => sum + item.medicine.price * item.quantity, 0).toFixed(2));
      saveCartToStorage(state);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(i => i.medicine.id === action.payload.id);
      if (item && action.payload.quantity > 0 && action.payload.quantity <= item.medicine.inStock) {
        item.quantity = action.payload.quantity;
      }
      state.totalAmount = parseFloat(state.items.reduce((sum, item) => sum + item.medicine.price * item.quantity, 0).toFixed(2));
      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      saveCartToStorage(state);
    }
  }
});

export const { initializeCart, addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
