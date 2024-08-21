import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    userRole: '',
  },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userRole = action.payload.userRole;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userRole = '';
    },
  },
});

export const { login, logout } = authSlice.actions;
export const authSliceName = 'auth'; // Export the name
export default authSlice.reducer;