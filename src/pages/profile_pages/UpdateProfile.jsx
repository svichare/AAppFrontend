import {React, useEffect, useState, useContext} from "react";
import { API, graphqlOperation } from '@aws-amplify/api'

import { ParameterContext } from '../../App';

import { updateProfile, deleteDependent } from '../../graphql/mutations'
import profile_pic_round from '../../assets/images/profile_pic_round.png'
import dependent_del_pic from '../../assets/images/dependent_del_pic_png.png'

import { getParentDetails } from '../../graphql/queries'
import { useUser } from '../../components/UserContext';

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

async function update_profile(profileDetails) {
  // update actionItem with the response.
  const update_profile_details = {
    email: profileDetails.email,
    name: profileDetails.name,
    last_name: profileDetails.last_name,
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
    const { user } = useUser();

    const [localProfileDetails, setLocalProfileDetails] = useState({});
    
    const [userData, setUserData] = useState({
        name: "Mock Value",
        last_name: "Kaavi",
        id: "topId",
        image_url: "../assets/images/profile_picture.jpg",
        dependents: []
    });
  
    useEffect( () => {
        console.log("Using user email ");
        if (user === null) {
          console.log("user data null. Returning.");
          return;
        }
        get_profile_details(user.email)
        .then((profile_details_from_async) => {
          setUserData(profile_details_from_async);
          setLocalProfileDetails(profile_details_from_async);
        
          if (profile_details_from_async !== null &&
          typeof profile_details_from_async !== 'undefined') {
            original_name = (typeof profile_details_from_async.name ==='undefined' ? "" :
              profile_details_from_async.name);
            original_lastname = (typeof profile_details_from_async.last_name ==='undefined' ? "":
              profile_details_from_async.lastname);
            original_country = (typeof profile_details_from_async.country ==='undefined' ? "":
              profile_details_from_async.country);
            original_state = (typeof profile_details_from_async.state ==='undefined' ? "":
              profile_details_from_async.state);
            original_city = (typeof profile_details_from_async.city ==='undefined' ? "":
              profile_details_from_async.city);
          }
        });
  }, []);

    var original_name = "";
    var original_lastname = "";
    var original_country = "";
    var original_state = "";
    var original_city = "";
    // Change this to whatever was stored previously.
    // if (typeof existingProfile !== 'undefined') {
    //     original_name = (typeof existingProfile.name ==='undefined' ? "": existingProfile.name);
    //     original_lastname = (typeof existingProfile.lastname ==='undefined' ? "": existingProfile.lastname);
    //     original_country = (typeof existingProfile.country ==='undefined' ? "": existingProfile.country);
    //     original_state = (typeof existingProfile.state ==='undefined' ? "": existingProfile.state);
    //     original_city = (typeof existingProfile.city ==='undefined' ? "": existingProfile.city);
    // }
    // if (userData.Name !== "Mock Data") {
    //     original_name = (typeof userData.Name ==='undefined' ? "": userData.Name);
    //     original_lastname = (typeof userData.lastname ==='undefined' ? "": userData.lastname);
    //     original_country = (typeof userData.country ==='undefined' ? "": userData.country);
    //     original_state = (typeof userData.state ==='undefined' ? "": userData.state);
    //     original_city = (typeof userData.city ==='undefined' ? "": userData.city);
    // }
    
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
      if (isIterable(userData.dependents)) {
        userData.dependents.forEach((dependentData, index) => {
        dependent_list.push(
          <div className="DependentListItem">
              <div className="DependentPhoto" >
                <img src={dependent_del_pic} alt="delete dependent"/>
              </div>
              <div className="DeleteDependent">
                <button type="button" className="DeleteDependent" onClick={()=>{delete_dependent(dependentData.string_id, user.email)}}>
                Delete: {dependentData.name}</button>
              </div>
          </div>
          );
        });
      }
      
    console.log("Latest userdata ", JSON.stringify(userData));
    return (
    <div className="ProfileUpdateContainer">
      <div className="ProfileUpdateMain">
        <h1>My details ...</h1>
        <p> Update dependent list</p>
        <div className="DependentList">
            {dependent_list}
          </div>
        <p>(Update all details with every request .. sorry the tool is still in beta.)</p>
        <p>Email : {user === null ? "":user.email}</p>
        <div className="ProfileUpdateItem">
            <p> Name </p>
            <input className="ProfileUpdateDetails" type="text"
               defaultValue={userData === null ? "":userData.name} 
               name="name"
               value={(localProfileDetails === null &&
                      typeof localProfileDetails.name !=='undefined' ) ?
                      "": localProfileDetails.name}
               onChange={handleInputChange}/>
        </div>
        <div className="ProfileUpdateItem">
            <p>Last Name </p>
            <input className="ProfileUpdateDetails" type="text"
               value={(localProfileDetails === null &&
                      typeof localProfileDetails.last_name !=='undefined' ) ?
                      "": localProfileDetails.last_name} name="last_name"
               onChange={handleInputChange}/>
        </div>
        <h2> Location </h2>
        <div className="ProfileUpdateLocationItem">
            <p> Country </p>
            <input className="ProfileUpdateDetails" type="text"
               value={(localProfileDetails === null &&
                      typeof localProfileDetails.country !=='undefined' ) ?
                      "": localProfileDetails.country}  name="country"
               onChange={handleInputChange}/>
        </div>
        <div className="ProfileUpdateLocationItem">
            <p> State </p>
            <input className="ProfileUpdateDetails" type="text"
               value={(localProfileDetails === null &&
                      typeof localProfileDetails.state !=='undefined' ) ?
                      "": localProfileDetails.state}  name="state"
               onChange={handleInputChange}/>
        </div>
        <div className="ProfileUpdateLocationItem">
            <p> City </p>
            <input className="ProfileUpdateDetails" type="text"
               value={(localProfileDetails === null &&
                      typeof localProfileDetails.city !=='undefined' ) ?
                      "": localProfileDetails.city}  name="city"
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
