import { create } from 'zustand';

export interface PaymentState {
  paymentId: string | null;
  setPaymentId: (id: string | null) => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  paymentId: null,
  setPaymentId: (id) => set({ paymentId: id })
}));
