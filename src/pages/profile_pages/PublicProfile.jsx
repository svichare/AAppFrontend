import {React, useState, useContext, useEffect} from "react";
import { useNavigate, useParams } from 'react-router-dom';

import "./PublicProfile.css"

import profile_picture from '../../assets/images/profile_picture.jpg'
import { ParameterContext } from '../../App';

import { API } from '@aws-amplify/api'
import { getDependentDetails } from '../../graphql/queries'

function isIterable(item) {
  return typeof item !== 'undefined' && typeof item[Symbol.iterator] === 'function';
}

async function get_dependent_details(dependent_string_id) {

  try { 
    console.log("Checking request  : " + dependent_string_id);
    const response = await API.graphql({
      query: getDependentDetails,
      variables: {
        string_id: dependent_string_id
      },
    });
    console.log("Checking response  : " + dependent_string_id);
    if (typeof response.data.getDependentDetails == 'undefined') {
      return {
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Google_2011_logo.png/320px-Google_2011_logo.png",
        "name": "Mock User",
        "thumbnail_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Google_2011_logo.png/320px-Google_2011_logo.png",
        "id": 1505
      };
    }
    console.log("Returning data from lambda for ID : " + dependent_string_id);
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

export default function PublicProfile() {

  const { dependent_public_id } = useParams();
  const { dependentStringId } = useContext(ParameterContext);
  const [dependentData, setDependentData] = useState({
    name: "a",
    lastName: "a",
    id: "a",
    age: 0
  });

  useEffect( () => {
      
      if (dependent_public_id.length > 0) {
          get_dependent_details(dependent_public_id)
          .then((profile_details_from_async) => {
            setDependentData(profile_details_from_async);
          });
      } else {
          setDependentData({
              name: "a",
              lastName: "a",
              id: "a",
              age: 0
          })
      }
  }, []);
  
  const navigate = useNavigate();
  
  const onUpdate = () => {
    navigate('/TraitCategories');
  };

  const returnName = () => {
      if (dependentData.name == null || typeof dependentData.name === 'undefined') {
          return "";
      }
      return dependentData.name;
  }

  const returnAge = () => {
      if (dependentData.age == null || typeof dependentData.age === 'undefined') {
          return 0;
      }
      return dependentData.age;
  }
  const returnDiagnosis = () => {
      if (dependentData.diagnosis == null || typeof dependentData.diagnosis === 'undefined') {
          return 0;
      }
      return dependentData.diagnosis;
  }
  
  const returnVerbal = () => {
      if (dependentData.verbal == null || typeof dependentData.verbal === 'undefined') {
          return 0;
      }
      return dependentData.verbal;
  }
  
  const returnEmergencyContact = () => {
      return ("408 230 8529, 703 663 0271 shivaji.vichare@gmail.com");
  }

  console.log("Showing dependent details for " + dependentStringId);
  return (
    <div className="PublicProfileContainer">
      <div className="PublicProfileMain">
        <div className="PublicHomeTopbar">
            <div className="PublicHomeImage">
              <img src={dependentData.image_url} alt="profile_photo" />
            </div>
            <div className="PublicHomeName">
              <h3> {returnName()} </h3>
              <p> {returnDiagnosis()} {returnDiagnosis().length > 0 &&  returnVerbal().length > 0 ? "," : "" } {returnVerbal()}</p>
              <p> {returnAge() > 0 ? "Age: " + returnAge() : ""} </p>
              <div className="PublicEmergencyContact">
                <p> Emergency contact: {returnEmergencyContact()} </p>
              </div>
              <button type="button" onClick={() => {
                navigate('/PublicProfile/' + dependentData.string_id + '/CaregiverProfile' );
              }}> Details for Caregivers </button>
            </div>
        </div>
      </div>
      <div className="Bottom">
        <p>.</p>
      </div>
    </div>
  );
}
