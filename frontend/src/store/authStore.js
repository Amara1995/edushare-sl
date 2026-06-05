// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { token, ...userData } = response.data;
          set({ user: userData, token, isLoading: false });
          localStorage.setItem('token', token);
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return {
            success: false,
            error: error.response?.data?.error || 'Login failed',
          };
        }
      },

      register: async (name, email, password, role) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/register', {
            name,
            email,
            password,
            role,
          });
          const { token, ...userData } = response.data;
          set({ user: userData, token, isLoading: false });
          localStorage.setItem('token', token);
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return {
            success: false,
            error: error.response?.data?.error || 'Registration failed',
          };
        }
      },

      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('token');
      },

      getMe: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        set({ isLoading: true });
        try {
          const response = await api.get('/auth/me');
          set({ user: response.data, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

export default useAuthStore;
