import React, { useState } from 'react'
import Header from '../Components/Common/Header'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import InputComponent from '../Components/Common/Input';
import FileInput from '../Components/Common/Input/FileInput';
import Button from '../Components/Common/Button';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import Loader from '../Components/Common/Loader';

const CreateAnEpisode = () => {

    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [audioFile, setAudioFile] = useState();

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const audioFileHandle = (file) => {
        setAudioFile(file)
    }

    const handleSubmit = async () => {
        setLoading(true);
        if (title && desc && audioFile) {
            try {
                const audioRef = ref(
                    storage,
                    `podcast-episodes/${auth.currentUser.uid}/${Date.now()}`
                );
                await uploadBytes(audioRef, audioFile);

                const audioURL = await getDownloadURL(audioRef);

                const episodeData = {
                    title: title,
                    description: desc,
                    audioFile: audioURL
                };

                await addDoc(
                    collection(db, 'podcasts', id, 'episodes'),
                    episodeData
                );

                toast.success('Episode Created Successfully!');
                setLoading(false);
                navigate(`/podcasts/podcast/${id}`);
                setTitle('');
                setDesc('');
                setAudioFile('');

            } catch (e) {
                toast.error(e.message);
                setLoading(false);
            }
        }
        else {
            toast.error('All feilds should be there!');
            setLoading(false);
        }
    }

    return (
        <div>
            <Header />
            <div className="input-wrapper">
                <h1>Create an Episode</h1>
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
                    accept={'audio/*'}
                    id='audio-file-input'
                    fileHandleFunction={audioFileHandle}
                    text={'Upload Audio File'}
                />
                <Button text={loading ? <Loader/> : 'Create Episode'} disabled={loading} onClick={handleSubmit} />
            </div>
        </div>
    )
}

export default CreateAnEpisode