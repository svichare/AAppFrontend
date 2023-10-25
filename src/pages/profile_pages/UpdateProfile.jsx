import {React, useEffect, useState, useContext} from "react";
import { API, graphqlOperation } from '@aws-amplify/api'
import { useNavigate } from 'react-router-dom';

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

async function update_profile(profileDetails, user_email) {
  // update actionItem with the response.
  const update_profile_details = {
    email: user_email,
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
    const [loadingUpdatePage, setLoadingUpdatePage] = useState(true);

    const [userData, setUserData] = useState({
        name: "",
        last_name: "",
        id: "topId",
        image_url: "../assets/images/profile_picture.jpg",
        dependents: []
    });

    const updateProfileDetails = async () => {
        if (user === null) {
          console.log("user data null. Returning.");
          return;
        }
        get_profile_details(user.email)
        .then((profile_details_from_async) => {
          setUserData(profile_details_from_async);
          setLocalProfileDetails(profile_details_from_async);
          setLoadingUpdatePage(false);
        });
    };
    useEffect( () => {
        console.log("Using user email ");
        if (user === null) {
          console.log("user data null. Returning.");
          return;
        }
        updateProfileDetails();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        console.log("Setting : ", name , " to value : ", value);

        setLocalProfileDetails({
            ...localProfileDetails,
            [name]: value,
        });
    };

    const navigate = useNavigate();

    const handleSubmit = async () => {
        const result = await update_profile(localProfileDetails, user.email);
        navigate('/ProfileHome');
    };
    
    const deleteDependent = async (dependentName) => {
      setLoadingUpdatePage(true);
      const result = await delete_dependent(dependentName, user.email);
      updateProfileDetails();
      navigate('/UpdateProfile');
    };

    const dependent_list = [];
    if (isIterable(userData.dependents)) {
      dependent_list.push(<p> Dependent list: </p>);
      userData.dependents.forEach((dependentData, index) => {
      dependent_list.push(
        <div className="DependentListItem">
            <div className="DependentPhoto" >
              <img src={dependent_del_pic} alt="delete dependent"/>
            </div>
            <div className="DeleteDependent">
              <button type="button" className="DeleteDependent" onClick={() => {deleteDependent(dependentData.string_id)}}>
              Delete: {dependentData.name}</button>
            </div>
        </div>
        );
      });
    }
  
    console.log("Latest userdata ", JSON.stringify(userData));
    console.log("Value of  loadingUpdatePage " + loadingUpdatePage);
    return (
    <div className="ProfileUpdateContainer">
    {loadingUpdatePage ? (
        // Show a loading screen when loading is true
        <div className="LoadingPage"> <h2>Loading...</h2> </div>
        ) : (
        <div>
          <div className="ProfileUpdateMain">
            <h1>Update personal details ...</h1>
            <p>(* fields required to get started.)</p>
            <div className="DependentList">
                {dependent_list}
            </div>
            <p>Email : {user === null ? "":user.email}</p>
            <div className="ProfileUpdateItem">
              <div className="ProfileUpdateDetails">
                <p> Name* </p>
                <input type="text"
                   defaultValue={userData === null ? "":userData.name} 
                   name="name"
                   value={(localProfileDetails === null &&
                          typeof localProfileDetails.name !=='undefined' ) ?
                          "": localProfileDetails.name}
                   onChange={handleInputChange}/>
              </div>
            </div>
            <div className="ProfileUpdateItem">
              <div className="ProfileUpdateDetails">
                <p>Last Name* </p>
                <input type="text"
                   value={(localProfileDetails === null &&
                          typeof localProfileDetails.last_name !=='undefined' ) ?
                          "": localProfileDetails.last_name} name="last_name"
                   onChange={handleInputChange}/>
              </div>
            </div>
            <h2> Location </h2>
            <div className="ProfileUpdateItem">
              <div className="ProfileUpdateDetails">
                <p> Country </p>
                <input type="text"
                   value={(localProfileDetails === null &&
                          typeof localProfileDetails.country !=='undefined' ) ?
                          "NA": localProfileDetails.country}  name="country"
                   onChange={handleInputChange}/>
              </div>
            </div>
            <div className="ProfileUpdateItem">
              <div className="ProfileUpdateDetails">
                <p> State </p>
                <input type="text"
                   value={(localProfileDetails === null &&
                          typeof localProfileDetails.state !=='undefined') ?
                          "": localProfileDetails.state}  name="state"
                   onChange={handleInputChange}/>
              </div>
            </div>
            <div className="ProfileUpdateItem">
              <div className="ProfileUpdateDetails">
                <p> City </p>
                <input type="text"
                   value={(localProfileDetails === null &&
                          typeof localProfileDetails.city !=='undefined') ?
                          "": localProfileDetails.city}  name="city"
                   onChange={handleInputChange}/>
              </div>
            </div>
            <div className="ProfileUpdateItem">
                <button type="button" onClick={handleSubmit}>Submit</button>
            </div>
            <div className="ProfileUpdateItem">
                <button type="button" onClick={() => { navigate('/ProfileHome');}}>Back</button>
            </div>
          </div>
      </div>
      )}
    </div>
  );
}
