import { useContext } from 'react';
import { KattLensContext } from './KattLensContext';

export const useKattLenses = () => useContext(KattLensContext);
