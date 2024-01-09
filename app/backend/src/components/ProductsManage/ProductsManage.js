import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { faEye, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Modal, Form } from 'react-bootstrap';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import './ProductsManage.css'

const ProductsManage = () => {
    const storage = getStorage();
    const urlServer = process.env.REACT_APP_URL_SERVER;
    const [products, setProducts] = useState([]);
    const auth = getAuth();
    const [authenticated, setAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showProgressModal, setShowProgressModal] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [newProduct, setNewProduct] = useState({
        marca: null,
        subcategoria: null,
        categoria: null,
        precio: 0,
        descripcion: null,
        foto: null,
    });

    const items = ['categoria', 'subcategoria', 'marca', 'descripcion', 'foto', 'precio'];


    // Función para abrir el modal de agregar producto
    const handleShowAddModal = () => {
        setShowAddModal(true);
    };

    // Función para cerrar el modal de agregar producto
    const handleCloseAddModal = () => {
        setShowAddModal(false);
    };

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(`${urlServer}/api/products/getAll`);
            setProducts(response.data);
        } catch (error) {
            console.error('Error al obtener la lista de productos:', error);
        } finally {
            setLoading(false);
        }
    }, [urlServer]);


    const handleDeleteProduct = async (uid) => {       
        try {
            const confirmDelete = await Swal.fire({
                title: '¿Estás seguro?',
                text: '¡No podrás revertir esto!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminarlo',
                cancelButtonText: 'Cancelar',
            });

            if (confirmDelete.isConfirmed) {
                const response = await fetch(`${urlServer}/api/products/delete/${uid}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    const responseData = await response.json();
                    // Mostrar SweetAlert de éxito
                    Swal.fire({
                        icon: 'success',
                        title: responseData.message || 'Producto eliminado correctamente',
                    });
                } else {
                    const errorData = await response.json();
                    throw new Error(`Error en la solicitud: ${errorData.error}`);
                }
            }
        } catch (error) {
            console.error('Error al eliminar Producto:', error.message);
            // Puedes manejar otros errores aquí si es necesario
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al eliminar el Producto',
            });
        } finally {
            // Asegurarse de que fetchUsers se ejecute después de eliminar, tanto si hay éxito como si hay un error
            fetchData();
        }
    };

    const handleViewDetails = async (productId) => {
        try {
            // Lógica para obtener detalles de un producto utilizando el controlador
            const response = await axios.get(`http://localhost:8080/api/products/getById/${productId}`);

            const productDetails = response.data;
            console.log('Detalles del producto:', productDetails);
            // Puedes mostrar los detalles en un modal o de la manera que desees
        } catch (error) {
            console.error('Error al obtener detalles del producto:', error);
        }
    };


    const handleAddProduct = async () => {
        try {
            setShowProgressModal(true); // Mostrar modal de progreso
            handleCloseAddModal(false);
            // Subir la imagen al almacenamiento de Firebase
            const imageRef = ref(
                storage,
                `Products/${newProduct.marca}/${newProduct.categoria}/${newProduct.subcategoria}/${newProduct.foto.name}`
            );
            const uploadTask = uploadBytesResumable(imageRef, newProduct.foto); // Change here

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error('Error al cargar la imagen:', error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        const updatedProduct = {
                            ...newProduct,
                            foto: downloadURL,
                        };

                        await axios.post(`${urlServer}/api/products/add`, updatedProduct);
                        fetchData();
                        handleCloseProgressModal();
                    } catch (error) {
                        console.error('Error al agregar el producto:', error);
                    }
                }
            );
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewProduct((prevProduct) => ({
            ...prevProduct,
            foto: file,
        }));
    };


    // eslint-disable-next-line
    const handleShowProgressModal = () => {
        setShowProgressModal(true);
    };

    const handleCloseProgressModal = () => {
        setShowProgressModal(false);
    };




    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                setAuthenticated(user.email === process.env.REACT_APP_MAIL_Admin);
            } else {
                setCurrentUser(null);
                setAuthenticated(false);
            }
        });

        return () => unsubscribe();
    }, [auth]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);



    if (loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
                <div className="loader2"></div>
            </div>
        );
    }


    return (
        <>
            {currentUser && authenticated ? (
                <div className="container mt-5">
                    <h2>Lista de Productos</h2>
                    <Button variant="primary" onClick={handleShowAddModal} className='LinkProfile Agregarproducto'>
                        <FontAwesomeIcon icon={faPlus} /> Agregar Producto
                    </Button>

                    {/* Tabla de productos */}
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                {/* Generar las columnas de la tabla basadas en las claves del primer producto */}
                                {products.length > 0 ? (
                                    items.map((key, index) => (
                                        <th key={index}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
                                    ))
                                ) : (
                                    <th colSpan={items.length + 2}>
                                        <h1>No hay productos para mostrar</h1>
                                    </th>
                                )}
                                <th>Eliminar</th>
                                <th>Detalles</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Generar filas y columnas de la tabla basadas en los productos */}
                            {products.map((product, index) => (
                                <tr key={index}>
                                    {/* Filtrar las columnas basadas en el array 'items' */}
                                    {items.map((key, columnIndex) => (
                                        <td key={columnIndex}>
                                            {key.toLowerCase() === 'foto' ? (
                                                <div>
                                                    <img
                                                        src={product[key.toLowerCase()]}
                                                        alt={product[key.toLowerCase()]}
                                                        style={{ maxWidth: '32px', maxHeight: '32px' }}
                                                    />
                                                </div>
                                            ) : (
                                                product[key.toLowerCase()]
                                            )}

                                        </td>
                                    ))}
                                    
                                    <td>
                                        <Button variant="outline-danger" onClick={() => handleDeleteProduct(product.id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>

                                    </td>
                                    <td>
                                        <Button variant="outline-info" onClick={() => handleViewDetails(product.id)}>
                                            <FontAwesomeIcon icon={faEye} />
                                        </Button>
                                    </td>                                    
                                </tr>
                            ))}
                        </tbody>


                    </table>

                    {/* Modal para agregar producto */}
                    <Modal show={showAddModal} onHide={handleCloseAddModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Agregar Producto</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {/* Formulario para agregar producto */}
                            <Form>
                                <Form.Group className="mb-3" controlId="formName">
                                    <Form.Label>Marca del Producto:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese la Marca del Producto"
                                        name="marca"
                                        value={newProduct.marca}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formName">
                                    <Form.Label>Subcategoría:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese la Subcategoría"
                                        name="subcategoria"
                                        value={newProduct.subcategoria}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formCategory">
                                    <Form.Label>Categoría:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese la categoría"
                                        name="categoria"
                                        value={newProduct.categoria}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formPrice">
                                    <Form.Label>Precio:</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Ingrese el precio"
                                        name="precio"
                                        value={newProduct.precio}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formDescription">
                                    <Form.Label>Descripción:</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Ingrese la descripción"
                                        name="descripcion"
                                        value={newProduct.descripcion}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formImage">
                                    <Form.Group className="mb-3" controlId="formImage">
                                        <Form.Label>Imagen:</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            name='foto'
                                            onChange={handleImageChange}
                                        />

                                    </Form.Group>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseAddModal}>
                                Cerrar
                            </Button>
                            <Button variant="primary" onClick={handleAddProduct} className='LinkProfile'>
                                Guardar Producto
                            </Button>
                        </Modal.Footer>
                    </Modal>


                    <Modal show={showProgressModal} onHide={handleCloseProgressModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Progreso de carga</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>{`Progreso de carga: ${uploadProgress}%`}</p>
                        </Modal.Body>
                    </Modal>


                </div>
            ) : (
                <div className="container inicio ">
                    <h1>No está autorizado a ver esta Página.!!</h1>
                    <img
                        src="https://static.vecteezy.com/system/resources/previews/009/381/293/non_2x/prohibition-sign-clipart-design-illustration-free-png.png"
                        alt="Prohibido"
                        className="Prohibido"
                    />
                </div>
            )}
        </>
    );
};

export default ProductsManage;
