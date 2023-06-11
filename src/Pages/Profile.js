import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Header from '../Components/Common/Header';
import Button from '../Components/Common/Button';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { toast } from 'react-toastify';
import Loader from '../Components/Common/Loader';
import PodcastsCard from '../Components/Common/Podcasts/PodcastsCard';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Profile = () => {

  const user = useSelector(state => state.user.user);
  const [podcasts, setPodcasts] = useState([]);
  // console.log(podcasts)

  useEffect(()=>{
    const fetchDocs = async()=>{
      const q = query(
        collection(db,'podcasts'),
        where('createdBy','==',user.uid)
      );
      const querySnapshot = await getDocs(q);
      const docsData = querySnapshot.docs.map((doc)=>({
        id: doc.id,
        ...doc.data(),
      }));
      setPodcasts(docsData);
    };
    if(user){
      fetchDocs();
    }
  },[user])

  const handleLogout = () =>{
    signOut(auth).then(()=>{
      //logout
      toast.success('Logged out Successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
    }).catch(error =>{
      //error occoured
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
    })
  }
  
  if(!user){
    return <Loader />
  }

  return (
    <div>
      <Header />
      <div className="input-wrapper">
        <h1>Profile</h1>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '2rem'
          }}
        >
          <PodcastsCard title={user.name} displayImage={user.profilePic}/>
        </div>
        <h1 style={{marginBottom: '2rem'}}>My Podcasts</h1>
        <div className="podcasts-flex">
          {podcasts.length == 0 ? (
            <p style={{fontSize: '1.2rem'}}>You have zero podasts</p>
          ) : (
            <>
              {podcasts.map((podcast)=>(
                <PodcastsCard
                  key={podcast.id}
                  id={podcast.id}
                  title={podcast.title}
                  displayImage={podcast.displayImage}
                />
              ))}
              
            </>
          )
        }
        </div>
      </div>
      <Button text={'Logout'} onClick={handleLogout}/>
    </div>
  )
}

export default Profile;