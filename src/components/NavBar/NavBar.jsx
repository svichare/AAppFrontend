import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import sp_logo from '../../assets/logo/g_y_b.png';
import aam_logo from '../../assets/logo/always_around_me.png';

import '../../assets/fonts/fonts.css';
import { ParameterContext } from '../../App';

import {LoginWithGoogle, LogoutWithGoogle} from '../';
import { useUser } from '../UserContext';

import './NavBar.css';

const Navbar = ({userLoggedIn, resetUserEmail}) => {
  const navigate = useNavigate();
  const [toggleMenu, setToggleMenu] = useState(false);

  const { user } = useUser();

  console.log("User according to navbar : ", user);

  return (
    <div className="gpt3__navbar">
      <div className="gpt3__navbar-links">
        <div className="gpt3__navbar-links_logo">
          <Link to="/Home"> <img src={aam_logo} alt="logo" /> </Link>
        </div>
        <div className="gpt3__navbar-links_buttons">
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
        </div>
        <div className="gpt3__navbar-menu">
        {toggleMenu
          ? <RiCloseLine color="#fff" size={27} onClick={() => setToggleMenu(false)} />
          : <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)} />}
        {toggleMenu && (
        <div className="gpt3__navbar-menu_container scale-up-center">
          <div className="gpt3__navbar-menu_container-links">
            <div className="gpt3__navbar-button">
              <p>{user ? <Link to="/ProfileHome"> <button type="button" onClick={() => setToggleMenu(false)}>Home</button> </Link> :
              <Link to="/Home"> <button type="button" onClick={() => setToggleMenu(false)}>Home</button> </Link>}</p>
            </div>
            <div className="gpt3__navbar-button">
              <p>{user ? <LogoutWithGoogle /> :
              <LoginWithGoogle />}</p>
            </div>
            <div className="gpt3__navbar-button">
              <p><Link to="/About">
              <button type="button" onClick={() => setToggleMenu(false)}>
                About
              </button>
              </Link></p>
            </div>
          </div>
        </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;