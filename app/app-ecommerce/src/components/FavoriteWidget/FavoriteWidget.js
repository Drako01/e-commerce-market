import React, { useState } from 'react';
import Boton from '../Boton/Boton';
import { Modal } from '@mui/material';
import { useFavoritos } from '../../context/FavoritosContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Swal from 'sweetalert2';
import './FavoriteWidget.css';

const FavoriteWidget = () => {
    const { favoritos, removeFavorito, clearFavorite } = useFavoritos();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCrearFavorite = () => {
        clearFavorite()
        
        handleCloseModal(true)
        Swal.fire({
            title: 'Confirmación',
            text: '¿Estás seguro de que deseas vaciar Favoritos?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, vaciar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {                
                localStorage.removeItem('favoritos');               
                Swal.fire('Vaciado', 'Favoritos se ha sido vaciado correctamente.', 'success');
            }
        });
    }
    const handleDeleteItem = (productId) => {
        Swal.fire({
            title: 'Confirmación',
            text: '¿Estás seguro de que deseas eliminar este producto de Favoritos?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                removeFavorito(productId);
                localStorage.removeItem('cart');
                Swal.fire('Eliminado', 'El producto ha sido eliminado de Favoritos correctamente.', 'success');
            }
        });
    };

    return (
        <>
            <div className="FavoriteWidget" onClick={handleOpenModal}>
                <p>| Mis Favoritos </p>
                {favoritos.length !== 0 ? (
                    <div className='CantidadSpanFav'>
                        <h4>{favoritos.length}</h4>
                    </div>
                ) : null}
                <FavoriteIcon className="favorite-icon" />
            </div>

            <Modal open={isModalOpen} onClose={handleCloseModal} className='ModalFavoritos'>
                {favoritos.length !== 0 ? (
                    <div className="modal-content">
                        <div className='TextoAlineado'>
                            <h2>Productos Favoritos </h2><FavoriteIcon className="favorite-icon FavHeart" />
                        </div>
                        <hr />
                        <div className='ContenedorFavoritos'>
                            {favoritos.map((product) => (
                                <div key={product.id} className='ItemFavorito'>
                                    <div className='ImagenItemFavorito'>
                                        <img src={product.foto} alt={product.descripcion} />
                                        <p><span>{product.marca} {product.subcategoria}</span></p>
                                    </div>                                    
                                    <IconButton onClick={() => handleDeleteItem(product.id)} aria-label="Eliminar">
                                            <DeleteIcon className='EliminarItem' />
                                        </IconButton>
                                </div>
                            ))}
                        </div>
                        <hr />
                        <div className='BotonCerrarFavoritos'>
                            <Boton
                                nombre={'Cerrar'}
                                onClick={handleCloseModal}
                                color={'primary'}
                                variant={'contained'}
                            />
                            <Boton
                                nombre={'Vaciar Favoritos'}
                                onClick={handleCrearFavorite}
                                color={'primary'}
                                variant={'contained'}
                                classButton={'classButtonClearCards'}
                            ></Boton>
                        </div>
                    </div>
                ) : (
                    <div className="modal-content FavoritosVacios">
                        <div className='ContenedorDeBotonCerrarX'>
                            <Boton
                                nombre={'X'}
                                onClick={handleCloseModal}
                            ></Boton>
                        </div>
                        <h2>( No hay productos en favoritos )</h2>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default FavoriteWidget;
