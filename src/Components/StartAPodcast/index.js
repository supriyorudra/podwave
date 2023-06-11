import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import InputComponent from '../Common/Input';
import { toast } from 'react-toastify';
import Button from '../Common/Button';
import FileInput from '../Common/Input/FileInput';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../../firebase';
import { addDoc, collection, setDoc } from 'firebase/firestore';
import Loader from '../Common/Loader';

const CreatePodcastForm = () => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [displayImage, setDisplayImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = async () => {

    if (title && desc && displayImage && bannerImage) {
      setLoading(true);
      // 1. upload files ->get downloadable links
      try {
        const bannerImageRef = ref(
          storage, `podcasts/${auth.currentUser.uid}/${Date.now()}`
        );
        await uploadBytes(bannerImageRef, bannerImage);
        const bannerImageUrl = await getDownloadURL(bannerImageRef);

        const displayImageRef = ref(
          storage, `podcasts/${auth.currentUser.uid}/${Date.now()}`
        );
        await uploadBytes(displayImageRef, displayImage);
        const displayImageUrl = await getDownloadURL(displayImageRef);

        const podcastData = {
          title: title,
          description: desc,
          bannerImage: bannerImageUrl,
          displayImage: displayImageUrl,
          createdBy: auth.currentUser.uid,
        };
        const docRef = await addDoc(collection(db, 'podcasts'), podcastData);

        toast.success('Podcast Created Successfully!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setTitle("");
        setDesc('');
        setBannerImage(null);
        setDisplayImage(null);
        setLoading(false);
      } catch (e) {
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
        setLoading(false);
      }


      // 2. create a new doc in a new collection called podcasts
      // 3. save this new podcast episodes states in our podcasts
    }
    else {
      toast.error('Please provide all values!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setLoading(false);
    }
  }

  const displayImageHandle = (file) => {
    setDisplayImage(file)
  }

  const bannerImageHandle = (file) => {
    setBannerImage(file)
  }

  return (
    <>
      <InputComponent
        state={title}
        setState={setTitle}
        placeholder='Title'
        type='text'
        required={true}
      />
      <InputComponent
        state={desc}
        setState={setDesc}
        placeholder='Description'
        type='text'
        required={true}
      />
      <FileInput
        accept={'image/*'}
        id='display-image-input'
        fileHandleFunction={displayImageHandle}
        text={'Display Image Upload'}
      />
      <FileInput
        accept={'image/*'}
        id='banner-image-input'
        fileHandleFunction={bannerImageHandle}
        text={'Banner Image Upload'}
      />
      <Button text={loading ? <Loader/> : 'Create Podcast'} disabled={loading} onClick={handleSubmit} />
    </>
  )
}

export default CreatePodcastForm