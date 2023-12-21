import { useContext } from 'react';
import { MultiCurveContext } from './MultiCurveContext';

export const useMultiCurveLenses = () => useContext(MultiCurveContext);
