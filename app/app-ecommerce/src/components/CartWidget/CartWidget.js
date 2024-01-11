import carrito from '../assets/icons/carro.png';
import { useCart } from '../../context/CartContext';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import './CartWidget.css'

const CartWidget = () => {
    const { totalQuantity, getTotalPrice } = useCart();
    const location = useLocation();
    const [lastActivity, setLastActivity] = useState(Date.now());
    const { clearCart } = useCart();

    useEffect(() => {
        const timer = setInterval(() => {
            const elapsed = Date.now() - lastActivity;
            if (elapsed >= 5 * 60000 && totalQuantity > 0) {
                Swal.fire({
                    html: `<h1 style="text-align: center">Tu carrito todavía tiene productos.</h1><br><h2 style="text-align: center">¿Deseas continuar comprando?</h2>`,
                    toast: true,
                    position: 'center',
                    icon: 'question',
                    showCancelButton: true,
                    timer: 90000,
                    timerProgressBar: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        setLastActivity(Date.now());
                    } else {
                        clearCart()
                        localStorage.removeItem('cart');
                        setLastActivity(Date.now());
                    }
                });
            }
        }, 2 * 60000);

        return () => clearInterval(timer);
    }, [lastActivity, totalQuantity, clearCart]);

    const handleActivity = () => {
        setLastActivity(Date.now());
    }

    return (
        <>
            {
                (location.pathname === '/history' || location.pathname === '/contact') ?
                    <Link to={'/cart'} className="delay09 CartWidget None" onMouseMove={handleActivity}>
                        <img src={carrito} className="logo-navbar" alt="icono" />
                        {totalQuantity !== 0 ? (
                            <>
                                <div className='CantidadSpan'>
                                    <h4>{totalQuantity}</h4>
                                </div>
                                <h3><span>Total: </span>${getTotalPrice().toFixed(2)}</h3>
                            </>
                        ) : (
                            <h3><span>Vacío</span></h3>
                        )}
                    </Link>
                    :
                    <Link to={'/cart'} className="delay09 CartWidget" onMouseMove={handleActivity}>
                        <img src={carrito} className="logo-navbar" alt="icono" />
                        {totalQuantity !== 0 ? (
                            <>
                                <div className='CantidadSpan'>
                                    <h4>{totalQuantity}</h4>
                                </div>
                                <h3><span>Total: </span>${getTotalPrice().toFixed(2)}</h3>
                            </>
                        ) : (
                            <h3><span>Vacío</span></h3>
                        )}
                    </Link>
            }
        </>
    )
}

export default CartWidget;