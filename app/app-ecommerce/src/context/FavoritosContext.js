import React, { createContext, useState, useContext, useEffect } from 'react';

const FavoritosContext = createContext();

const getFavoritosFromLocalStorage = () => {
    const favoritosString = localStorage.getItem("favoritos");
    if (favoritosString) {
        return JSON.parse(favoritosString);
    } else {
        return [];
    }
};

export const FavoritosProvider = ({ children }) => {
    const [favoritos, setFavoritos] = useState(getFavoritosFromLocalStorage());

    const addFavorito = (product) => {
        setFavoritos((prevFavoritos) => [...prevFavoritos, product]);
    };

    const removeFavorito = (productId) => {
        const updatedFavoritos = favoritos.filter((product) => product.id !== productId);
        setFavoritos(updatedFavoritos);
    };

    useEffect(() => {
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
    }, [favoritos]);

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
