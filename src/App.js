import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './assets/fonts/fonts.css';
import './App.css'

import About from './pages/About';
import ProfileCreation from './pages/ProfileCreation';
import Home from './pages/Home';
import OAuthCallback from './pages/OAuthCallback';
import ErrorPage from './pages/ErrorPage';
import ProfileHome from './pages/ProfileHome';
import DependentProfile from './pages/DependentProfile';

import {GoogleLogin} from './components';


const App = () =>{
  const [currentUrl, setCurrentUrl] = useState("/home");
  const [userEmail, setUserEmail] = useState("");
  

  const handleChangeUrl = (newUrl) => {
    setCurrentUrl(newUrl);
  };

  console.log("outer Width : " + window.innerWidth);

  return (
  <BrowserRouter>
    <Routes>
      <Route exact path="/" Component={Home} />
      <Route path="/Home" Component={Home} handleChangeUrl={handleChangeUrl} />
      <Route path="/About" Component={About} />
      <Route path="/ProfileCreation" Component={ProfileCreation} handleChangeUrl={handleChangeUrl} />
      <Route path="/OAuthCallback" Component={() => (<OAuthCallback setUserEmail={setUserEmail}/>)}/>
      <Route path="/LoginWithGoogle" Component={GoogleLogin} handleChangeUrl={handleChangeUrl} />
      <Route path="/ProfileHome" Component={() => (<ProfileHome userEmail={userEmail}/>)} handleChangeUrl={handleChangeUrl} />
      <Route path="/DependentProfile" Component={() => (<DependentProfile/>)} handleChangeUrl={handleChangeUrl} />
      <Route path="/ErrorPage" Component={ErrorPage} handleChangeUrl={handleChangeUrl} />
    </Routes>
  </BrowserRouter>);
};

export default App