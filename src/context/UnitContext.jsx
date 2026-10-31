import { createContext, useContext } from 'react';
import { DEFAULT_UNIT_SYSTEM } from '../constants/units';

// Weather data is always stored in metric; this tells components which unit
// to display, so switching never needs a new API request.
const UnitContext = createContext(DEFAULT_UNIT_SYSTEM);

export const UnitProvider = UnitContext.Provider;

export const useUnitSystem = () => useContext(UnitContext);
