import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import RGPBand from '../utils/Classes/RGPBand';
import MultiCurveLens from '../utils/Classes/MultiCurveLens';

export const MultiCurveContext = createContext();

export const MultiCurveProvider = ({ children }) => {
  // Initialize lenses with default bands
  const defaultBands = [
    new RGPBand(true, 'Asphere', 7.7, 7.2, 0, 0, 8),
    new RGPBand(true, 'Asphere', 8.5, 8.0, 0, 0, 0.5),
    new RGPBand(true, 'Asphere', 8.9, 8.4, 0, 0, 0.5),
  ];

  const lens1 = new MultiCurveLens([...defaultBands], 'lens1');
  const lens2 = new MultiCurveLens([...defaultBands], 'lens2');
  const [multiCurveLenses, setMultiCurveLenses] = useState({ lens1, lens2 });

  // Function to update a specific lens band
  const updateBand = (lensKey, bandIndex, newBandData) => {
    setMultiCurveLenses((prevLenses) => {
      const updatedLens = new MultiCurveLens(
        [...prevLenses[lensKey].bands],
        lensKey,
      );
      updatedLens.bands[bandIndex] = newBandData;
      return { ...prevLenses, [lensKey]: updatedLens };
    });
  };

  // Function to add a new band
  const addBand = (lensKey, newBand) => {
    setMultiCurveLenses((prevLenses) => {
      const updatedLens = new MultiCurveLens(
        [...prevLenses[lensKey].bands, newBand],
        lensKey,
      );
      return { ...prevLenses, [lensKey]: updatedLens };
    });
  };

  // Function to remove the last band
  const removeBand = (lensKey) => {
    setMultiCurveLenses((prevLenses) => {
      if (prevLenses[lensKey].bands.length > 3) {
        const updatedLens = new MultiCurveLens(
          prevLenses[lensKey].bands.slice(0, -1),
          lensKey,
        );
        return { ...prevLenses, [lensKey]: updatedLens };
      }
      return prevLenses;
    });
  };

  return (
    <MultiCurveContext.Provider
      value={{ multiCurveLenses, updateBand, addBand, removeBand }}
    >
      {children}
    </MultiCurveContext.Provider>
  );
};

MultiCurveProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
