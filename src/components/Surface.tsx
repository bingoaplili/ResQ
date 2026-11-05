import { createContext, useContext } from 'react';

export type SurfaceMode = 'light' | 'dark';
export const SurfaceContext = createContext<SurfaceMode>('light');
export const useSurface = () => useContext(SurfaceContext);
