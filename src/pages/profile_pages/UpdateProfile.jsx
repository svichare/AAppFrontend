import {React, useEffect, useState, useContext} from "react";
import { API, graphqlOperation } from '@aws-amplify/api'

import { ParameterContext } from '../../App';

import { updateProfile, deleteDependent } from '../../graphql/mutations'
import profile_pic_round from '../../assets/images/profile_pic_round.png'
import dependent_del_pic from '../../assets/images/dependent_del_pic_png.png'

import { getParentDetails } from '../../graphql/queries'

import './UpdateProfile.css'

function isIterable(item) {
  if (item === null) {
    return false;
  }
  return typeof item !== 'undefined' && typeof item[Symbol.iterator] === 'function';
}


async function delete_dependent(dependentId, parent_email_id) {
  // update actionItem with the response.
  console.log("Deleting dependent ",dependentId);
  const delete_dependent_input= {
    parent_email: parent_email_id,
    dependent_id: dependentId
  };

  try {
    console.log("Deleting dependent. : ", JSON.stringify(delete_dependent_input));
      const response = await API.graphql(
        graphqlOperation(deleteDependent,
          {deleteDependentInput: delete_dependent_input}));
      console.log("received response : ", JSON.stringify(response));
  } catch (error) {
      console.error('Cought error in update_action_response function :',  JSON.stringify(error));
  }
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

async function update_profile(profileDetails) {
  // update actionItem with the response.
  const update_profile_details = {
    email: profileDetails.email,
    name: profileDetails.name,
    lastname: profileDetails.lastname,
    country: profileDetails.country,
    state: profileDetails.state,
    city: profileDetails.city
  };

  try {
    console.log("Updating the response. : ", JSON.stringify(update_profile_details));
      const response = await API.graphql(
        graphqlOperation(updateProfile,
          {updateProfileInput: update_profile_details}));
      console.log("received response : ", JSON.stringify(response));
  } catch (error) {
      console.error('Cought error in update_action_response function :',  JSON.stringify(error));
  }
}

export default function UpdateProfile({existingProfile}) {
    const { userEmail } = useContext(ParameterContext);
    
    const [localProfileDetails, setLocalProfileDetails] = useState({
        email: userEmail
      });
    
    const [userData, setUserData] = useState({
        Name: "Mock Value",
        LastName: "Kaavi",
        id: "topId",
        ImageURL: "../assets/images/profile_picture.jpg",
        DependentList: []
    });
  
    useEffect( () => {
        console.log("Using userEmail ");
        get_profile_details(userEmail)
        .then((profile_details_from_async) => {
          setUserData(profile_details_from_async);
        });
  }, []);

    var original_name = "";
    var original_lastname = "";
    var original_country = "";
    var original_state = "";
    var original_city = "";
    // Change this to whatever was stored previously.
    if (typeof existingProfile !== 'undefined') {
        original_name = (typeof existingProfile.name ==='undefined' ? "": existingProfile.name);
        original_lastname = (typeof existingProfile.lastname ==='undefined' ? "": existingProfile.lastname);
        original_country = (typeof existingProfile.country ==='undefined' ? "": existingProfile.country);
        original_state = (typeof existingProfile.state ==='undefined' ? "": existingProfile.state);
        original_city = (typeof existingProfile.city ==='undefined' ? "": existingProfile.city);
    }
    if (userData.Name !== "Mock Data") {
        original_name = (typeof userData.Name ==='undefined' ? "": userData.Name);
        original_lastname = (typeof userData.lastname ==='undefined' ? "": userData.lastname);
        original_country = (typeof userData.country ==='undefined' ? "": userData.country);
        original_state = (typeof userData.state ==='undefined' ? "": userData.state);
        original_city = (typeof userData.city ==='undefined' ? "": userData.city);
    }
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        console.log("Setting : ", name , " to value : ", value);

        setLocalProfileDetails({
            ...localProfileDetails,
            [name]: value,
        });
    };

    const handleSubmit = () => {
        update_profile(localProfileDetails);
    };

    const dependent_list = [];
      if (isIterable(userData.DependentList)) {
        userData.DependentList.forEach((dependentData, index) => {
        dependent_list.push(
          <div className="DependentListItem">
              <div className="DependentPhoto" >
                <img src={dependent_del_pic} alt="delete dependent"/>
              </div>
              <div className="DeleteDependent">
                <button type="button" className="DeleteDependent" onClick={()=>{delete_dependent(dependentData.string_id, userEmail)}}>
                Delete: {dependentData.name}</button>
              </div>
          </div>
          );
        });
      }
    return (
    <div className="ProfileUpdateContainer">
      <div className="ProfileUpdateMain">
        <h1>My details ...</h1>
        <p> Update dependent list</p>
        <div className="DependentList">
            {dependent_list}
          </div>
        <p>(Update all details with every request, yes the tool is still in beta :P)</p>
        <p>Email : {userEmail}</p>
        <div className="ProfileUpdateItem">
            <p> Name </p>
            <input className="ProfileUpdateDetails" type="text"
               defaultValue={original_name} name="name"
               onChange={handleInputChange}/>
        </div>
        <div className="ProfileUpdateItem">
            <p>Last Name </p>
            <input className="ProfileUpdateDetails" type="text"
               defaultValue={original_name} name="lastname"
               onChange={handleInputChange}/>
        </div>
        <h2> Location </h2>
        <div className="ProfileUpdateLocationItem">
            <p> Country </p>
            <input className="ProfileUpdateDetails" type="text"
               defaultValue={original_country}  name="country"
               onChange={handleInputChange}/>
        </div>
        <div className="ProfileUpdateLocationItem">
            <p> State </p>
            <input className="ProfileUpdateDetails" type="text"
               defaultValue={""}  name="state"
               onChange={handleInputChange}/>
        </div>
        <div className="ProfileUpdateLocationItem">
            <p> City </p>
            <input className="ProfileUpdateDetails" type="text"
               defaultValue={""}  name="city"
               onChange={handleInputChange}/>
        </div>
        <div className="ProfileUpdateItem">
            <button type="button" onClick={handleSubmit}>Submit</button>
        </div>
      </div>

      <div className="Bottom">
        <p>.</p>
      </div>
    </div>
        );
}
