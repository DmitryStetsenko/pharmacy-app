export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
