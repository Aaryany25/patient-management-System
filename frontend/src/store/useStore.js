import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const useStore = create((set, get) => ({
  slots: [],
  appointments: [],
  token: localStorage.getItem('doctor_token') || null,
  loading: false,
  error: null,

  fetchSlots: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/slots`);
      set({ slots: res.data.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch slots', loading: false });
    }
  },

  bookAppointment: async (appointmentData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/appointments`, appointmentData);
      // Refresh slots
      await get().fetchSlots();
      set({ loading: false });
      return { success: true, message: res.data.message };
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || 'Failed to book' });
      return { success: false, message: err.response?.data?.message || 'Failed to book' };
    }
  },

  loginDoctor: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/doctor/login`, { username, password });
      const { token } = res.data;
      localStorage.setItem('doctor_token', token);
      set({ token, loading: false });
      return { success: true };
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || 'Login failed' });
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  },

  logoutDoctor: () => {
    localStorage.removeItem('doctor_token');
    set({ token: null, appointments: [] });
  },

  fetchAppointments: async () => {
    const { token } = get();
    if (!token) return;
    
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ appointments: res.data.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch appointments', loading: false });
    }
  }
}));

export default useStore;
