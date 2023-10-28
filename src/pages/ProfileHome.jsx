import { React, useEffect, useState, useContext } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import svichare_photo from '../assets/photos/about_alone.jpg'
import profile_photo from '../assets/images/profile_picture.jpg'
import profile_pic_round from '../assets/images/profile_pic_round.png'
import dependent_add_pic from '../assets/images/dependent_add_pic_png.png'

import { API } from '@aws-amplify/api'
import { getParentDetails, getDependentProfileComplete } from '../graphql/queries'
import { ParameterContext } from '../App';
import { useUser } from '../components/UserContext';
import { useDependent } from '../components/DependentContext';

import "./ProfileHome.css"
import { Button } from "@mui/material";

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

async function get_profile_completeness(cur_dependent_id) {
  try {
    console.log("Getting response count");
    const response = await API.graphql({
      query: getDependentProfileComplete,
      variables: {
        dependent_id: cur_dependent_id
      },
    });
    // For local testing.
    if (typeof response.data.getDependentProfileComplete === 'undefined') {
      return 0;
    }
    return response.data.getDependentProfileComplete;
  } catch (error) {
    console.error(`Cought error in function : ${error}`);
    return [];
  }
}


export default function ProfileHome({ userEmailParameter, resetUserEmail }) {
  const { setDependentStringId } = useContext(ParameterContext);

  useContext(ParameterContext);
  const { user } = useUser();
  const { set_dependent } = useDependent();
  const [localUserEmail, setLocalUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [dependentCompletenessMap, setDependentCompletenessMap] = useState(new Map());

  const [userData, setUserData] = useState({
    name: "Mock Value",
    last_name: "Kaavi",
    id: "topId",
    image_url: "../assets/images/profile_picture.jpg",
    dependents: []
  });

  const navigate = useNavigate();

  useEffect(() => {
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
          setLoading(false);

          profile_details_from_async.dependents.forEach((dependentData, index) => {
            console.log("fetching data from : ", dependentData.string_id);
            get_profile_completeness(dependentData.string_id).then((completeness_score_from_async) => {
              dependentCompletenessMap.set(dependentData.string_id, completeness_score_from_async);
              const newMap = new Map(dependentCompletenessMap);
              newMap.set(dependentData.string_id, completeness_score_from_async);
              setDependentCompletenessMap(newMap);
              console.log("Profile of ", dependentData.string_id, " ", completeness_score_from_async, "% complete.");
            });
          });
        });
    }
  }, [navigate, user]);


  const dependent_list = [];
  if (isIterable(userData.dependents)) {
    userData.dependents.forEach((dependentData, index) => {
      dependent_list.push(
        <div className="DependentListItem">
          <Link to="/DependentProfile">
            <div className="DependentPhoto" onClick={
              () => {
                setDependentStringId(dependentData.string_id);
                set_dependent({ string_id: dependentData.string_id })
              }}>
              <img src={profile_pic_round} alt="profile_pic_round" />
            </div>
          </Link>
          <div className="DependentName"><p>{dependentData.name}</p></div>
          {dependentCompletenessMap.has(dependentData.string_id) ?
            <div className="NextSteps"><p>Profile {dependentCompletenessMap.get(dependentData.string_id)}% Complete</p></div> :
            <div className="NextSteps"><p>Loading profile status</p></div>}
        </div>
      );
    });
  }
  dependent_list.push(
    <div className="DependentListItem">
      <Link to="/AddDependent">
        <div className="DependentPhoto">
          <img src={dependent_add_pic} alt="add dependent" />
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

    if (user.image_url == null || typeof user.image_url === 'undefined') {
      return profile_photo;
    }

    return resizeImage(user.image_url);
  }

  const resizeImage = (url) => {
    // Check if the url has the size attribute
    if (url.includes("=s")) {
      // Split the url by the equal sign
      let parts = url.split("=");
      // Get the last part, which is the size attribute
      let size = parts[parts.length - 1];
      // Replace the size value with a higher number, such as 500
      let newSize = size.replace(/\d+/, "500");
      // Join the parts back with the new size
      let newUrl = parts.slice(0, -1).join("=") + "=" + newSize;
      // Return the new url
      return newUrl;
    } else {
      // If the url does not have the size attribute, return the original url
      return url;
    }
  }


  const returnWelcomeMessage = () => {
    if (userData.name == null || typeof userData.name === 'undefined') {
      return "Welcome new user. Update your profile using options below.";
    }

    if (userData.name === "Error") {
      return "Error connecting to cloud. Try refreshing this page.";
    }

    if (userData.name === "Mock Value") {
      return "Loading..";
    }

    return userData.name;
  }

  return (
    <div className="ProfileHomeContainer">
      {loading ? (
        // Show a loading screen when loading is true
        <div className="LoadingPage"> <h2>Loading...</h2> </div>
      ) : (
        <div>
          <div className="ProfileHomeMain">
            <div className="ProfileHomeTopbar">
              <div className="ProfileImage">
                <img id="profileImage" src={returnProfilePic()} alt="profile_photo" />
              </div>
              <div className="ProfileName">
                <h4>{returnWelcomeMessage()}</h4>
              </div>
            </div>

            <p>Email : {localUserEmail}</p>
            <div className="NextSteps">
              <p>{dependent_list.length <= 1 ? "Next steps: Add dependents to your profile" : "To update or view profiles of your dependents, click on the list below"}</p>
            </div>
            <h4>Your dependent list .. </h4>
            <div className="DependentList">
              {dependent_list}
            </div>
            <Button size="large" variant="contained" component={Link} to="/UpdateProfile">
              Update Bio
            </Button>

          </div>
          <div size="large" variant="contained" className="ProfileHomeBottom">
            <p>.</p>
          </div>
        </div>
      )}
    </div>
  );
}
