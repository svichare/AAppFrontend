import React, { useState, useEffect } from 'react';
import { NavBar, ConfigureApi } from './components';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { BrowserRouter, Route, Routes } from "react-router-dom";
import './assets/fonts/fonts.css';
import './App.css'

import About from './pages/About';
import ProfileCreation from './pages/ProfileCreation';
import Home from './pages/Home';
import Home_2 from './pages/Home_2';
import Help from './pages/Help';
import OAuthCallback from './pages/OAuthCallback';
import ErrorPage from './pages/ErrorPage';
import ProfileHome from './pages/ProfileHome';
import DependentProfile from './pages/DependentProfile';

import traitRoutes from './pages/trait_pages/TraitRoutes.js';
import profileRoutes from './pages/profile_pages/ProfileRoutes.js';
import openAIRoutes from './pages/openai_pages/OpenAIRoutes.js';
import journeyRoutes from './pages/journey_pages/JourneyRoutes.js';
import kbFilterRoutes from './pages/kb_filter_pages/kbFilterRoutes.js';
import groupchatRoutes from './pages/groupchat_pages/groupchatRoutes.js';

import { GoogleLogin } from './components';
import mixpanel from 'mixpanel-browser';
import { gapi } from 'gapi-script';
import { UserProvider } from './components/UserContext';
import { DependentProvider } from './components/DependentContext';

import Conversation from './pages/conversations_pages/Conversation.jsx';
import ConversationsCodeError from './pages/conversations_pages/ConversationsCodeError.jsx';
import FilterThreads from './pages/conversations_pages/FilterThreads.jsx';
import Groups from './pages/conversations_pages/Groups.jsx';


// Create a context for managing the parameter
export const ParameterContext = React.createContext();

const clientId = '201175894539-gte8nppbkqha8j0o40cqe7opmrsgmofo.apps.googleusercontent.com';

const App = () => {
  const [currentUrl, setCurrentUrl] = useState("/home");
  const [userEmail, setUserEmail] = useState("");
  const [userToken, setUserToken] = useState("");
  const [dependentStringId, setDependentStringId] = useState("");
  const [selectedTraitCategory, setSelectedTraitCategory] = useState("");

  mixpanel.init('a709584ba68b4297dce576a32d062ed6', { debug: true, track_pageview: true, persistence: 'localStorage' });

  const handleChangeUrl = (newUrl) => {
    setCurrentUrl(newUrl);
  };

  var resetUserEmail = () => {
    setUserEmail("");
  };
  console.log("Outer Width : " + window.innerWidth);

  useEffect(() => {
    function start() {
      gapi.client.init({
        client_id: clientId,
        scope: "email profile"
      })
    };

    gapi.load('client:auth2', start);
  })

  // Define your custom colors
  const complete = '#B5EFBB';
  const inProgress = '#FDFAB5';
  const notStarted = '#FFDBDB';

  // Create a theme with your custom colors
  const theme = createTheme({
    palette: {
      primary: {
        main: '#94E5FF80',
      },
    },
  });

  // Use the palette.augmentColor method to generate the color tokens for each custom color
  theme.palette.complete = theme.palette.augmentColor({ color: { main: complete } });
  theme.palette.inProgress = theme.palette.augmentColor({ color: { main: inProgress } });
  theme.palette.notStarted = theme.palette.augmentColor({ color: { main: notStarted } });

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <UserProvider>
          <DependentProvider>
            <ParameterContext.Provider value={{
              selectedTraitCategory, setSelectedTraitCategory,
              userEmail, dependentStringId, setDependentStringId, mixpanel, userToken
            }}>
              <NavBar userLoggedIn={userEmail.length > 0 ? true : false}
                resetUserEmail={resetUserEmail} />
              <Routes>
                <Route exact='true' path="/" Component={Home} />
                <Route path="/Home" Component={Home} />
                <Route path="/Home_2" Component={Home_2} />
                <Route path="/Help" Component={Help} />
                <Route path="/About" Component={() => (<About />)} />
                <Route path="/ProfileCreation" Component={ProfileCreation} />
                <Route path="/OAuthCallback" Component={() => (<OAuthCallback setUserEmail={setUserEmail} setUserToken={setUserToken} />)} />
                <Route path="/LoginWithGoogle" Component={GoogleLogin} />
                <Route path="/ProfileHome" Component={() => (<ProfileHome userEmail={userEmail} resetUserEmail={resetUserEmail} />)} />
                <Route path="/DependentProfile" Component={() => (<DependentProfile />)} />
                <Route path="/ErrorPage" Component={ErrorPage} />
                <Route path='/KnowledgeBase' Component={ConversationsCodeError}></Route>
                <Route path='/FilterThreads' Component={FilterThreads}></Route>
                <Route path="/KnowledgeBase/:collectionCode/search?/:query?" element={<Conversation />} />
                {traitRoutes.map(route => (
                  <Route
                    key={route.path}
                    path={route.path}
                    Component={route.Component}
                    exact={route.exact}
                  />
                ))}
                {profileRoutes.map(route => (
                  <Route
                    key={route.path}
                    path={route.path}
                    Component={route.Component}
                    exact={route.exact}
                  />
                ))}
                {openAIRoutes.map(route => (
                  <Route
                    key={route.path}
                    path={route.path}
                    Component={route.Component}
                    exact={route.exact}
                  />
                ))}
                {journeyRoutes.map(route => (
                  <Route
                    key={route.path}
                    path={route.path}
                    Component={route.Component}
                    exact={route.exact}
                  />
                ))}
                {kbFilterRoutes.map(route => (
                  <Route
                    key={route.path}
                    path={route.path}
                    Component={route.Component}
                    exact={route.exact}
                  />
                ))}
                {groupchatRoutes.map(route => (
                  <Route
                    key={route.path}
                    path={route.path}
                    Component={route.Component}
                    exact={route.exact}
                  />
                ))}
              </Routes>
            </ParameterContext.Provider>
          </DependentProvider>
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;