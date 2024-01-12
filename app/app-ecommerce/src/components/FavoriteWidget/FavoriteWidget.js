import React, { useState } from 'react';

import { Modal } from '@mui/material';
import { useFavoritos } from '../../context/FavoritosContext';
import FavoriteIcon from '@mui/icons-material/Favorite';

import './FavoriteWidget.css';

const FavoriteWidget = () => {
    const { favoritos } = useFavoritos();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="FavoriteWidget" onClick={handleOpenModal}>
                <p>| Mis Favoritos</p>
                {/* <FavoriteIcon className="favorite-icon" /> */}
                {favoritos.length !== 0 ? (
                    <div className='CantidadSpan'>
                        <h4>{favoritos.length}</h4>
                    </div>
                ) : null}
            </div>

            <Modal open={isModalOpen} onClose={handleCloseModal} className='ModalFavoritos'>
                {favoritos.length !== 0 ? (
                    <div className="modal-content">
                        <h2>Productos Favoritos</h2>
                        <hr />
                        <div className='ContenedorFavoritos'>
                            {favoritos.map((product) => (
                                <div key={product.id} className='ItemFavorito'>
                                    <div className='ImagenItemFavorito'>
                                        <img src={product.foto} alt={product.descripcion} />
                                        <p><span>{product.marca} {product.subcategoria}</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <hr />
                        <div className='BotonCerrarFavoritos'>
                            <button onClick={handleCloseModal}>Cerrar</button>
                        </div>
                    </div>
                ) : (
                    <div className="modal-content FavoritosVacios">
                        <div className='BotonCerrarFavoritos'>
                            <button onClick={handleCloseModal}>Cerrar</button>
                        </div>
                        <h2>( No hay productos en favoritos )</h2>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default FavoriteWidget;
