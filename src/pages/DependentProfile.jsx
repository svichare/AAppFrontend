import {React, useState, useContext, useEffect} from "react";
import { useNavigate } from 'react-router-dom';

import "./DependentProfile.css"

import rish_photo from '../assets/photos/about_rish_crop2.jpg'
import profile_pic_round from '../assets/images/profile_pic_round.png'
import { ParameterContext } from '../App';

import { API } from '@aws-amplify/api'
import { getDependentDetails } from '../graphql/queries'
import { useDependent } from '../components/DependentContext';

function isIterable(item) {
  return typeof item !== 'undefined' && typeof item[Symbol.iterator] === 'function';
}

async function get_dependent_details(dependent_string_id) {
  try { 
    console.log("Checking request  : " + dependent_string_id);
    const response = await API.graphql({
      query: getDependentDetails,
      variables: {
        dependent_id: dependent_string_id
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

export default function DependentProfile() {

  const { dependentStringId } = useContext(ParameterContext);
  const { dependent } = useDependent();

  const [dependentData, setDependentData] = useState({
    name: "Mock Value",
    lastName: "Vic",
    id: "topId",
    age: 4
  });

  useEffect( () => {
    if (dependent !== null) {
      get_dependent_details(dependent.string_id)
      .then((profile_details_from_async) => {
        setDependentData(profile_details_from_async);
      });
    } else {
      console.log("dependent data null. Heading home");
      navigate('/Home');
    }
  }, []);

  const navigate = useNavigate();

  const navigateToPublicProf = () => {
    navigate('/PublicProfile/' + dependentData.public_id );
  };
  
  const navigateToVirtualAssistant = () => {
    navigate('/PublicProfile/' + dependentData.public_id + '/OpenAICaregiver');
  };
  
  const returnProfilePic = () => {
    if (dependentData.name == null || typeof dependentData.name === 'undefined') {
        return profile_pic_round;
    }
    if (dependentData.name == "Rishaan") {
      return rish_photo
    }

    return profile_pic_round
  }
  
  const [message, setMessage] = useState('Hover on the button to know more');

  const handleMouseEnter = (button) => {
    console.log("Button details : " , button.target.textContent);
    switch (button.target.textContent) {
      case 'Edit Care details':
        setMessage("Update details of how you take care of them. This information will always stay with them. ");
        break;
      default:
        setMessage("Default case");
        break;
    }
    
  };

  const handleMouseLeave = () => {
    setMessage('Hover on the button to know more');
  };


  const returnProfileName = () => {
    if (dependentData.name === null || typeof dependentData.name === 'undefined') {
        return  "";
    }
    if (dependentData.name == "Mock Value") {
      return "Loading..";
    }

    return dependentData.name
  }

  const navButtons = [];
  if (dependentData.name === null ||
      typeof dependentData.name === 'undefined' ||
      dependentData.name == "Mock Value" ||
      dependentData.name == "") {
    // Dont populate the navbuttons here.
  } else {
    navButtons.push(
      <div className="DependentNavButtons">
        <button type="button" onClick={() => {navigate('/TraitCategories')}} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Edit Care details</button>
        <button type="button" onClick={() => {navigate('/UpdateDependentBio')}}>Edit Bio</button>
        <button type="button" onClick={navigateToPublicProf}>See Public Profile</button> 
        <button type="button" onClick={navigateToVirtualAssistant}>Chat with Virtual assistant</button>
      </div>
    );
  }
  
  console.log("Showing dependent details for " + dependentStringId);
  return (
    <div className="DependentProfileContainer">
      <div className="DependentProfileMain">
        <div className="DependentHomeTopbar">
            <div className="DependentHomeImage">
              <img src={returnProfilePic()} alt="profile_photo" />
            </div>
            <div className="DependentHomeName">
              <h3> {returnProfileName()} </h3>
            </div>
        </div>
        <div className="DependentProfileDescription">
        
        </div>
        <p> Welcome to the Profile page of your dear one.</p>
        <p> Use the <b>Edit buttons</b> below to store the information you have about them.</p>
        <p> View the <b>Public Profile</b> and share it with everyone important in their life. It is the page which has 
         all the information needed to take care of them.</p>
        {navButtons}
      </div>
      <div className="Bottom">
        <p>.</p>
      </div>
    </div>
  );
}
