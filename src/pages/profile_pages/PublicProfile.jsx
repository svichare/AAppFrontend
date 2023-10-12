import {React, useState, useContext, useEffect} from "react";
import { useNavigate, useParams } from 'react-router-dom';

import "./PublicProfile.css"

import rish_photo from '../../assets/photos/rishaan_profile_pic.jpg'
import profile_picture from '../../assets/images/profile_picture.jpg'
import profile_pic_round from '../../assets/images/profile_pic_round.png'
import sun_smiling from '../../assets/images/sun_smilling_figma.png'

import { ParameterContext } from '../../App';

import { API } from '@aws-amplify/api'
import { getDependentPublicDetails } from '../../graphql/queries'
import mixpanel from 'mixpanel-browser';

function isIterable(item) {
  return typeof item !== 'undefined' && typeof item[Symbol.iterator] === 'function';
}

async function get_dependent_details(dependent_string_id) {

  try { 
    console.log("Checking request  : " + dependent_string_id);
    const response = await API.graphql({
      query: getDependentPublicDetails,
      variables: {
        public_id: dependent_string_id
      },
    });
    console.log("Checking response  : " + dependent_string_id);
    if (typeof response.data.getDependentPublicDetails == 'undefined') {
      return {
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Google_2011_logo.png/320px-Google_2011_logo.png",
        "name": "Mock User",
        "thumbnail_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Google_2011_logo.png/320px-Google_2011_logo.png",
        "id": 1505
      };
    }
    console.log("Returning data from lambda for ID : " + dependent_string_id);
    return response.data.getDependentPublicDetails;
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

export default function PublicProfile() {
  const { dependent_public_id } = useParams();
  const [dependentData, setDependentData] = useState({
    name: "",
    lastName: "a",
    id: "a",
    age: 0
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  mixpanel.init('a709584ba68b4297dce576a32d062ed6', { debug: true, track_pageview: true, persistence: 'localStorage' });
  mixpanel.track('PublicProfile opened', {
      'Dependent Name': dependent_public_id
    });
  useEffect( () => {
      if (dependent_public_id.length > 0) {
          get_dependent_details(dependent_public_id)
          .then((profile_details_from_async) => {
            setDependentData(profile_details_from_async);
            setLoading(false);
          });
      } else {
        console.log("No public profileID. Heading home");
        navigate('/Home');
      }
  }, []);

  const returnName = () => {
      if (dependentData.name == null || typeof dependentData.name === 'undefined') {
          return "";
      }
      return dependentData.name;
  }

  const returnAge = () => {
      if (dependentData.age == null || typeof dependentData.age === 'undefined') {
          return 0;
      }
      return dependentData.age;
  }
  const returnDiagnosis = () => {
      if (dependentData.diagnosis == null || typeof dependentData.diagnosis === 'undefined') {
          return 0;
      }
      if (dependentData.diagnosis === "None") {
        return "";
      }
      
      return dependentData.diagnosis
  }
  
  const returnVerbal = () => {
      if (dependentData.verbal == null || typeof dependentData.verbal === 'undefined') {
          return 0;
      }
      return dependentData.verbal;
  }

  const returnIntroLine = () => {
    var intro_text = "Rishaan is a sweet quiet boy who likes to be with his family.";
    if (dependentData.name == null || typeof dependentData.name === 'undefined') {
          return "";
      }
      if (dependentData.name === "Rishaan") {
        return intro_text;
      } else {
        return "";
    }
  }
  
  const returnDaignosisStory = () => {
      var intro_text = "Rishaan was daignosed with ASD by the age of 3." +
      " He hit all his milestones till the age of 2. After that he slowly started forgetting his skills. " +
      " By the age of 2.5, he stopped talking completely.";
      if (dependentData.name == null || typeof dependentData.name === 'undefined') {
          return "";
      }
      if (dependentData.name === "Rishaan") {
        return intro_text;
      } else {
        return "";
      }
  }

  const returnLikes = () => {
      var intro_text = "Rishaan likes to explore different textures and play with small textured toys." +
      " Rishaan likes to play in water. He likes to be picked up and swirled around.";
      if (dependentData.name == null || typeof dependentData.name === 'undefined') {
          return "";
      }
      if (dependentData.name === "Rishaan") {
        return intro_text;
      } else {
        return "";
      }
  }

  
  const returnEmergencyContact = () => {
    if (dependentData.name == null || typeof dependentData.name === 'undefined') {
          return "";
      }
      if (dependentData.name === "Rishaan") {
        return "408 230 8529, 703 663 0271 shivaji.vichare@gmail.com";
      } else {
        return "";
      }
  }

  const returnProfilePic = () => {
    if (dependentData.name == null || typeof dependentData.name === 'undefined') {
        return profile_pic_round;
    }
    if (dependentData.name == "Rishaan") {
      return rish_photo
    }

    return profile_pic_round
  }

  return (
    <div className="PublicProfileContainer">
    {loading ? (
        // Show a loading screen when loading is true
        <div className="LoadingPage"> <h2>Loading...</h2> </div>
        ) : (
        <div>
          <div className="PublicProfileMain">
            <div className="PublicHomeTopbar">
                <div className="PublicHomeImage">
                  <img src={returnProfilePic()} alt="profile_photo" />
                </div>
                <div className="PublicHomeName">
                  <h3> {returnName()} </h3>
                  <p> {returnDiagnosis()}</p>
                  <p> {returnVerbal()} </p>
                  <p> {returnAge() > 0 ? "Age: " + returnAge() : ""} </p>
                  <div className="PublicHomeButtons">
                    <button type="button" onClick={() => {
                        navigate('/PublicProfile/' + dependent_public_id + '/CaregiverProfile' );
                      }}> Details for Caregivers </button>
                    <button type="button" onClick={() => {
                      navigate('/OpenAICaregiver' );
                    }}> Talk to virtual assistant </button>
                  </div>
                  </div>
                </div>
                <div className="PublicHomeButtons">
            </div>
            <div className="ProfileIntroduction">
              <h2> Introduction </h2>
              <p> {returnIntroLine()} </p>
              <p> {returnDaignosisStory()} </p>
              <p> {returnLikes()} </p>
            </div>
          </div>
          <div className="Bottom">
            <p>.</p>
          </div>
          </div>
        )}
    </div>
  );
}
