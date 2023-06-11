import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SignUpPage from './Pages/SignUpPage';
import Profile from './Pages/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from './slices/userSlice';
import PrivateRoutes from './Components/Common/PrivateRoutes';
import CreateAPodcast from './Pages/CreateAPodcast';
import PodcastsPage from './Pages/PodcastsPage';
import PodcastDetailsPage from './Pages/PodcastDetails';
import CreateAnEpisode from './Pages/CreateAnEpisode';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, (user) =>{
      if(user){
        const unsubscribeSnapshot = onSnapshot(
          doc(db, 'users', user.uid),
          userDoc => {
            if(userDoc.exists()){
              const userData = userDoc.data();
              dispatch(
                setUser({
                  name: userData.name,
                  email: userData.email,
                  uid: userData.uid
                })
              );
            }
          },
          error => {
            console.log('Error fetching user data: ', error);
          }
        );
        return () => unsubscribeSnapshot();
      }
    }) 
    return () => authUnsubscribe(); 
  }, [])
  

  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <Routes>
          <Route path='/' element={<SignUpPage />} />
          <Route element={<PrivateRoutes />}>
            <Route path='/profile' element={<Profile />} />
            <Route path='/create-a-podcast' element={<CreateAPodcast />} />
            <Route path='/podcasts' element={<PodcastsPage />} />
            <Route path='/podcasts/podcast/:id' element={<PodcastDetailsPage />} />
            <Route path='/podcast/:id/create-episode' element={<CreateAnEpisode />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
