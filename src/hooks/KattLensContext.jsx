// KattLensContext.jsx
import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import KattLens from '../utils/Classes/KattLens';

export const KattLensContext = createContext();

export const KattLensProvider = ({ children }) => {
  // Create the lenses
  const lens1 = new KattLens(7.7, 0.98, 50, 45, 0, 16.5, 'lens1', true);

  const lens2 = new KattLens(7.7, 0.5, 50, 45, 0, 16.5, 'lens2', true);

  const [kattLenses, setKattLenses] = useState({ lens1, lens2 });

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

KattLensProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
