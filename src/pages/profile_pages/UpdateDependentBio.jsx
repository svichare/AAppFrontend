import {React, useEffect, useState, useContext} from "react";
import { API, graphqlOperation } from '@aws-amplify/api'
import { useNavigate } from 'react-router-dom';

import { ParameterContext } from '../../App';

import { UpdateDependentBio } from '../../graphql/mutations'
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

async function update_profile(profileDetails, parent_email_param) {
  // update actionItem with the response.
  const update_dependent_details = {
    parent_email: parent_email_param,
    string_id: profileDetails.string_id,
    name: profileDetails.name,
    verbal: profileDetails.verbal,
    diagnosis: profileDetails.diagnosis,
    public_id: profileDetails.public_id,
    age: profileDetails.age
  };

  try {
    console.log("Updating the response. with public id: ", JSON.stringify(update_dependent_details));
      const response = await API.graphql(
        graphqlOperation(UpdateDependentBio,
          {updateDependentInput: update_dependent_details}));
      console.log("received response : ", JSON.stringify(response));
  } catch (error) {
      console.error('Cought error in update_action_response function :',  JSON.stringify(error));
  }
}

export default function UpdateDependentBioPage({existingProfile}) {
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
    const [loading, setLoading] = useState(true);

    useEffect( () => {
        if (dependent === null) {
          console.log("dependent data null. Returning.");
          return;
        }
        if (user === null) {
          console.log("user data null. Returning.");
          return;
        }
        get_dependent_details(dependent.string_id)
          .then((profile_details_from_async) => {
            setDependentData(profile_details_from_async);
            setLocalProfileDetails(profile_details_from_async);
            setLoading(false);
        });
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
      if (user === null) {
        console.log("user null. Cannot update dependent");
        return;
      }
      const result = await update_profile(localProfileDetails, user.email);
      navigate('/DependentProfile');
    };
    

    console.log("Latest dependentData ", JSON.stringify(dependentData));
    console.log("Latest localProfileData ", JSON.stringify(localProfileDetails));
    
    return (
    <div className="ProfileUpdateContainer">
    
      <div className="ProfileUpdateMain">
        <h1>Details ...</h1>
        <p>(* required fields)</p>
        <div className="ProfileUpdateItem">
          <div className="ProfileUpdateDetails">
            <p> First Name* </p>
            <input type="text"
               defaultValue={(localProfileDetails === null ||
                      typeof localProfileDetails.name ==='undefined' ) ? "":localProfileDetails.name} 
               name="name"
               value={(localProfileDetails === null ||
                      typeof localProfileDetails.name ==='undefined' ) ?
                      "": localProfileDetails.name}
               onChange={handleInputChange}/>
          </div>
        </div>

        <div className="ProfileUpdateItem">
          <div className="ProfileUpdateDetails">
            <p> Diagnosis* </p>
            <input className="ProfileUpdateDetails" type="text"
               defaultValue={(localProfileDetails === null ||
                      typeof localProfileDetails.diagnosis ==='undefined' ) ? "":localProfileDetails.diagnosis} 
               name="diagnosis"
               value={(localProfileDetails === null ||
                      typeof localProfileDetails.diagnosis ==='undefined' ) ?
                      "": localProfileDetails.diagnosis}
               onChange={handleInputChange}/>
          </div>
        </div>

        <div className="ProfileUpdateItem">
          <div className="ProfileUpdateDetails">
            <p> Communication type (eg. verbal/non-verbal)* </p>
            <input className="ProfileUpdateDetails" type="text"
               defaultValue={(localProfileDetails === null ||
                      typeof localProfileDetails.verbal ==='undefined' ) ? "":localProfileDetails.verbal} 
               name="verbal"
               value={(localProfileDetails === null ||
                      typeof localProfileDetails.verbal ==='undefined' ) ?
                      "": localProfileDetails.verbal}
               onChange={handleInputChange}/>
          </div>
        </div>

        <div className="ProfileUpdateItem">
          <div className="ProfileUpdateDetails">
            <p> Age* </p>
            <input className="ProfileUpdateDetails" type="text"
               defaultValue={(localProfileDetails === null ||
                      typeof localProfileDetails.age ==='undefined' ) ? "":localProfileDetails.age} 
               name="age"
               value={(localProfileDetails === null ||
                      typeof localProfileDetails.age ==='undefined' ) ?
                      "": localProfileDetails.age}
               onChange={handleInputChange}/>
          </div>
        </div>

        <div className="ProfileUpdateItem">
          <div className="ProfileUpdateDetails">
            <p> Public ID (to share the profile link with others)*</p>
            <input className="ProfileUpdateDetails" type="text"
               defaultValue={(localProfileDetails === null ||
                      typeof localProfileDetails.public_id ==='undefined' ) ? "":localProfileDetails.public_id} 
               name="public_id"
               value={(localProfileDetails === null ||
                      typeof localProfileDetails.public_id ==='undefined' ) ?
                      "": localProfileDetails.public_id}
               onChange={handleInputChange}/>
          </div>
        </div>
        <div className="ProfileUpdateItem">
            <button type="button" onClick={handleSubmit}>Submit</button>
        </div>
        <div className="ProfileUpdateItem">
            <button type="button" onClick={() => { navigate('/DependentProfile');}}>Back</button>
        </div>
      </div>

      <div className="Bottom">
        <p>.</p>
      </div>
    </div>
        );
}
