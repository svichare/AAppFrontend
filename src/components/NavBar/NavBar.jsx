import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import aam_logo from '../../assets/logo/always_around_me.png';

import Button from '@mui/material/Button';

import '../../assets/fonts/fonts.css';

import { LoginWithGoogle, LogoutWithGoogle } from '../';
import { useUser } from '../UserContext';

import './NavBar.css';
import { Home, Info, Login, Logout } from '@mui/icons-material';

const Navbar = ({ userLoggedIn, resetUserEmail }) => {
  const navigate = useNavigate();
  const [toggleMenu, setToggleMenu] = useState(false);

  const { user } = useUser();

  // Create a ref for the menu container
  const menuRef = useRef(null);
  const bodyRef = useRef(null);
  // Toggle the menu state when the icon is clicked
  const handleIconClick = () => {
    console.log("Menu icon  clicked! ");
    setToggleMenu((prevToggle) => !prevToggle);
  };
  useEffect(() => {
    // Function to handle clicks outside the menu
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        console.log("Resetting menu as some outer location was clicked");
        setToggleMenu(false);
      }
    };

    // Attach the event listener when the menu is open
    if (toggleMenu) {
      document.addEventListener('click', handleClickOutside);
    } else {
      // Remove the event listener when the menu is closed
      document.removeEventListener('click', handleClickOutside);
    }

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [toggleMenu]);
  console.log("User according to navbar : ", user);

  return (
    <div className="gpt3__navbar">
      <div className="gpt3__navbar-links">
        <div className="gpt3__navbar-links_logo">
          <Link to="/Home"> <img src={aam_logo} alt="logo" /> </Link>
        </div>
        <div className="gpt3__navbar-links_buttons">
          <Button variant="contained" startIcon={<Home />} className="gpt3__navbar-button">
            {user ? <Link to="/ProfileHome"> <button type="button">Home</button> </Link> :
              <Link to="/Home"> <button type="button">Home</button> </Link>}
          </Button>
          <Button variant="contained" startIcon={user ? <Login /> : <Logout />} className="gpt3__navbar-button">
            {user ? <LogoutWithGoogle /> :
              <LoginWithGoogle />}
          </Button>
          <Button variant="contained" startIcon={<Info />} s className="gpt3__navbar-button">
            <Link to="/Help">
              <button type="button">
                Help
              </button>
            </Link>
          </Button>
          <Button variant="contained" startIcon={<Info />} s className="gpt3__navbar-button">
            <Link to="/About">
              <button type="button">
                Contact
              </button>
            </Link>
          </Button>
        </div>
        <div className="gpt3__navbar-menu" ref={menuRef}>
          {toggleMenu
            ? <RiCloseLine color="#fff" size={27} onClick={() => { setToggleMenu(false); }} />
            : <RiMenu3Line color="#fff" size={27} onClick={(e) => { e.stopPropagation(); setToggleMenu(true); }} />}
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
                <p><Link to="/Help">
                    <button type="button" onClick={() => setToggleMenu(false)}>
                      Help
                    </button>
                  </Link></p>
                  <p><Link to="/About">
                    <button type="button" onClick={() => setToggleMenu(false)}>
                      Contact
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