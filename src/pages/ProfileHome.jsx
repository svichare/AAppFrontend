import {React, useEffect, useState, useContext} from "react";
import { Link } from 'react-router-dom';

import profile_photo from '../assets/images/profile_picture.jpg'
import profile_pic_round from '../assets/images/profile_pic_round.png'

import { API } from '@aws-amplify/api'
import { getParentDetails } from '../graphql/queries'
import { ParameterContext } from '../App';


import "./ProfileHome.css"

function isIterable(item) {
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
    // For local testing.
    if (typeof response.data.getParentDetails == 'undefined') {
      return {
        "DependentList": [
          {
            "name": "Beta",
            "thumbnail_url": "",
            "id": "101"
          },
          {
            "name": "Beti",
            "thumbnail_url": "",
            "id": "102"
          }
        ],
        "ImageURL": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Google_2011_logo.png/320px-Google_2011_logo.png",
        "Name": "Mock User",
        "LastName": "SomeLastname",
        "id": null
      };
    }
    console.log("Returning data from lambda for email : " + user_email);
    console.log("Deepndent list is : ");
    if (isIterable(response.data.getParentDetails.DependentList)) {
      console.log(response.data.getParentDetails.DependentList.length);
    }
    return response.data.getParentDetails;
  } catch (error) {
    console.error(`Cought error in function : ${error}`);
    return {
        "DependentList": [
          {
            "name": "Beta",
            "thumbnail_url": "",
            "id": "101"
          },
          {
            "name": "Beti",
            "thumbnail_url": "",
            "id": "102"
          }
        ],
        "ImageURL": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Google_2011_logo.png/320px-Google_2011_logo.png",
        "Name": "Error user",
        "LastName": "FunLastname",
        "id": null
      };
  }
}

export default function ProfileHome({userEmail, resetUserEmail}) {
  const { setDependentId } = useContext(ParameterContext);

  
  const [userData, setUserData] = useState({
    Name: "Rahagir",
    LastName: "Kaavi",
    id: "topId",
    ImageURL: "../assets/images/profile_picture.jpg",
    DependentList: [{
      name: "Beta",
      thumbnail_url: "../assets/images/profile_pic_round.png",
      id: "myId1"
    }, {
      name: "Beti",
      thumbnail_url: "../assets/images/profile_pic_round.png",
      id: "myId2"
    }]
  });

  useEffect( () => {
      get_profile_details(userEmail)
      .then((profile_details_from_async) => {
        setUserData(profile_details_from_async);
      });
  }, []);
  
  const result = [];
  if (isIterable(userData.DependentList)) {
    userData.DependentList.forEach((dependentData, index) => {
    result.push(
      <div className="DependentListItem">
        <Link to="/DependentProfile">
          <div className="DependentPhoto" onClick={()=>{setDependentId(dependentData.id)}}>
            <img src={profile_pic_round} alt="profile_pic_round"/>
          </div>
        </Link>
        <div className="DependentName"><p>{dependentData.name}</p></div>
        </div>
      );
    });
  }
  

  return (
      <div className="ProfileHomeContainer">
        <div className="ProfileHomeMain">
          <div className="ProfileHomeTopbar">
            <div className="ProfileImage">
              <img src={userData.ImageURL} alt="profile_photo" />
            </div>
            <div className="ProfileName">
              <h4>Welcome back {userData.Name} ..</h4>
            </div>
          </div>

          <p>Email : {userEmail}</p>
          <h4>Your super-heros .. </h4>
          <div className="DependentList">
            {result}
          </div>
        </div>
        <div className="ProfileHomeBottom">
          <p>.</p>
        </div>
      </div>
  );
}
