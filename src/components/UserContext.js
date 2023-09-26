import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    // Logic to set user data when the user logs in
    setUser(userData);
  };

  const logout = () => {
    // Logic to clear user data when the user logs out
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
