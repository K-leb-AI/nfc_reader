import { create } from "zustand";
import { supabase } from "../../superbaseClient";

export const useAuthStore = create((set) => ({
  user: null,
  auth_loading: true,
  profile_loading: true,
  company_profile: null,

  setUser: (user) => {
    set({ user, auth_loading: false });
  },

  setCompanyProfile: (profile) => {
    set({ company_profile: profile, profile_loading: false });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
