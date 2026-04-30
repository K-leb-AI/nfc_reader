import { create } from "zustand";

export const useNavStore = create((set) => ({
  activeLink: "dashboard",
  setActiveLink: (link) => {
    set({ activeLink: link });
  },
}));
