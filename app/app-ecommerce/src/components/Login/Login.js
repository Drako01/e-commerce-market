import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { makeStyles, Typography, Button, TextField } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import './Login.css'

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
        marginBottom: '.5rem',
        backgroundColor: 'var(--colour-second)',
    },
    google: {
        marginTop: theme.spacing(2),
        width: '100%',
        marginBottom: '.5rem',
        backgroundColor: 'var(--brick)'
    },
}));

const Login = ({greeting}) => {
    const classes = useStyles();
    const auth = getAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);

    const handleLogin = (event) => {
        event.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                localStorage.setItem("user", JSON.stringify(user));
                Swal.fire({
                    title: `Bienvenido ${user.displayName}`,
                    html: `Gracias por entrar a nuestro E-Commerce`,
                    icon: 'success',
                    didClose: () => {
                        navigate('/');
                    }
                });
            })
            .catch(() => {
                setError()
                Swal.fire('Error', 'Usuario o Contraseña Incorrectos', 'error');
            });
    };

    const handleGoogleLogin = () => {
        signInWithPopup(auth, new GoogleAuthProvider())
            .then((result) => {
                const user = result.user;
                localStorage.setItem("user", JSON.stringify(user));
                Swal.fire({
                    title: `Bienvenido ${user.displayName}`,
                    html: `Gracias por entrar a nuestro E-Commerce`,
                    icon: 'success',
                    didClose: () => {
                        navigate('/');
                    }
                });
            })
            .catch(() => {
                Swal.fire('Error', 'Error al iniciar sesión con Google', 'error');
            });
    };

    return (
        <ThemeProvider theme={theme}>
            <div className="LoginModule">
            <section className='Titulo'>                
                <Typography variant="h1" className='Titular'>{greeting}</Typography>
            </section>
                {error &&
                    <Typography variant="body1">{error}</Typography>
                }
                <form onSubmit={handleLogin} className={classes.cardAdmin}>
                    <TextField
                        type="email"
                        value={email}
                        name="email"
                        className={classes.input}
                        onChange={handleEmailChange}
                        label="Email"
                        variant="outlined"
                        fullWidth
                    />

                    <TextField
                        type="password"
                        value={password}
                        name="password"
                        className={classes.input}
                        onChange={handlePasswordChange}
                        label="Contraseña"
                        variant="outlined"
                        fullWidth
                    />

                    <Button type="submit" variant="contained" color="primary" className={classes.button}>
                        Iniciar sesión
                    </Button>

                    <Button onClick={handleGoogleLogin} variant="contained" color="secondary" className={classes.google}>
                        Iniciar sesión con Google
                    </Button>

                    <Typography variant="body1">
                        ¿No tienes cuenta? <Link to="/signup">Crea una.</Link>
                    </Typography>
                </form>
            </div>
        </ThemeProvider>
    );
};

export default Login;
