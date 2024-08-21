import { createSlice } from '@reduxjs/toolkit';

const initialState = (() => {
  const savedUser = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  if (savedUser && token) {
    const user = JSON.parse(savedUser);
    return { isLoggedIn: true, userRole: user.userRole, token };
  }
  return { isLoggedIn: false, userRole: '', token: '' };
})();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userRole = action.payload.userRole;
      state.token = action.payload.token;

      // Save to local storage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify({
        email: action.payload.email,
        userRole: action.payload.userRole
      }));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userRole = '';
      state.token = '';

      // Clear from local storage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

export const { login, logout } = authSlice.actions;
export const authSliceName = 'auth';
export default authSlice.reducer;
