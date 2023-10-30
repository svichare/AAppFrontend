import React from "react";


import './Home.css';
import virtual_assistant_banner from '../assets/images/virtual_assistant_banner.png';
import virtual_assistant_banner_mobile from '../assets/images/virtual_assistant_banner_mobile.png';

import training_assistant_banner from '../assets/images/training_assistant_banner.png';
import training_assistant_banner_mobile from '../assets/images/training_assistant_banner_mobile.png';

import login_banner from '../assets/images/login_banner.png';
import login_banner_mobile from '../assets/images/login_banner_mobile.png';

import information_useful_banner from '../assets/images/information_useful_banner.png';
import information_useful_banner_mobile from '../assets/images/information_useful_banner_mobile.png';

import virtual_assistant_demo from '../assets/images/VA_demo.gif';


export default function Home() {
  
  const returnBannerPic = () => {
    if (window.innerWidth > 768) {
        return virtual_assistant_banner;
    }

    return virtual_assistant_banner_mobile;
  }


 const returnTrainingAssistantPic = () => {
    if (window.innerWidth > 768) {
        return training_assistant_banner;
    }

    return training_assistant_banner_mobile;
  }

  const returnInfoUsefulPic = () => {
    if (window.innerWidth > 768) {
        return information_useful_banner;
    }

    return information_useful_banner_mobile;
  }

 const returnLoginPic = () => {
    if (window.innerWidth > 768) {
        return login_banner;
    }

    return login_banner_mobile;
  }
  return (
    <div className="HomeContainer">
      <div className="HomeMain">
        <div className="HomeTopImage">
          <img src={returnBannerPic()} alt="banner" />
          <img src={returnTrainingAssistantPic()} alt="training_assistant" />
        </div>
        <div className="HomeDemo">
        <h4> Demo: </h4>
          <img src={virtual_assistant_demo} alt="banner" />
        </div>
        <div className="HomeTopImage">
          <img src={returnInfoUsefulPic()} alt="info_useful" />
          <img src={returnLoginPic()} alt="login_banner" />
        </div>
      </div>
    </div>
  );
}
