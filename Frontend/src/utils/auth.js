// Authentication utilities
export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const setAuthenticated = (value) => {
  localStorage.setItem('isAuthenticated', value);
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('walletConnected');
};

export const isWalletConnected = () => {
  return localStorage.getItem('walletConnected') === 'true';
};

export const setWalletConnected = (value) => {
  localStorage.setItem('walletConnected', value);
}; 