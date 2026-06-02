import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
}

const getInitialTheme = (): ThemeMode => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme') as ThemeMode;
    if (saved === 'light' || saved === 'dark') return saved;
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'light';
};

const initialState: ThemeState = {
  mode: 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
      }
    },
    toggleTheme(state) {
      const newTheme = state.mode === 'light' ? 'dark' : 'light';
      state.mode = newTheme;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);
      }
    },
    initTheme(state) {
      state.mode = getInitialTheme();
    }
  },
});

export const { setTheme, toggleTheme, initTheme } = themeSlice.actions;
export default themeSlice.reducer;
