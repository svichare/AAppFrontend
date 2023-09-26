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
        "DependentList": [
        ],
        "ImageURL": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Google_2011_logo.png/320px-Google_2011_logo.png",
        "Name": "",
        "LastName": "",
        "id": null
      };
    }

    return response.data.getParentDetails;
  } catch (error) {
    console.error(`Cought error in function : ${error}`);
    return {
        "DependentList": [
        ],
        "ImageURL": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Google_2011_logo.png/320px-Google_2011_logo.png",
        "Name": "Error",
        "LastName": "FunLastname",
        "id": null
      };
  }
}

export default function ProfileHome({userEmailParameter, resetUserEmail}) {
  const { setDependentStringId } = useContext(ParameterContext);

  const { userEmail } = useContext(ParameterContext);

  const [localUserEmail, setLocalUserEmail] = useState("");
  
  const [userData, setUserData] = useState({
    Name: "Mock Value",
    LastName: "Kaavi",
    id: "topId",
    ImageURL: "../assets/images/profile_picture.jpg",
    DependentList: []
  });

  const { user } = useUser();

  const navigate = useNavigate();
  
  useEffect( () => {
    if (user === null) {
      console.log("User not set for ProfileHome. Returning.")
      return;
    }
    
      if (user === null) {
        console.log("NOT Using user info ");
        setLocalUserEmail(userEmailParameter);
        if (userEmailParameter != "") {
          get_profile_details(userEmailParameter)
          .then((profile_details_from_async) => {
            setUserData(profile_details_from_async);
          });
        } else {
          console.log("No user email or userEmailParameter set"); 
        }
      } else {
        console.log("Using user.email ");
        setLocalUserEmail(user.email);
        get_profile_details(user.email)
        .then((profile_details_from_async) => {
          setUserData(profile_details_from_async);
        });
      }
    
      // if (typeof userEmail === 'undefined' || userEmail === "") {
      //   console.log("NOT Using userEmail ");
      //   setLocalUserEmail(userEmailParameter);
      //   if (userEmailParameter != "") {
      //     get_profile_details(userEmailParameter)
      //     .then((profile_details_from_async) => {
      //       setUserData(profile_details_from_async);
      //     });
      //   } else {
      //     console.log("No user email set"); 
      //     console.log ("userEmail : " + userEmail + "  userEmailParameter : " + userEmailParameter );
      //   }
      // } else {
      //   console.log("Using userEmail ");
      //   setLocalUserEmail(userEmail);
      //   get_profile_details(userEmail)
      //   .then((profile_details_from_async) => {
      //     setUserData(profile_details_from_async);
      //   });
      // }
  }, []);
  
  const dependent_list = [];
  if (isIterable(userData.DependentList)) {
    userData.DependentList.forEach((dependentData, index) => {
    dependent_list.push(
      <div className="DependentListItem">
        <Link to="/DependentProfile">
          <div className="DependentPhoto" onClick={()=>{setDependentStringId(dependentData.string_id)}}>
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
      if (userData.Name == null || typeof userData.Name === 'undefined') {
          return profile_photo;
      }
      if (userData.Name == "Shivaji Prafull") {
        return svichare_photo
      }

      return profile_photo
  }

  const returnWelcomeMessage = () => {
      if (userData.Name == null || typeof userData.Name === 'undefined') {
          return "Welcome new user. Update your profile using options below.";
      }

      if ( userData.Name === "Error") {
          return "Error connecting to cloud. Try refreshing this page.";
      }

      if ( userData.Name === "Mock Value") {
          return "Loading..";
      }
      
      if (userData.Name == "") {
        return "Welcome new user. Update your profile using options below.";
      }

      return "Welcome back " + userData.Name;
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
