import React, { useState } from 'react';
import InputComponent from '../../Common/Input';
import Button from '../../Common/Button'
import { auth, db, storage } from '../../../firebase'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FileInput from '../../Common/Input/FileInput';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const SignupForm = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [fileURL, setFileURL] = useState("");
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const handleSignup = async () => {
        setLoading(true);
        if (password === confirmPassword && password.length >= 6 && fullName && email) {
            try {
                //creating users account
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                const user = userCredential.user;

                //saving user details
                await setDoc(doc(db, 'users', user.uid), {
                    name: fullName,
                    email: user.email,
                    uid: user.uid,
                    profilePic: fileURL
                });

                // set data in redux, call the redux action
                dispatch(setUser({
                    name: fullName,
                    email: user.email,
                    uid: user.uid,
                    profilePic: fileURL
                }));
                setLoading(false);
                toast.success('User has been created!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                navigate('/profile');

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
        else {
            //throw an error
            setLoading(false);
            if (password !== confirmPassword) {
                console.log('password')
                toast.error('Please make sure your password and confirm password matches!', {
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
            else if (password.length < 6) {
                toast.error('Please make sure password is more than 6 digit long!', {
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
    }

    const uploadImage = async (file) => {
        setLoading(true);
        try {
            const imageRef = ref(storage, `profile/${Date.now()}`);
            await uploadBytes(imageRef, file);

            const imageURL = await getDownloadURL(imageRef);
            setFileURL(imageURL);
            setLoading(false);
            toast.success("Image Uploaded!");
        } catch (e) {
            toast.error("Error Occurred!");
        }
    }

    return (
        <>
            <InputComponent
                state={fullName}
                setState={setFullName}
                placeholder='Full Name'
                type='text'
                required={true}
            />
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
            <InputComponent
                state={confirmPassword}
                setState={setConfirmPassword}
                placeholder='Confirm Password'
                type='password'
                required={true}
            />
            <FileInput
            text={'Upload Profile Photo'}
                id={'user-image'}
                fileHandleFunction={uploadImage}
                accept={'image/*'}
            />
            <Button text={loading ? 'Loading...' : 'Signup'} disabled={loading} onClick={handleSignup} />
        </>
    )
}

export default SignupForm