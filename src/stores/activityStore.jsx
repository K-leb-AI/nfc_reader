import { create } from "zustand";

export const useActivityStore = create((set) => ({
  storeLogs: [],
  loading: false,
  setStoreLogs: (storeLogs) => set({ storeLogs }),
  setLoading: (loading) => set({ loading }),
}));
