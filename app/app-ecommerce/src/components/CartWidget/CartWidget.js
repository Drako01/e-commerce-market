import carrito from '../assets/icons/carro.png';
import { useCart } from '../../context/CartContext';
import { Link, useLocation } from 'react-router-dom';
import { Modal } from '@mui/material';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import './CartWidget.css'
import Boton from '../Boton/Boton'
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';


const CartWidget = () => {
    const { cart, totalQuantity, getTotalPrice, clearCart, removeItem } = useCart();
    const location = useLocation();
    const [lastActivity, setLastActivity] = useState(Date.now());
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCrearCart = () => {
        clearCart()
        localStorage.removeItem('cart');
        handleCloseModal(true)
    }

    const handlePayCart = () => {
        console.log('Se compraron estos productos: ', cart)
    }

    return (
        <>
            {
                (location.pathname === '/history' || location.pathname === '/contact') ?
                    <Link className="delay09 CartWidget None" onMouseMove={handleActivity} onClick={handleOpenModal}>
                        <img src={carrito} className="logo-navbar" alt="icono" />
                        {totalQuantity !== 0 ? (
                            <>
                                <div className='CantidadSpan'>
                                    <h4>{totalQuantity}</h4>
                                </div>
                                <h3><span>Total: </span>${getTotalPrice().toFixed(2)}</h3>
                            </>
                        ) : (
                            <h3><span>( Vacío )</span></h3>
                        )}
                    </Link>
                    :
                    <Link className="delay09 CartWidget" onMouseMove={handleActivity} onClick={handleOpenModal}>
                        <img src={carrito} className="logo-navbar" alt="icono" />
                        {totalQuantity !== 0 ? (
                            <>
                                <div className='CantidadSpan'>
                                    <h4>{totalQuantity}</h4>
                                </div>
                                <h3><span>Total: </span>${getTotalPrice().toFixed(2)}</h3>
                            </>
                        ) : (
                            <h3><span>( Vacío )</span></h3>
                        )}
                    </Link>
            }

            <Modal open={isModalOpen} onClose={handleCloseModal} className='ModalCarrito'>
                {totalQuantity !== 0 ? (
                    <>
                        <div className="modal-content">
                            <h2>Carrito de Compras</h2>
                            <hr />
                            <div className='ContenedorCompra'>
                                {cart.map((product) => (
                                    <div key={product.id} className='ItemsCart'>
                                        <div className='ImagenItemCart'>
                                            <img src={product.foto} alt={product.descripcion} />
                                        
                                            <p><span>{product.marca} {product.subcategoria}</span> - Cantidad: <span>{product.quantity}</span></p>
                                        </div>
                                        <IconButton onClick={() => removeItem(product.id)} aria-label="Eliminar">
                                            <DeleteIcon className='EliminarItem' />
                                        </IconButton>
                                    </div>
                                ))}
                            </div>
                            <hr />
                            <p className='TotalAPagar'>Total: <span>${getTotalPrice().toFixed(2)}</span></p>
                            <div className='BotonesCart'>                            
                            <Boton
                                nombre={'Cerrar'}
                                onClick={handleCloseModal}
                                color={'primary'}
                                variant={'contained'}
                            >
                            </Boton>
                            <Boton
                                nombre={'Vaciar Carrito'}
                                onClick={handleCrearCart}
                                color={'primary'}
                                variant={'contained'}
                                classButton={'classButtonClearCards'}
                            >
                            </Boton>
                            <Boton
                                nombre={'Comprar'}
                                onClick={handlePayCart}
                                color={'primary'}
                                variant={'contained'}
                                classButton={'classButtonCards'}
                            >
                            </Boton>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="modal-content CarritoVacio">
                        <div className='ContenedorDeBotonCerrarX'>
                            <Boton
                                nombre={'X'}
                                onClick={handleCloseModal}
                            ></Boton>
                        </div>

                        <h2>( Carrito Vacío )</h2>
                    </div>
                )}
            </Modal>
        </>
    )
}

export default CartWidget;
