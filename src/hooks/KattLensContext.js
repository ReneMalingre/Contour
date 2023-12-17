// KattLensContext.js
import React, { createContext, useState, useContext } from 'react';

export const KattLensContext = createContext();

export const KattLensProvider = ({ children }) => {
  const [kattLenses, setKattLenses] = useState({
    lens1: new KattLens(7.7, 0.98, 50, 45, 0, 16.5),
    lens2: new KattLens(7.7, 0.5, 50, 45, 0, 16.5),
  });

  // Function to update a specific lens
  const updateLens = (lensKey, newLensData) => {
    setKattLenses((prevLenses) => ({
      ...prevLenses,
      [lensKey]: newLensData,
    }));
  };

  return (
    <KattLensContext.Provider value={{ kattLenses, updateLens }}>
      {children}
    </KattLensContext.Provider>
  );
};

// Use this hook to access and update KattLenses in any component
export const useKattLenses = () => useContext(KattLensContext);
