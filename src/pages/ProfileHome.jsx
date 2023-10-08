import {React, useEffect, useState, useContext} from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import svichare_photo from '../assets/photos/about_alone.jpg'
import profile_photo from '../assets/images/profile_picture.jpg'
import profile_pic_round from '../assets/images/profile_pic_round.png'
import dependent_add_pic from '../assets/images/dependent_add_pic_png.png'

import { API } from '@aws-amplify/api'
import { getParentDetails } from '../graphql/queries'
import { ParameterContext } from '../App';
import { useUser } from '../components/UserContext';
import { useDependent } from '../components/DependentContext';

import "./ProfileHome.css"

function isIterable(item) {
  if (item === null) {
    return false;
  }
  return typeof item !== 'undefined' && typeof item[Symbol.iterator] === 'function';
}

async function get_profile_details(user_email) {
  try {
    const response = await API.graphql({
      query: getParentDetails,
      variables: {
        email: user_email
      },
    });
    if (typeof response.data.getParentDetails == 'undefined') {
      return {
        "dependents": [
        ],
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Google_2011_logo.png/320px-Google_2011_logo.png",
        "name": "",
        "last_name": "",
        "id": null
      };
    }

    return response.data.getParentDetails;
  } catch (error) {
    console.error(`Cought error in function : ${error}`);
    return {
        "dependents": [
        ],
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Google_2011_logo.png/320px-Google_2011_logo.png",
        "name": "Error",
        "last_name": "FunLastname",
        "id": null
      };
  }
}

export default function ProfileHome({userEmailParameter, resetUserEmail}) {
  const { setDependentStringId } = useContext(ParameterContext);

  const { userEmail } = useContext(ParameterContext);
  const { user } = useUser();
  const { set_dependent } = useDependent();
  const [localUserEmail, setLocalUserEmail] = useState("");
  
  const [userData, setUserData] = useState({
    name: "Mock Value",
    last_name: "Kaavi",
    id: "topId",
    image_url: "../assets/images/profile_picture.jpg",
    dependents: []
  });

  const navigate = useNavigate();
  
  useEffect( () => {
    if (user === null) {
      console.log("NOT using user info ");
      navigate('/Home');
    } else {
      console.log("Using user.email ");
      setLocalUserEmail(user.email);
      get_profile_details(user.email)
      .then((profile_details_from_async) => {
        setUserData(profile_details_from_async);
        if (profile_details_from_async.name == null ||
            typeof profile_details_from_async.name === 'undefined') {
          navigate('/UpdateProfile');
        }
      });
    }
  }, [user]);
  
  const dependent_list = [];
  if (isIterable(userData.dependents)) {
    userData.dependents.forEach((dependentData, index) => {
    dependent_list.push(
      <div className="DependentListItem">
        <Link to="/DependentProfile">
          <div className="DependentPhoto" onClick={
          ()=>{setDependentStringId(dependentData.string_id);
          set_dependent({string_id: dependentData.string_id})}}>
            <img src={profile_pic_round} alt="profile_pic_round"/>
          </div>
        </Link>
        <div className="DependentName"><p>{dependentData.name}</p></div>
        </div>
      );
    });
  }
  dependent_list.push(
    <div className="DependentListItem">
      <Link to="/AddDependent">
        <div className="DependentPhoto">
          <img src={dependent_add_pic} alt="add dependent"/>
        </div>
      </Link>
      <div className="DependentName"><p>Add one</p></div>
      </div>
    );
  
  const returnProfilePic = () => {
      if (userData.name == null || typeof userData.name === 'undefined') {
          return profile_photo;
      }
      if (userData.name == "Shivaji Prafull") {
        return svichare_photo
      }

      return profile_photo
  }

  const returnWelcomeMessage = () => {
      if (userData.name == null || typeof userData.name === 'undefined') {
          return "Welcome new user. Update your profile using options below.";
      }

      if ( userData.name === "Error") {
          return "Error connecting to cloud. Try refreshing this page.";
      }

      if ( userData.name === "Mock Value") {
          return "Loading..";
      }
      
      if (userData.name == "") {
        return "Welcome new user. Update your profile using options below.";
      }

      return "Welcome back " + userData.name;
  }
  
  return (
      <div className="ProfileHomeContainer">
        <div className="ProfileHomeMain">
          <div className="ProfileHomeTopbar">
            <div className="ProfileImage">
              <img src={returnProfilePic()} alt="profile_photo" />
            </div>
            <div className="ProfileName">
              <h4>{returnWelcomeMessage()}</h4>
            </div>
          </div>

          <p>Email : {localUserEmail}</p>
          <h4>Your super-heros .. </h4>
          <div className="DependentList">
            {dependent_list}
          </div>
          <Link to="/UpdateProfile">
            <div className="UpdateProfileButton" onClick={()=>{}}>
              <button type="button">Update Profile</button> 
            </div>
          </Link>
        </div>

        <div className="ProfileHomeBottom">
          <p>.</p>
        </div>
      </div>
  );
}
