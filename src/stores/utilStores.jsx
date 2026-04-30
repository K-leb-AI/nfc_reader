import { create } from "zustand";

export const useOrderList = create((set) => ({
  orderList: [],
  setOrderList: (listOrUpdater) =>
    set((state) => ({
      orderList:
        typeof listOrUpdater === "function"
          ? listOrUpdater(state.orderList)
          : listOrUpdater,
    })),
  addOrderItem: (id) =>
    set((state) => ({
      orderList: Array.from(new Set([...state.orderList, id])),
    })),
  removeOrderItem: (id) =>
    set((state) => ({
      orderList: state.orderList.filter((item) => item !== id),
    })),
  clearOrderList: () => set({ orderList: [] }),
}));
