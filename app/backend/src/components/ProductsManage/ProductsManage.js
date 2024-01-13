import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faEye, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { auth } from '../../Firebase/firebaseConfig';
import 'sweetalert2/dist/sweetalert2.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Modal, Form } from 'react-bootstrap';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import './ProductsManage.css'

const ProductsManage = () => {
    const storage = getStorage();
    const urlServer = process.env.REACT_APP_URL_SERVER;
    const [products, setProducts] = useState([]);    
    const [authenticated, setAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showProgressModal, setShowProgressModal] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [productDetailsModal, setProductDetailsModal] = useState(null);
    const [editProductModal, setEditProductModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({});
    const [showPricesModal, setShowPricesModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [priceIncrement, setPriceIncrement] = useState(0);
    const [allCategories, setAllCategories] = useState([]);

    const [newProduct, setNewProduct] = useState({
        marca: null,
        subcategoria: null,
        categoria: null,
        precio: 0,
        descripcion: null,
        foto: null,
        stock: null,
    });

    const items = ['categoria', 'subcategoria', 'marca', 'foto', 'precio', 'stock'];


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
            const response = await axios.get(`${urlServer}/api/products/getById/${productId}`);
            const productDetails = response.data;
            setProductDetailsModal(productDetails);
            setCurrentProduct(productDetails);
            setShowDetailsModal(true);
        } catch (error) {
            console.error('Error al obtener detalles del producto:', error);
        } finally {
            fetchData();
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

    const handleEditProduct = (product) => {
        setCurrentProduct(product);
        setEditProductModal(true);
        setShowDetailsModal(false);
    };

    const handleSaveEdit = async () => {
        try {
            const response = await axios.put(`${urlServer}/api/products/update/${currentProduct.id}`, currentProduct);

            if (response.status === 200) {
                // Success: close the modal, show success message, etc.
                setEditProductModal(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Producto editado correctamente',
                });
            } else {
                // Failure: show error message
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error al editar el producto:', error.message);
            // Show an error message using Swal or other means
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al editar el Producto',
            });
        } finally {
            // Additional logic if needed
            fetchData();
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    const handleShowPricesModal = () => {
        setShowPricesModal(true);
    };

    const handleClosePricesModal = () => {
        setShowPricesModal(false);
    };

    const handleApplyPriceIncrement = async () => {
        try {
            // Obtén la lista de productos de la categoría seleccionada
            const response = await axios.get(`${urlServer}/api/products/getByCategory/${selectedCategory}`);
            const productsInCategory = response.data;

            // Aplica el incremento de precio a cada producto
            const updatedProducts = productsInCategory.map((product) => {
                const updatedPrice = parseFloat(product.precio) * (1 + parseFloat(priceIncrement) / 100);
                return {
                    ...product,
                    precio: updatedPrice.toFixed(2), // Redondea a 2 decimales
                };
            });

            // Actualiza los productos en el servidor
            await Promise.all(updatedProducts.map(async (updatedProduct) => {
                await axios.put(`${urlServer}/api/products/update/${updatedProduct.id}`, updatedProduct);
            }));

            // Cierra el modal y vuelve a cargar los productos
            handleClosePricesModal();
            fetchData();
        } catch (error) {
            console.error('Error al aplicar el incremento de precios:', error.message);
            // Puedes manejar el error según tus necesidades
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al aplicar el incremento de precios',
            });
        }
    };

    const fetchAllCategories = useCallback(() => {
        const uniqueCategories = [...new Set(products.map(product => product.categoria))];
        setAllCategories(uniqueCategories);
    }, [products]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user);
                setAuthenticated(user.email === process.env.REACT_APP_MAIL_Admin);
            } else {
                setCurrentUser(null);
                setAuthenticated(false);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        fetchData();
        fetchAllCategories();
    }, [fetchData, fetchAllCategories]);
    

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
                    <Button onClick={handleShowAddModal} className='LinkProfile Agregarproducto'>
                        <FontAwesomeIcon icon={faPlus} /> Agregar Producto
                    </Button>
                    <Button onClick={handleShowPricesModal} className='LinkProfile Agregarproducto'>
                        Precios
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
                                <Form.Group className="mb-3" controlId="formPrice">
                                    <Form.Label>Precio:</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Ingrese el stock"
                                        name="stock"
                                        value={newProduct.stock}
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

                    <Modal show={showDetailsModal && !editProductModal} onHide={() => setShowDetailsModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Detalles del Producto</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {/* Mostrar los detalles del producto aquí */}
                            {productDetailsModal && (
                                <>
                                    <p className='Detalles-Productos'><span>Categoría:</span> {productDetailsModal.categoria}</p>
                                    <p className='Detalles-Productos'><span>Subcategoría:</span> {productDetailsModal.subcategoria}</p>
                                    <p className='Detalles-Productos'><span>Marca:</span> {productDetailsModal.marca}</p>
                                    <p className='Detalles-Productos'><span>Descripción:</span> {productDetailsModal.descripcion}</p>
                                    <p className='Detalles-Productos'><span>Precio: $</span> {productDetailsModal.precio} .-</p>
                                    <div className='userPhotoDiv'>
                                        <img src={productDetailsModal.foto} alt={productDetailsModal.marca} className='Foto-Product' />
                                        <div className='line'></div>
                                    </div>
                                    <p className='Detalles-Productos'><span>Stock:</span> {productDetailsModal.stock}</p>
                                </>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                                Cerrar
                            </Button>
                            <Button variant="primary" onClick={() => handleEditProduct(currentProduct)} className='LinkProfile'>
                                Editar
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={editProductModal} onHide={() => setEditProductModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Editar Producto</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {/* Formulario para editar producto */}
                            <Form>
                                <Form.Group className="mb-3" controlId="formDescription">
                                    <Form.Label>Descripción:</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Ingrese la descripción"
                                        name="descripcion"
                                        value={currentProduct.descripcion}
                                        onChange={handleEditChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formPrice">
                                    <Form.Label>Precio:</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Ingrese el precio"
                                        name="precio"
                                        value={currentProduct.precio}
                                        onChange={handleEditChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formPrice">
                                    <Form.Label>Precio:</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Ingrese el stock"
                                        name="stock"
                                        value={currentProduct.stock}
                                        onChange={handleEditChange}
                                    />
                                </Form.Group>
                            </Form>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setEditProductModal(false)}>
                                Cerrar
                            </Button>
                            <Button variant="primary" onClick={handleSaveEdit} className='LinkProfile'>
                                Guardar Cambios
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showPricesModal} onHide={handleClosePricesModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Manejo de Precios</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3" controlId="formCategory">
                                    <Form.Label>Seleccione la Categoría:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="categoria"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        {allCategories.map((category, index) => (
                                            <option key={index} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formPriceIncrement">
                                    <Form.Label>Incremento de Precio (%):</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Ingrese el incremento de precio"
                                        value={priceIncrement}
                                        onChange={(e) => setPriceIncrement(e.target.value)}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClosePricesModal}>
                                Cerrar
                            </Button>
                            <Button variant="primary" onClick={handleApplyPriceIncrement} className='LinkProfile'>
                                Aplicar Incremento
                            </Button>
                        </Modal.Footer>
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
