import {React, useState, useContext, useEffect} from "react";
import { useNavigate, useParams } from 'react-router-dom';

import "./CaregiverProfile.css"

// import rish_photo from '../assets/photos/about_rish_crop2.jpg'
import rish_photo from '../../assets/images/profile_picture.jpg'
import profile_picture from '../../assets/images/profile_picture.jpg'
import { ParameterContext } from '../../App';

import { API } from '@aws-amplify/api'
import { getDependentDetails } from '../../graphql/queries'

function isIterable(item) {
  return typeof item !== 'undefined' && typeof item[Symbol.iterator] === 'function';
}

const getCaregiverProfileLocal = /* GraphQL */ `
  query GetCaregiverProfile($dependent_id: String) {
    getCaregiverProfile(dependent_id: $dependent_id) {
      dependent_id
      caregiver_categories {
        trait_category_name
        trait_response_strings {
          trait_question
          trait_responses
          trait_text_response
        }
        __typename
      }
      __typename
    }
  }
`;

async function get_caregiver_profile(dependent_id) {
  try {
    console.log("Trying query now");
    const response = await API.graphql({
      query: getCaregiverProfileLocal,
      variables: {
        dependent_id: dependent_id
      }
    });
    console.log("Query done");
    // For local testing.
    if (typeof response.data.getCaregiverProfile  === 'undefined' ||
        response.data.getCaregiverProfile === null) {
          console.log("Returning mock result");
      return {
          caregiver_categories: [{
            trait_category_name: "Food mock",
            trait_response_strings: [
                {
                    trait_question: "Breakfast time",
                    trait_responses: ["6am to 7am"],
                    trait_text_response: "Slow to start the day. Start with juice. Then continue with some hot breakfast. end"
                }]
          }]
      };
    }
    return response.data.getCaregiverProfile;
  } catch (error) {
    console.log("Returning error result");
    console.error(`Cought error in function : ${error}`);
    return {
          caregiver_categories: [{
            trait_category_name: "Food error",
            trait_response_strings: [
                {
                    trait_question: "Breakfast time",
                    trait_responses: ["6am to 7am"],
                    trait_text_response: "Slow to start the day. Start with juice. Then continue with some hot breakfast. end"
                }]
        
          }]
      }
  }
}

function GetCategoryButtonList(props) {   
  const result = [];
  
  if (typeof props.caregiverCategories.caregiver_categories !== 'undefined') {
    console.log("Adding buttos now  ",  props.caregiverCategories.caregiver_categories.length);
    props.caregiverCategories.caregiver_categories.forEach((category, index) => {
      result.push(<button type="button" > <a href={"#" + category.trait_category_name}>  {category.trait_category_name} </a> </button>);
    });
  } else {
    console.log("Setting LocalCaregiverProfile : ", typeof props.caregiverCategories.caregiver_categories);
    console.log("Cannot go through caregiverCategories.caregiver_categories",
    typeof props.caregiverCategories.caregiver_categories)
  }
  
  return result;
}

function DisplayOneTraitQuestion(props) {
  console.log("Trying to print a category");
  if (typeof props.trait.trait_question === 'undefined') {
    console.log("Cannot set trait q, trait_question undefined");
    return;
  }
  if (props.trait.trait_question.length === 0) {
        console.log("Cannot set trait q, trait_question length 0");
    return;
  }
  console.log("Returning trait : ", props.trait.trait_question);
  return (
    // Add anything specific to this category here. For now iterating over the question list 
    <div className="CaregiverCategory">
        <strong>{props.trait.trait_question} </strong>
        {props.trait.trait_responses.map((response, index) => (
          <p> {response} </p>
        ))}
        <p> {props.trait.trait_text_response} </p>
    </div>
  );
}

function DisplayOneTraitCategory(props) {
  console.log("Trying to print a category");
  if (typeof props.traitCategory.trait_category_name === 'undefined') {
    console.log("Cannot set div, caregiver_categories undefined");
    return;
  }
  if (props.traitCategory.trait_category_name.length === 0) {
        console.log("Cannot set div, caregiver_categories length 0");
    return;
  }
  console.log("Returning category div : ", props.traitCategory.trait_category_name);
  return (
    // Add anything specific to this category here. For now iterating over the question list 
    <div className="CaregiverCategory">
        <h3>{props.traitCategory.trait_category_name} </h3>
        {props.traitCategory.trait_response_strings.map((trait, index) => (
          <div className="CaregiverProfile">
            <DisplayOneTraitQuestion trait={trait} />
          </div>
        ))}
    </div>
  );
}

function GetProfile(props) {
  // return (<h2> Thats whats up</h2>);
  if (typeof props.caregiverCategories.caregiver_categories === 'undefined') {
    console.log("Cannot set div, caregiver_categories undefined");
    return;
  }
  if (props.caregiverCategories.caregiver_categories.length === 0) {
        console.log("Cannot set div, caregiver_categories length 0");
    return;
  }

  console.log("Including div now ", props.caregiverCategories.caregiver_categories.length);
  
  return (<div className="CaregiverProfile">
      {props.caregiverCategories.caregiver_categories.map((category, index) => (
        <div id={category.trait_category_name} className="CaregiverProfile">
          <DisplayOneTraitCategory traitCategory={category} />
        </div>
      ))}
    </div>
  )
}


export default function CaregiverProfile() {
  let [localCaregiverProfile, setLocalCaregiverProfile] = useState([]);
  let [localTraitCategoryList, setLocalTraitCategoryList] = useState([]);
  const { dependent_public_id } = useParams();
  const { dependentStringId } = useContext(ParameterContext);
  const [dependentData, setDependentData] = useState({
    name: "a",
    lastName: "a",
    id: "a",
    age: 0
  });

  useEffect( () => {
      if (dependent_public_id.length > 0) {
        get_caregiver_profile(dependent_public_id)
        .then((caregiver_profile_from_async) => {
          setLocalCaregiverProfile(caregiver_profile_from_async);
          console.log("Setting LocalCaregiverProfile : ", typeof caregiver_profile_from_async.caregiver_categories);
          console.log("Setting LocalCaregiverProfile length  : ", caregiver_profile_from_async.caregiver_categories.length);
        });
      } else {
          setLocalCaregiverProfile({caregiver_categories: [{
            trait_category_name: "Categories loading .. ",
            trait_response_strings: [
                {
                    trait_question: "..",
                    trait_responses: ["."],
                    trait_text_response: ".."
                }]
        
          }]});
      }
  }, []);

  const navigate = useNavigate();

  const returnName = () => {
      if (dependentData.name == null || typeof dependentData.name === 'undefined') {
          return "";
      }
      return dependentData.name;
  }

  console.log("Showing dependent details for " + dependentStringId);
  console.log("localCaregiverProfile details :  ", typeof localCaregiverProfile.caregiver_categories);
  if (typeof localCaregiverProfile.caregiver_categories !== 'undefined') {
      console.log("localCaregiverProfile length :  ", localCaregiverProfile.caregiver_categories.length);
  }

  return (
    <div className="CaregiverProfileContainer">
      <div className="CaregiverProfileMain">
        <div className="CaregiverHomeTopbar">
            <div className="CaregiverHomeName">
              <h2> Caregiver Profile </h2>
              <p> Find all the important information required to help {returnName()} with daily needs.</p>
              <GetCategoryButtonList caregiverCategories={localCaregiverProfile} />
            </div>
        </div>
        <GetProfile caregiverCategories={localCaregiverProfile} />
      </div>
      <div className="Bottom">
        <p>.</p>
      </div>
    </div>
  );
}
