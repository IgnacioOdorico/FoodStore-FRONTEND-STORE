import { create } from 'zustand';

interface HomeState {
  search: string;
  selectedCategory: string;
  setSearch: (s: string) => void;
  setSelectedCategory: (c: string) => void;
  reset: () => void;
}

export const useHomeStore = create<HomeState>((set) => ({
  search: '',
  selectedCategory: '',
  setSearch: (search) => set({ search }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  reset: () => set({ search: '', selectedCategory: '' }),
}));
