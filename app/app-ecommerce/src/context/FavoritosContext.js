import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritosContext = createContext();

export const FavoritosProvider = ({ children }) => {
    const [favoritos, setFavoritos] = useState([]);

    // Cargar favoritos del local storage al montar el componente
    useEffect(() => {
        const storedFavoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
        setFavoritos(storedFavoritos);
    }, []);

    // Update local storage cuando cambian los favoritos
    useEffect(() => {
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
    }, [favoritos]);

    const addFavorito = (product) => {
        setFavoritos((prevFavoritos) => [...prevFavoritos, product]);
    };

    const removeFavorito = (productId) => {
        setFavoritos((prevFavoritos) =>
            prevFavoritos.filter((product) => product.id !== productId)
        );
    };

    return (
        <FavoritosContext.Provider value={{ favoritos, addFavorito, removeFavorito }}>
            {children}
        </FavoritosContext.Provider>
    );
};

export const useFavoritos = () => {
    const context = useContext(FavoritosContext);
    if (!context) {
        throw new Error('useFavoritos must be used within a FavoritosProvider');
    }
    return context;
};
