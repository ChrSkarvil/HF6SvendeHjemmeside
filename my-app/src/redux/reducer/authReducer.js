import { createSlice } from '@reduxjs/toolkit'; // Make sure this line is present

const initialState = (() => {
  const savedUser = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  if (savedUser && token) {
    const user = JSON.parse(savedUser);
    return { isLoggedIn: true, userRole: user.userRole, userId: user.userId, fullName: user.fullName, token };
  }
  return { isLoggedIn: false, userRole: '', userId: '', token: '', fullName: '',  };
})();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userRole = action.payload.userRole;
      state.token = action.payload.token;
      state.fullName = action.payload.fullName;
      // Save to local storage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify({
        email: action.payload.email,
        userRole: action.payload.userRole,
        userId: action.payload.userId,
        fullName: action.payload.fullName
      }));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userRole = '';
      state.userId = '';
      state.token = '';
      state.fullName = '';
      // Clear from local storage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

export const { login, logout } = authSlice.actions;
export const authSliceName = 'auth';
export default authSlice.reducer;
