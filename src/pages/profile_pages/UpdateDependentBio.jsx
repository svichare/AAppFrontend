import {React, useEffect, useState, useContext} from "react";
import { API, graphqlOperation } from '@aws-amplify/api'
import { useNavigate } from 'react-router-dom';

import { ParameterContext } from '../../App';

import { updateProfile, deleteDependent } from '../../graphql/mutations'
import profile_pic_round from '../../assets/images/profile_pic_round.png'
import dependent_del_pic from '../../assets/images/dependent_del_pic_png.png'

import { getParentDetails, getDependentDetails } from '../../graphql/queries'
import { useUser } from '../../components/UserContext';
import { useDependent } from '../../components/DependentContext';

import './UpdateDependentBio.css'

function isIterable(item) {
  if (item === null) {
    return false;
  }
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

export default function UpdateDependentBio({existingProfile}) {
    const { userEmail } = useContext(ParameterContext);
    const { user } = useUser();
    const { dependent } = useDependent();

    const [localProfileDetails, setLocalProfileDetails] = useState({});

    const [userData, setUserData] = useState({
        name: "",
        last_name: "",
        id: "topId",
        image_url: "../assets/images/profile_picture.jpg",
        dependents: []
    });
    const [dependentData, setDependentData] = useState({
        name: "",
        last_name: "",
        id: "topId",
        image_url: "../assets/images/profile_picture.jpg",
        dependents: []
    });

    useEffect( () => {
        if (dependent === null) {
          console.log("dependent data null. Returning.");
          return;
        }

        get_dependent_details(dependent.string_id)
          .then((profile_details_from_async) => {
            setDependentData(profile_details_from_async);
            setLocalProfileDetails(profile_details_from_async);
        });

        if (user === null) {
          console.log("user data null. Returning.");
          return;
        }
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
        const result = await update_profile(localProfileDetails);
        navigate('/ProfileHome');
    };
    

    console.log("Latest dependentData ", JSON.stringify(dependentData));
    return (
    <div className="ProfileUpdateContainer">
      <div className="ProfileUpdateMain">
        <h1>Details ...</h1>
        <div className="ProfileUpdateItem">
            <p> First Name </p>
            <input className="ProfileUpdateDetails" type="text"
               defaultValue={dependentData === null ? "":dependentData.name} 
               name="name"
               value={(localProfileDetails === null &&
                      typeof localProfileDetails.name !=='undefined' ) ?
                      "": localProfileDetails.name}
               onChange={handleInputChange}/>
        </div>

        <div className="ProfileUpdateItem">
            <p> Diagnosis </p>
            <input className="ProfileUpdateDetails" type="text"
               defaultValue={dependentData === null ? "":dependentData.diagnosis} 
               name="diagnosis"
               value={(localProfileDetails === null &&
                      typeof localProfileDetails.diagnosis !=='undefined' ) ?
                      "": localProfileDetails.diagnosis}
               onChange={handleInputChange}/>
        </div>

        <div className="ProfileUpdateItem">
            <p> Communication type </p>
            <input className="ProfileUpdateDetails" type="text"
               defaultValue={dependentData === null ? "":dependentData.verbal} 
               name="verbal"
               value={(localProfileDetails === null &&
                      typeof localProfileDetails.verbal !=='undefined' ) ?
                      "": localProfileDetails.verbal}
               onChange={handleInputChange}/>
        </div>

        <div className="ProfileUpdateItem">
            <p> Age </p>
            <input className="ProfileUpdateDetails" type="text"
               defaultValue={dependentData === null ? "":dependentData.age} 
               name="age"
               value={(localProfileDetails === null &&
                      typeof localProfileDetails.age !=='undefined' ) ?
                      "": localProfileDetails.age}
               onChange={handleInputChange}/>
        </div>

        <div className="ProfileUpdateItem">
            <p> Public ID </p>
            <input className="ProfileUpdateDetails" type="text"
               defaultValue={dependentData === null ? "":dependentData.public_id} 
               name="public_id"
               value={(localProfileDetails === null &&
                      typeof localProfileDetails.public_id !=='undefined' ) ?
                      "": localProfileDetails.public_id}
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
