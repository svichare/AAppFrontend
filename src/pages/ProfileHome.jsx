import {React, useState} from "react";
import { Link } from 'react-router-dom';

import { NavBar } from '../components';

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
        <p>{actionItem.name}, {actionItem.id}</p>,
        <Link to="/DependentProfile">Go to Profile Page</Link>,
        <p></p>
      );
  });

  return (
      <div className="ProfileHomeContainer">
        <div className="ProfileHomeMain">
            <h4>Welcome back {userData.name} ..</h4>
            <p>Email : {userEmail}</p>
            <p>Your super-heros .. </p>
            {result}
        </div>
        <div className="ProfileHomeBottom">
          <p>.</p>
        </div>
      </div>
  );
}
