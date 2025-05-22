// Token management
export const getToken = () => {
  return localStorage.getItem('fittrack_token');
};

export const setToken = (token) => {
  localStorage.setItem('fittrack_token', token);
};

export const removeToken = () => {
  localStorage.removeItem('fittrack_token');
};

// User management
export const getUser = () => {
  const userStr = localStorage.getItem('fittrack_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const setUser = (user) => {
  localStorage.setItem('fittrack_user', JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem('fittrack_user');
};

// Auth status
export const isAuthenticated = () => {
  return !!getToken();
};

// Logout helper
export const logout = () => {
  removeToken();
  removeUser();
};

export default { getToken, setToken, removeToken, getUser, setUser, removeUser, isAuthenticated, logout };