import {React, useState} from "react";

import "./DependentProfile.css"

import { NavBar } from '../components';

import profile_picture from '../assets/images/profile_picture.jpg'

export default function DependentProfile({dependentId}) {
  const [dependentData, setDependentData] = useState({
    name: "Rishaan",
    lastName: "Vic",
    id: "topId",
    age: 4
  });

  return (
    <div className="Container">
      <div className="Main">
        <div className="DependentHomeTopbar">
            <div className="DependentHomeImage">
              <img src={profile_picture} alt="profile_photo" />
            </div>
            <div className="DependentHomeName">
              <h3> {dependentData.name} </h3>
            </div>
        </div>
          <h3>Age: {dependentData.age}</h3>
      </div>
      <div className="Bottom">
        <p>.</p>
      </div>
    </div>
  );
}
