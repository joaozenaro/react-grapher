import { useContext } from 'react';
import { ShapesContext } from './ShapesContext';

export const useShapes = () => {
    const context = useContext(ShapesContext);
    if (!context) {
        throw new Error('useShapes must be used within a ShapesProvider');
    }
    return context;
};
