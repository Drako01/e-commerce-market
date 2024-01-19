import { createContext, useState, useContext, useEffect } from 'react';
import Swal from 'sweetalert2';
import { auth } from '../Firebase/firebaseConfig';
const CartContext = createContext('Inicio');

const getCartFromLocalStorage = () => {
    const cartString = localStorage.getItem("cart");
    if (cartString) {
        return JSON.parse(cartString);
    } else {
        return [];
    }
};

const getPurchaseHistoryFromLocalStorage = () => {
    const purchaseHistoryString = localStorage.getItem("purchaseHistory");
    if (purchaseHistoryString) {
        return JSON.parse(purchaseHistoryString);
    } else {
        return [];
    }
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(getCartFromLocalStorage());
    const [purchaseHistory, setPurchaseHistory] = useState(getPurchaseHistoryFromLocalStorage());
    const [userProfile, setUserProfile] = useState(null);
    const urlServer = process.env.REACT_APP_URL_SERVER;

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserProfile(user);
            } else {
                setUserProfile(null);
            }
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (userProfile) {
            const fetchCart = async () => {
                try {
                    const response = await fetch(`${urlServer}/api/cart/getCart/${userProfile.uid}`);
                    if (response.ok) {
                        const cartData = await response.json();
                        setCart(cartData);
                        localStorage.setItem("cart", JSON.stringify(cartData));
                    } else {
                        console.error(`Error fetching cart data: ${response.statusText}`);
                    }
                } catch (error) {
                    console.error('Error fetching cart data:', error.message);
                }
            };

            // Llamar a la función para obtener el carrito del servidor
            fetchCart();
        }
    }, [urlServer, userProfile]);

    const addItem = (productToAdd, quantity) => {
        if (!isInCart(productToAdd.id)) {
            // Actualiza el estado del carrito agregando el producto con su cantidad
            setCart(prev => [...prev, { ...productToAdd, quantity }]);
            Swal.fire({
                title: 'Producto agregado al carrito',
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1200,
                timerProgressBar: true
            });
        } else {
            const updatedCart = cart.map((item) => {
                if (item.id === productToAdd.id) {
                    return { ...item, quantity: item.quantity + quantity };
                }
                return item;
            });
            setCart(updatedCart);

            Swal.fire({
                title: 'Cantidad actualizada en el carrito',
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1200,
                timerProgressBar: true
            });
        }
    };




    const isInCart = (id) => {
        return cart.some(prod => prod.id === id);
    };



    const removeItem = (id) => {
        const updatedCart = cart.filter(prod => prod.id !== id);
        setCart(updatedCart);
    };

    const getTotalQuantity = () => {
        let totalQuantity = 0;

        if (Array.isArray(cart.items)) {
            cart.items.forEach(prod => {
                if (typeof prod.quantity === 'number' && !isNaN(prod.quantity)) {
                    totalQuantity += prod.quantity;
                } else {
                    console.error(`Invalid quantity for product ${prod.id}`);
                }
            });
        }

        return totalQuantity;
    };


    const totalQuantity = getTotalQuantity();

    const getTotalPrice = () => {
        let totalPrice = 0;

        if (Array.isArray(cart.items)) {
            cart.items.forEach(item => {
                const quantity = parseInt(item.quantity, 10);
                const priceAsNumber = parseFloat(item.product.precio);

                if (!isNaN(priceAsNumber) && !isNaN(quantity)) {
                    totalPrice += priceAsNumber * quantity;
                } else {
                    console.error(`Error: Invalid quantity or price for item ${item.product.descripcion}`);
                }
            });
        }

        return totalPrice;
    };



    const totalPrice = getTotalPrice();

    const getItemCount = (productId) => {
        return cart.filter((item) => item.id === productId).reduce((total, item) => total + item.quantity, 0);
    };

    const clearCart = () => {
        setCart([]);
    };

    const addToPurchaseHistory = (purchase) => {
        setPurchaseHistory(prev => [...prev, purchase]);
    };

    const updateQuantity = (productId, newQuantity) => {
        const updatedCart = cart.map((item) => {
            if (item.id === productId) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        setCart(updatedCart);
    };

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem("purchaseHistory", JSON.stringify(purchaseHistory));
    }, [purchaseHistory]);

    return (
        <CartContext.Provider value={{
            cart,
            addItem,
            totalQuantity,
            purchaseHistory,
            addToPurchaseHistory,
            getItemCount,
            totalPrice,
            removeItem,
            isInCart,
            clearCart,
            updateQuantity,
            getTotalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};
