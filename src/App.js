import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Link, useParams } from "react-router-dom";

import './App.css'

import ProfileCreation from './pages/ProfileCreation';
import Home from './pages/Home';
import OAuthCallback from './pages/OAuthCallback';

import {GoogleLogin} from './components';


const App = () =>{
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const [currentUrl, setCurrentUrl] = useState("/home");

  const handleChangeUrl = (newUrl) => {
    setCurrentUrl(newUrl);
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 700);
    };

    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  console.log("outer Width : " + window.innerWidth);

  if (!isLargeScreen) {
    return (
      <div fontFamily="Consolas, Arial, Helvetica, sans-serif">
        <p>Text heavy website. Please use larger screen to access.</p>
        <p>Or turn your phone to landscape mode. But goodluck typing in any of the text boxes! </p>
      </div>
    );
  } else {
    return (
    <BrowserRouter>
      <nav>
        <ul>
          <li>
            <Link to="/Home">Home</Link>
          </li>
          <li>
            <Link to="/ProfileCreation">Profile Creation</Link>
          </li>
          <li>
            <Link to="/OAuthCallback">Call Back from auth tools</Link>
          </li>
          <li>
            <Link to="/LoginWithGoogle">Login with Google</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/Home" Component={Home} handleChangeUrl={handleChangeUrl} />
        <Route path="/ProfileCreation" Component={ProfileCreation} handleChangeUrl={handleChangeUrl}/>
        <Route path="/OAuthCallback" Component={OAuthCallback} />
        <Route path="/LoginWithGoogle" Component={GoogleLogin} handleChangeUrl={handleChangeUrl}/>
      </Routes>
    </BrowserRouter>);
  }
};

export default App