import {React, useState} from "react";
import { Link } from 'react-router-dom';

import profile_photo from '../assets/images/profile_picture.jpg'
import profile_pic_round from '../assets/images/profile_pic_round.png'
import profile_my_photo from '../assets/photos/about_alone.jpg'

import "./ProfileHome.css"

export default function ProfileHome({userEmail, resetUserEmail}) {
  const [userData, setUserData] = useState({
    name: "Rahagir",
    lastName: "Kaavi",
    id: "topId",
    Kids: [{
      name: "Beta",
      id: "myId1"
    }, {
      name: "Beti",
      id: "myId2"
    }]
  });

  const result = [];
  userData.Kids.forEach((actionItem, index) => {
    result.push(
      <div className="DependentListItem">
        <Link to="/DependentProfile">
        <div className="DependentPhoto"><img src={profile_pic_round} alt="profile_pic_round"/></div>
        </Link>
        <div className="DependentName"><p>{actionItem.name}</p></div>
        </div>
      );
  });

  return (
      <div className="ProfileHomeContainer">
        <div className="ProfileHomeMain">
          <div className="ProfileHomeTopbar">
            <div className="ProfileImage">
              <img src={profile_my_photo} alt="profile_photo" />
            </div>
            <div className="ProfileName">
              <h4>Welcome back {userData.name} ..</h4>
            </div>
          </div>
            
          <p>Email : {userEmail}</p>
          <h4>Your super-heros .. </h4>
          <div className="DependentList">
            {result}
          </div>
        </div>
        <div className="ProfileHomeBottom">
          <p>.</p>
        </div>
      </div>
  );
}
