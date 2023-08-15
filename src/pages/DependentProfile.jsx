import {React, useState} from "react";

import "./DependentProfile.css"

import { NavBar } from '../components';

export default function DependentProfile({dependentId}) {
  const [dependentData, setDependentData] = useState({
    name: "Rahagir",
    lastName: "Kaavi",
    id: "topId",
    age: 4
  });

  return (
    <div className="Container">
      <div className="Main">
          <h2> Super hero profile</h2>
          <h2>{dependentData.name}</h2>
          <h3>Age: {dependentData.age}</h3>
      </div>
      <div className="Bottom">
        <p>.</p>
      </div>
    </div>
  );
}
