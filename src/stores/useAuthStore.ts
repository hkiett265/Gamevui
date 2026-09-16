import { create } from 'zustand';

export interface UserProfile {
  id: string;
  username: string;
  email: string | null;
  avatar: string | null;
  role: string;
  createdAt: string;
}

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'register';

  openLoginModal: () => void;
  openRegisterModal: () => void;
  closeAuthModal: () => void;
  setAuthMode: (mode: 'login' | 'register') => void;

  checkAuth: () => Promise<void>;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, password: string, email?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthModalOpen: false,
  authMode: 'login',

  openLoginModal: () => set({ isAuthModalOpen: true, authMode: 'login' }),
  openRegisterModal: () => set({ isAuthModalOpen: true, authMode: 'register' }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  setAuthMode: (mode) => set({ authMode: mode }),

  checkAuth: async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success && data.user) {
        set({ user: data.user, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch {
      set({ user: null, isLoading: false });
    }
  },

  login: async (identifier, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        set({ user: data.user, isAuthModalOpen: false });
        return { success: true };
      }
      return { success: false, error: data.error || 'Đăng nhập thất bại' };
    } catch (e: any) {
      return { success: false, error: 'Không thể kết nối đến máy chủ' };
    }
  },

  register: async (username, password, email) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email })
      });
      const data = await res.json();
      if (data.success && data.user) {
        set({ user: data.user, isAuthModalOpen: false });
        return { success: true };
      }
      return { success: false, error: data.error || 'Đăng ký thất bại' };
    } catch (e: any) {
      return { success: false, error: 'Không thể kết nối đến máy chủ' };
    }
  },

  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    set({ user: null });
  }
}));
