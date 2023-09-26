import { createContext, useContext, useState } from 'react';

const DependentContext = createContext();

export const useDependent = () => {
  return useContext(DependentContext);
};

export const DependentProvider = ({ children }) => {
  const [dependent, setDependent] = useState(null);

  const set_dependent = (dependentData) => {
    // Logic to set user data when the user logs in
    setDependent(dependentData);
  };

  const reset_dependent = () => {
    // Logic to clear user data when the user logs out
    setDependent(null);
  };

  return (
    <DependentContext.Provider value={{ dependent, set_dependent, reset_dependent }}>
      {children}
    </DependentContext.Provider>
  );
};
