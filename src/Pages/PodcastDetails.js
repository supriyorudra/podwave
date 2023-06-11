import React, { useEffect, useState } from 'react'
import Header from '../Components/Common/Header'
import { useNavigate, useParams } from 'react-router-dom'
import { collection, doc, getDoc, onSnapshot, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { toast } from 'react-toastify';
import Button from '../Components/Common/Button';
import EpisodeData from '../Components/Common/Podcasts/PodcastsCard/EpidoseData';
import AudioPlayer from '../Components/Common/Podcasts/AudioPlayer';

const PodcastDetailsPage = () => {
    const { id } = useParams();
    const [podcast, setPodcast] = useState({});
    const [episodes, setEpisodes] = useState([]);
    const [playingFile, setPlayingFile] = useState("");
    const navigate = useNavigate();

    const getData = async () => {
        try {
            const docRef = doc(db, 'podcasts', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setPodcast({ id: id, ...docSnap.data() })
            }
            else {
                toast.error('No Such Podcast!')
                navigate('/podcasts')
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (id) {
            getData();
        }
    }, [id]);

    useEffect(()=>{
        const unsubscribe = onSnapshot(
            query(collection(db, 'podcasts', id, 'episodes')),
            querySnapshot =>{
                const episodesData = [];
                querySnapshot.forEach(doc =>{
                    episodesData.push({id:doc.id, ...doc.data()});
                });
                setEpisodes(episodesData);
            },
            error =>{
                console.log('Error fetching episodes: ', error)
            }
        );
        return () => unsubscribe();
    },[id])

    return (
        <div>
            <Header />
            <div className="input-wrapper" style={{ marginTop: '2rem' }}>
                {podcast.id && (
                    <>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%'
                        }}>
                            <h1 className='podcast-title-heading'>{podcast.title}</h1>
                            {podcast.createdBy == auth.currentUser.uid && (
                                <Button
                                    style={{ margin: '0', width: '200px' }}
                                    text={'Create Episode'}
                                    onClick={() => navigate(`/podcast/${id}/create-episode`)

                                } />
                            )}

                        </div>

                        <div className="banner-wrapper">
                            <img src={podcast.bannerImage} alt={podcast.title} />
                        </div>
                        <p className='podcast-description'>{podcast.description}</p>
                        <h1 className='podcast-title-heading'>Episodes</h1>
                        {episodes.length > 0 ? <>{episodes.map((episode, index)=>{
                            return <EpisodeData key={index} index={index+1} title={episode.title} description={episode.description} audioFile={episode.audioFile} onClick={file => setPlayingFile(file)} />
                        })}</>: <p>No Episodes</p>}

                    </>
                )
                }
            </div>
                {playingFile && <AudioPlayer audioSrc={playingFile} image={podcast.displayImage}/>}
        </div>
    )
}

export default PodcastDetailsPage