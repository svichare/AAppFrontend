import React, { useState } from 'react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
// import logo from '../../assets/logo/svg_logo.svg';
import sp_logo from '../../assets/logo/logo_g.png';
import home_g_y_b from '../../assets/images/home_g.png';
import login_g_y_b from '../../assets/images/login_g.png';
import about_g_y_b from '../../assets/images/about_g.png';


import './navbarUi.css';

const NavbarUi = ({setSelectedTask}) => {
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
  
  return (
    <div className="gpt3__navbar">
      <div className="gpt3__navbar-links">
        <div className="gpt3__navbar-links_logo">
          <img src={sp_logo} alt="logo" />
        </div>
        <div className="gpt3__navbar-button">
          <button type="button" onClick={() => setSelectedTask({name:'', id:0})}>
            <div className="gpt3__navbar-button_image">
                <img src={home_g_y_b} alt="Home" />
            </div>
          </button>
        </div>
        <div className="gpt3__navbar-button">
          <button type="button" onClick={handleLoginWithGoogle}>
          <div className="gpt3__navbar-button_image">
                <img src={login_g_y_b} alt="Login" />
          </div>
          </button>
        </div> 
        <div className="gpt3__navbar-button">
          <button type="button" onClick={() => setSelectedTask({name:'About', id:999})}>
          <div className="gpt3__navbar-button_image">
                <img src={about_g_y_b} alt="About" />
          </div>
          </button>
        </div>
        <div className="gpt3__navbar-menu">
        {toggleMenu
          ? <RiCloseLine color="#fff" size={27} onClick={() => setToggleMenu(false)} />
          : <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)} />}
        {toggleMenu && (
        <div className="gpt3__navbar-menu_container scale-up-center">
          <div className="gpt3__navbar-menu_container-links">
            <p><a href="#home">Home</a></p>
            <p><a href="#dashboard">Learning dashboard</a></p>
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

export default NavbarUi;