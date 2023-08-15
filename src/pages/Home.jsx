import React from "react";

import { NavBar } from '../components';
import rainbow_photo from '../assets/photos/rainbow_ai_cropped.jpg'


import './Home.css';


export default function Home() {
  return (
    <div className="Container">
      <div className="Main">
          <div className="HomeTopImage">
            <img src={rainbow_photo} alt="rainbow_photo" class="blurred-image" />
          </div>
          <br></br>
          <p>Your kid is a combination of thousands of unique traits. </p>
          <p>Connect with the parents of kids which is closest to your kiddo..</p>
          <br></br>
      </div>
      <div className="Bottom" />
    </div>
  );
}
