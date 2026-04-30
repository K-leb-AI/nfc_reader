import { create } from "zustand";

export const useEmpStore = create((set) => ({
  employees: [],
  selectedEmployee: {},
  setEmployees: (emps) => {
    set({ employees: emps });
  },
  setSelectedEmployee: (emp) => {
    set({ selectedEmployee: emp });
  },
}));
