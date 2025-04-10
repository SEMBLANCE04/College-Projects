import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
  searchModalOpen: false,
  filterModalOpen: false,
  activeFilters: {
    destination: null,
    priceRange: [0, 10000],
    duration: [1, 30],
    difficulty: [],
    dates: null,
  },
  searchQuery: '',
  loading: false,
  theme: localStorage.getItem('theme') || 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },
    toggleSearchModal: (state) => {
      state.searchModalOpen = !state.searchModalOpen;
    },
    closeSearchModal: (state) => {
      state.searchModalOpen = false;
    },
    toggleFilterModal: (state) => {
      state.filterModalOpen = !state.filterModalOpen;
    },
    closeFilterModal: (state) => {
      state.filterModalOpen = false;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setActiveFilters: (state, action) => {
      state.activeFilters = {
        ...state.activeFilters,
        ...action.payload,
      };
    },
    resetFilters: (state) => {
      state.activeFilters = initialState.activeFilters;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
  },
});

export const {
  toggleSidebar,
  closeSidebar,
  toggleSearchModal,
  closeSearchModal,
  toggleFilterModal,
  closeFilterModal,
  setSearchQuery,
  setActiveFilters,
  resetFilters,
  setLoading,
  toggleTheme,
} = uiSlice.actions;

export default uiSlice.reducer;
