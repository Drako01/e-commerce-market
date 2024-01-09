import React, { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from "firebase/auth";
import Swal from 'sweetalert2';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { makeStyles, Typography, Button, TextField } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import foto from '../../assets/img/people.png';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './Signup.css'

const theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
});

const useStyles = makeStyles((theme) => ({
    cardAdmin: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: theme.spacing(3),
        backgroundColor: '#fff',
        width: '380px',
        marginBottom: '3rem',
        [theme.breakpoints.down('sm')]: {
            width: '380px',
        },
    },
    input: {
        marginBottom: theme.spacing(2),
        width: '100%',
    },
    button: {
        marginTop: theme.spacing(2),
        width: '100%',
    },
}));

const Signup = () => {
    const classes = useStyles();
    const auth = getAuth();
    const storage = getStorage();
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [error, setError] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(null);
    const handleDisplayNameChange = (event) => setDisplayName(event.target.value);
    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);
    const handleRePasswordChange = (event) => setRePassword(event.target.value);
    const handleProfileImageChange = (event) => setProfileImage(event.target.files[0]);
    // Escucha los cambios en la autenticación y actualiza el estado del usuario
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // El usuario está autenticado
                setCurrentUser(user);
            } else {
                // El usuario no está autenticado
                setCurrentUser(null);
            }
        });

        // Asegúrate de desuscribirte cuando el componente se desmonte
        return () => unsubscribe();
    }, [auth]);
    const handleSignup = (event) => {
        event.preventDefault();
        if (password !== rePassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                if (profileImage) {
                    function convertToSlug(text) {
                        return text
                            .toLowerCase() 
                            .replace(/[\s_]+/g, '_') 
                            .replace(/[^\w-]+/g, ''); 
                    }
                    
                    const slug = convertToSlug(user.displayName);
                    const storageRef = ref(storage, `profileImages/${slug}/${user.uid}`);
                    uploadBytes(storageRef, profileImage)
                        .then((snapshot) => {
                            getDownloadURL(storageRef)
                                .then((downloadURL) => {
                                    updateProfile(user, {
                                        displayName: displayName,
                                        photoURL: downloadURL,
                                    })
                                        .then(() => {
                                            localStorage.setItem("user", JSON.stringify(user));
                                            Swal.fire({
                                                title: `Cuenta creada para ${user.email}`,
                                                html: `Gracias por registrarse en nuestro BackEnd`,
                                                icon: 'success',
                                                didClose: () => {
                                                    navigate('/');
                                                }
                                            });
                                        })
                                        .catch((error) => {
                                            setError(error.message);
                                            Swal.fire('Error', error.message, 'error');
                                        });
                                })
                                .catch((error) => {
                                    setError(error.message);
                                    Swal.fire('Error', error.message, 'error');
                                });
                        })
                        .catch((error) => {
                            setError(error.message);
                            Swal.fire('Error', error.message, 'error');
                        });
                } else {
                    updateProfile(user, {
                        displayName: displayName,
                    })
                        .then(() => {
                            localStorage.setItem("user", JSON.stringify(user));
                            Swal.fire({
                                title: `Cuenta creada para ${user.email}`,
                                html: `Gracias por registrarse en nuestro BackEnd`,
                                icon: 'success',
                                didClose: () => {
                                    navigate('/');
                                }
                            });
                        })
                        .catch((error) => {
                            setError(error.message);
                            Swal.fire('Error', error.message, 'error');
                        });
                }
            })
            .catch((error) => {
                setError(error.message);
                Swal.fire('Error', error.message, 'error');
            });
    };

    useEffect(() => {
        if (currentUser ) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    return (
        <ThemeProvider theme={theme} >
            <div className='LoginAndSignup'>
                <Typography variant="h1" className="Mini">Crear cuenta</Typography>
                {error &&
                    <Typography variant="body1">{error}</Typography>
                }
                <form onSubmit={handleSignup} className={classes.cardAdmin}>
                    <img src={foto} alt='Foto de Perfil' className="FotoPerfilNull" />
                    <Typography variant="body1">Ingrese su foto de perfil</Typography>
                    <TextField
                        type="file"
                        onChange={handleProfileImageChange}
                        accept="image/*"
                        className={classes.input}
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        type="text"
                        value={displayName}
                        name="displayName"
                        className={classes.input}
                        onChange={handleDisplayNameChange}
                        label="Ingrese su Nombre de Usuario"
                        variant="outlined"
                        maxLength="30"
                        autoComplete="off"
                        fullWidth
                    />
                    <TextField
                        type="email"
                        value={email}
                        name="email"
                        className={classes.input}
                        onChange={handleEmailChange}
                        label="Ingrese su Email"
                        variant="outlined"
                        autoComplete="off"
                        required
                        fullWidth
                    />
                    <TextField
                        type="password"
                        value={password}
                        name="password"
                        className={classes.input}
                        onChange={handlePasswordChange}
                        label="Ingrese su Password"
                        variant="outlined"
                        required
                        autoComplete="off"
                        fullWidth
                    />

                    <TextField
                        type="password"
                        value={rePassword}
                        name="rePassword"
                        className={classes.input}
                        onChange={handleRePasswordChange}
                        label="Confirme su Password"
                        variant="outlined"
                        required
                        autoComplete="off"
                        fullWidth
                    />

                    <Button type="submit" variant="contained" color="primary" className={classes.button}>
                        Crear cuenta
                    </Button>

                    <Typography variant="body1">
                        Ya tienes cuenta? <RouterLink to="/login">Inicia Sesión.</RouterLink>
                    </Typography>
                </form>
            </div>
        </ThemeProvider>
    );
};

export default Signup;
