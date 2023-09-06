import {React, useState, useContext, useEffect} from "react";
import { useNavigate, useParams } from 'react-router-dom';

import "./CaregiverProfile.css"

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

export default function CaregiverProfile() {

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

  const sleepDetails = () => {
    return (<div>
    <h3> Sleep Profile </h3>
    <p><strong>Regular Bedtime hours:</strong> Sleeps early. By 9:30 pm. Wakes up at 7</p>
    <p><strong>Bedtime Routine:</strong> Take him to bathroom to pee. Brush teeth while on the potty.</p>
    <p><strong>Nap hours:</strong> Between 3 to 5 for an hour.</p>
    </div>);
  }

  const dietDetails = () => {
      return (<div>
    <h3> Diet details </h3>
    <p><strong>Regular Bedtime hours:</strong> Sleeps early. By 9:30 pm. Wakes up at 7</p>
    <p><strong>Bedtime Routine:</strong> Take him to bathroom to pee. Brush teeth while on the potty.</p>
    <p><strong>Nap hours:</strong> Between 3 to 5 for an hour.</p>
    </div>);
  }
  
  const sicknessDetails = () => {
      return (<div>
    <h3> All about sickness </h3>
    <p><strong>Regular Bedtime hours:</strong> Sleeps early. By 9:30 pm. Wakes up at 7</p>
    <p><strong>Bedtime Routine:</strong> Take him to bathroom to pee. Brush teeth while on the potty.</p>
    <p><strong>Nap hours:</strong> Between 3 to 5 for an hour.</p>
    </div>);
  }
  
  var physicalActivitiesInString = [];
  physicalActivitiesInString.push(<h3> Physical Activities </h3>);
  physicalActivitiesInString.push(<p><strong>Regular Bedtime hours:</strong> Sleeps early. By 9:30 pm. Wakes up at 7</p>);
  physicalActivitiesInString.push(<p><strong>Bedtime Routine:</strong> Take him to bathroom to pee. Brush teeth while on the potty.</p>);
  physicalActivitiesInString.push(<p><strong>Nap hours:</strong> Between 3 to 5 for an hour.</p>);
  const physicalActivities = () => {
      return (<div>{physicalActivitiesInString}</div>);
  }

  console.log("Showing dependent details for " + dependentStringId);
  return (
    <div className="CaregiverProfileContainer">
      <div className="CaregiverProfileMain">
        <div className="CaregiverHomeTopbar">
            <div className="CaregiverHomeName">
              <h2> Caregiver Profile </h2>
              <p> Find all the important information required to help {returnName()} with daily needs.  </p>
              <button type="button" ><a href="#sleep"> Sleep profile </a> </button>
              <button type="button" ><a href="#diet"> Diet details </a> </button>
              <button type="button" ><a href="#sickness"> All about sickness </a> </button>
              <button type="button" ><a href="#physActivities"> Physical Activities </a> </button>
              <button type="button" ><a href="#screenTime"> Screen time </a> </button>
              <button type="button" ><a href="#commPattern"> Communication pattern </a> </button>
              <button type="button" ><a href="#dailyRoutine"> Daily routines </a> </button>
              <button type="button" ><a href="#handlingMeltdowns"> Handling meltdowns </a> </button>
            </div>
        </div>
        <div id="sleep">
            <p>{sleepDetails()}</p>
        </div>
        <div id="diet">
            <p>{dietDetails()}</p>
        </div>
        <div id="sickness">
            <p>{sicknessDetails()}</p>
        </div>
        <div id="physActivities">
            <p>{physicalActivities()}</p>
        </div>
        <div id="screenTime">
            <p>{dietDetails()}</p>
        </div>
        <div id="commPattern">
            <p>{sicknessDetails()}</p>
        </div>
        <div id="dailyRoutine">
            <p>{sicknessDetails()}</p>
        </div>
        <div id="handlingMeltdowns">
            <p>{sicknessDetails()}</p>
        </div>
      </div>
      <div className="Bottom">
        <p>.</p>
      </div>
    </div>
  );
}
