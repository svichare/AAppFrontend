import {React, useState} from "react";
import { Link } from 'react-router-dom';

import * as S from "./ProfileHomeStyles";
import { NavBar } from '../components';

import "./ProfileHome.css"

export default function ProfileHome({userEmail}) {
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
        <Link to="/DependentProfile">Go to Profile Page (Using Link)</Link>,
        <p></p>
      );
  });

  return (
    <div className="Container">
      <div className="Main">
          <NavBar />
          <h2>Welcome back {userData.name}</h2>
          <h4>Email : {userEmail}</h4>
          <h4>Your super-heros .. </h4>
          {result}
      </div>
      <div className="Bottom">
      <p>.</p>
      </div>
    </div>
  );
}
