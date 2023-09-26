import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
// import logo from '../../assets/logo/svg_logo.svg';
import sp_logo from '../../assets/logo/g_y_b.png';
// import home_g_y_b from '../../assets/images/home_g.png';
// import login_g_y_b from '../../assets/images/login_g.png';
// import about_g_y_b from '../../assets/images/about_g.png';
import '../../assets/fonts/fonts.css';
import { ParameterContext } from '../../App';

import {LoginWithGoogle, LogoutWithGoogle} from '../';
import { useUser } from '../UserContext';

import './NavBar.css';

const Navbar = ({userLoggedIn, resetUserEmail}) => {
  const navigate = useNavigate();
  const [toggleMenu, setToggleMenu] = useState(false);

const handleLoginWithGoogle = () => {
    const redirectUrlFromEnv = process.env.REACT_APP_OAUTH_REDIRECT_URL
    // if the environment variable does not work, uncomment one of the 2,
    // const redirectUrlFromEnv = 'https://ab9eb8aaad4647c485ecc2aca8a88f59.vfs.cloud9.us-east-1.amazonaws.com/OAuthCallback'
    // const redirectUrlFromEnv = 'https://www.aapp.onboard.icu/OAuthCallback'
    const clientId = '201175894539-gte8nppbkqha8j0o40cqe7opmrsgmofo.apps.googleusercontent.com';
    // const redirectUri = encodeURIComponent('https://ab9eb8aaad4647c485ecc2aca8a88f59.vfs.cloud9.us-east-1.amazonaws.com/OAuthCallback');
    const redirectUri = encodeURIComponent(redirectUrlFromEnv);
    const scopes = ['email', 'profile'];
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scopes.join(' ')}`;

    window.location.href = authUrl;
  };

  const { user } = useUser();

  console.log("User according to navbar : ", user);

  return (
    <div className="gpt3__navbar">
      <div className="gpt3__navbar-links">
        <div className="gpt3__navbar-links_logo">
          <Link to="/Home"> <img src={sp_logo} alt="logo" /> </Link>
        </div>
        <div className="gpt3__navbar-button">
          {user ? <Link to="/ProfileHome"> <button type="button">Home</button> </Link> :
          <Link to="/Home"> <button type="button">Home</button> </Link>}
        </div>
        <div className="gpt3__navbar-button">
          {user ? <LogoutWithGoogle /> :
          <LoginWithGoogle />}
        </div> 
        <div className="gpt3__navbar-button">
          <Link to="/About">
            <button type="button">
              About
            </button>
          </Link>
        </div>
        <div className="gpt3__navbar-menu">
        {toggleMenu
          ? <RiCloseLine color="#fff" size={27} onClick={() => setToggleMenu(false)} />
          : <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)} />}
        {toggleMenu && (
        <div className="gpt3__navbar-menu_container scale-up-center">
          <div className="gpt3__navbar-menu_container-links">
            <p><a href="#home">Home</a></p>
            <p><a href="#dashboard">Login</a></p>
            <p><a href="#dashboard">About</a></p>
          </div>
          <div className="gpt3__navbar-menu_container-links-sign">
            <p>Sign in</p>
            <button type="button">Sign up</button>
          </div>
        </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;