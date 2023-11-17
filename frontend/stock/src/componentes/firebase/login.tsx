import { useEffect } from 'react';
import { auth, googleProvider } from "./firebase";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { signInWithPopup, signOut } from "firebase/auth";
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';

const LoginPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("firebaseToken")) {
            navigate("/componentes/articulos");
        }
    }, []);

    const handleSignIn = async () => {
        try {
            localStorage.removeItem("firebaseToken");

            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();

            localStorage.setItem("firebaseToken", idToken);

            let response = await axios.post("http://localhost:3001/login", { firebaseToken: idToken });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.usuario));

            window.dispatchEvent(new Event("login"));

            navigate("/componentes/articulos");
        } catch (error) {
            console.error('Error en el inicio de sesión con Google: ', error);
        }
    }

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem("firebaseToken");
        } catch (error) {
            console.error('Error al cerrar sesión: ', error);
        }
    }

    return (
        <div className="grid grid-nogutter surface-0 text-800 shadow-2">
            <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
                <section>
                    <span className="block text-6xl font-bold mb-1">Bienvenido!</span>
                    <div className="text-6xl text-primary font-bold mb-3">Lorem ipsum</div>
                    <span className="text-green-500 font-medium">24 nuevos </span>
                    <span className="text-500">desde la ultima visita</span>
                    <p className="mt-0 mb-1 text-900 line-height-3">Aun no te registraste?</p>
                    <p className="text-green-500 mt-0 mb-4 text-900 line-height-3">Hacelo hoy!</p>

                    <Button icon="pi pi-google" className='mr-3' severity='success' label="Sign in with Google" type="button" text outlined rounded raised />
                    <Button label="Live Demo" type="button" text outlined rounded raised />
                </section>
            </div>
            <div className="col-12 md:col-6 overflow-hidden">
                <img src="/demo/images/blocks/hero/hero-1.png" alt="hero-1" className="md:ml-auto block md:h-full" style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)' }} />
            </div>
        </div>
    

        /* < div className='flex align-items-center justify-content-center login' id='login' >
            <div className="flex flex-column align-items-center justify-content-center">
                <div style={{ padding: '0.3rem' }}>
                    <div className="w-full surface-card py-8 px-2 sm:px-8 shadow-2 border-round">

                        <div className="text-center mb-5">
                            <i className="pi pi-user-plus mb-3" style={{ fontSize: '2.5rem' }}></i>
                            <div className="text-900 text-3xl font-medium mb-3">Bienvenido!</div>
                            <span className="text-600 font-medium line-height-3">Aun no te registraste?</span>
                            <a className="font-medium no-underline ml-2 text-blue-500">Hacelo hoy!</a>
                        </div>

                        <div>
                            <div className='my-3 flex justify-content-center'>
                                <Button icon="pi pi-google" label="Sign in with Google" text outlined rounded raised onClick={handleSignIn} className='mx-2' />
                                <Button icon="pi pi-trash" label="Sign out" severity='danger' text outlined rounded raised onClick={handleLogout} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div > */
    );
};

export default LoginPage;
