import {React, useState, useContext} from "react";
import { useNavigate } from 'react-router-dom';

import "./DependentProfile.css"

import profile_picture from '../assets/images/profile_picture.jpg'
import { ParameterContext } from '../App';

export default function DependentProfile() {

 const { dependentId } = useContext(ParameterContext);
  const [dependentData, setDependentData] = useState({
    name: "Rishaan",
    lastName: "Vic",
    id: "topId",
    age: 4
  });

  const navigate = useNavigate();
  
  const onUpdate = () => {
    navigate('/TraitCategories');
  };

  console.log("Showing dependent details for " + dependentId);
  return (
    <div className="DependentProfileContainer">
      <div className="DependentProfileMain">
        <div className="DependentHomeTopbar">
            <div className="DependentHomeImage">
              <img src={profile_picture} alt="profile_photo" />
            </div>
            <div className="DependentHomeName">
              <h3> {dependentData.name} </h3>
            </div>
        </div>
          <h3>Age: {dependentData.age}</h3>
          <button type="button" onClick={onUpdate}> Update profile </button>
      </div>
      <div className="Bottom">
        <p>.</p>
      </div>
    </div>
  );
}
