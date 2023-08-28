import React, { useState } from 'react';
import { NavBar, ConfigureApi } from './components';

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

import traitRoutes from './pages/trait_pages/TraitRoutes.js';
import {GoogleLogin} from './components';

// Create a context for managing the parameter
export const ParameterContext = React.createContext();

const App = () =>{
  const [currentUrl, setCurrentUrl] = useState("/home");
  const [userEmail, setUserEmail] = useState("");
  const [dependentId, setDependentId] =  useState(100);
  const [selectedTraitCategory, setSelectedTraitCategory] = useState("");

  const handleChangeUrl = (newUrl) => {
    setCurrentUrl(newUrl);
  };

  var resetUserEmail = () => {
    setUserEmail("");
  };
  console.log("Outer Width : " + window.innerWidth);

  return (
  <BrowserRouter>
  <ParameterContext.Provider value={{ selectedTraitCategory, setSelectedTraitCategory,
  userEmail, dependentId, setDependentId }}>
      <NavBar userLoggedIn={userEmail.length >0 ? true : false}
          resetUserEmail={resetUserEmail}/>
      <Routes>
        <Route exact='true' path="/" Component={Home} />
        <Route path="/Home" Component={Home} />
        <Route path="/About" Component={() => (<About />)} />
        <Route path="/ProfileCreation" Component={ProfileCreation} />
        <Route path="/OAuthCallback" Component={() => (<OAuthCallback setUserEmail={setUserEmail}/>)}/>
        <Route path="/LoginWithGoogle" Component={GoogleLogin} />
        <Route path="/ProfileHome" Component={() => (<ProfileHome userEmail={userEmail} resetUserEmail={resetUserEmail}/>)} />
        <Route path="/DependentProfile" Component={() => (<DependentProfile dependentId={dependentId} />)} />
        <Route path="/ErrorPage" Component={ErrorPage} />
        {traitRoutes.map(route => (
            <Route
              key={route.path}
              path={route.path}
              Component={route.Component}
              exact={route.exact}
            />
          ))}
      </Routes>
    </ParameterContext.Provider>
  </BrowserRouter>
  );
};

export default App;