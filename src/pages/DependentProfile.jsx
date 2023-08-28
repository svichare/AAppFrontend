import {React, useState, useContext, useEffect} from "react";
import { useNavigate } from 'react-router-dom';

import "./DependentProfile.css"

import profile_picture from '../assets/images/profile_picture.jpg'
import { ParameterContext } from '../App';

import { API } from '@aws-amplify/api'
import { getDependentDetails } from '../graphql/queries'

function isIterable(item) {
  return typeof item !== 'undefined' && typeof item[Symbol.iterator] === 'function';
}

async function get_dependent_details(dependent_name) {
  
  try { 
    console.log("Checking request  : " + dependent_name);
    const response = await API.graphql({
      query: getDependentDetails,
      variables: {
        name: dependent_name
      },
    });
    console.log("Checking response  : " + dependent_name);
    if (typeof response.data.getDependentDetails == 'undefined') {
      return {
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Google_2011_logo.png/320px-Google_2011_logo.png",
        "name": "Mock User",
        "thumbnail_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Google_2011_logo.png/320px-Google_2011_logo.png",
        "id": 1505
      };
    }
    console.log("Returning data from lambda for ID : " + dependent_name);
    return response.data.getDependentDetails;
  } catch (error) {
    console.error(`Cought error in function : ${error}`);
    return {
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Google_2011_logo.png/320px-Google_2011_logo.png",
        "name": "Error User",
        "last_name": "SomeLastname",
        "id": 1505
      };
  }
}

export default function DependentProfile() {

  const { dependentName } = useContext(ParameterContext);
  const [dependentData, setDependentData] = useState({
    name: "FirstDefaultUser",
    lastName: "Vic",
    id: "topId",
    age: 4
  });

  useEffect( () => {
      get_dependent_details(dependentName)
      .then((profile_details_from_async) => {
        setDependentData(profile_details_from_async);
      });
  }, []);
  
  const navigate = useNavigate();
  
  const onUpdate = () => {
    navigate('/TraitCategories');
  };

  console.log("Showing dependent details for " + dependentName);
  return (
    <div className="DependentProfileContainer">
      <div className="DependentProfileMain">
        <div className="DependentHomeTopbar">
            <div className="DependentHomeImage">
              <img src={dependentData.image_url} alt="profile_photo" />
            </div>
            <div className="DependentHomeName">
              <h3> {dependentData.name} </h3>
            </div>
        </div>
          <button type="button" onClick={onUpdate}> Update profile </button>
      </div>
      <div className="Bottom">
        <p>.</p>
      </div>
    </div>
  );
}
