import React, { useState } from 'react';
import InputComponent from '../../Common/Input';
import Button from '../../Common/Button';
import { auth, db, storage } from '../../../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);
        if(email && password){
            try {
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                const user = userCredential.user;
    
                //getting user details
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                const userData = userDoc.data();
    
                // set data in redux, call the redux action
                dispatch(setUser({
                    name: userData.name,
                    email: user.email,
                    uid: user.uid,
                    profilePic: userData.profilePic
                }));
                toast.success('Logged in successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setLoading(false)
                navigate('/profile')
            }
            catch (e) {
                setLoading(false);
                toast.error(e.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
        }
        else{
            setLoading(false);
                toast.error('Make sure email and password are not empty!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
        }
        
    }

    return (
        <>
            <InputComponent
                state={email}
                setState={setEmail}
                placeholder='Email'
                type='email'
                required={true}
            />
            <InputComponent
                state={password}
                setState={setPassword}
                placeholder='Password'
                type='password'
                required={true}
            />
            <Button text={loading ? 'Loading...' : 'Login'} disabled={loading} onClick={handleLogin} />
        </>
    )
}

export default LoginForm;