import {React, useEffect, useState, useContext} from "react";
import { API, graphqlOperation } from '@aws-amplify/api'

import { ParameterContext } from '../../App';

import { updateProfile } from '../../graphql/mutations'

import './UpdateProfile.css'

async function update_profile (profileDetails) {
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

    return (
    <div className="ProfileUpdateContainer">
      <div className="ProfileUpdateMain">
        <h1>My details ...</h1>
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
