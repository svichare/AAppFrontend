import React from "react";


import './Home.css';
import homepage_laptop from '../assets/images/homepage_2_30am.png';
import homepage_mobile from '../assets/images/homepage_2_30am_mobile.png';


export default function Home() {
  
    const returnHomePic = () => {
    if (window.innerWidth > 768) {
        return homepage_laptop;
    }

    return homepage_mobile;
  }

  return (
    <div className="HomeContainer">
      <div className="HomeMain">
        <div className="HomeTopImage">
          <img src={returnHomePic()} alt="home_photo" />
        </div>
      </div>
    </div>
  );
}
