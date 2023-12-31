import {React, useState, useContext, useEffect} from "react";
import {useParams } from 'react-router-dom';

import "./CaregiverProfile.css"

// import rish_photo from '../assets/photos/about_rish_crop2.jpg'
import rish_photo from '../../assets/images/profile_picture.jpg'
import profile_picture from '../../assets/images/profile_picture.jpg'
import { ParameterContext } from '../../App';
import mixpanel from 'mixpanel-browser';

import { API } from '@aws-amplify/api'
import { getDependentDetails, getDependentPublicDetails, getCaregiverProfilePublic } from '../../graphql/queries'

function isIterable(item) {
  return typeof item !== 'undefined' && typeof item[Symbol.iterator] === 'function';
}

export const getCaregiverProfilePublicLocal = /* GraphQL */ `
  query GetCaregiverProfilePublic($public_id: String) {
    getCaregiverProfilePublic(public_id: $public_id) {
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

async function get_caregiver_profile_from_public_id(public_id) {
  try {
    console.log("Trying query now using public ID: ", public_id);
    
    const response = await API.graphql({
      query: getCaregiverProfilePublicLocal,
      variables: {
        public_id: public_id
      }
    });
    console.log("Query done");
    // For local testing.
    if (typeof response.data.getCaregiverProfilePublic  === 'undefined' ||
        response.data.getCaregiverProfilePublic === null) {
          console.log("Returning mock result");
      return {
          caregiver_categories: [{
            trait_category_name: "Something went wrong. Try refresh for a couple of times.",
            trait_response_strings: [
                {
                    trait_question: "Breakfast time",
                    trait_responses: ["6am to 7am"],
                    trait_text_response: "Slow to start the day. Start with juice. Then continue with some hot breakfast. end"
                }]
          }]
      };
    }
    return response.data.getCaregiverProfilePublic;
  } catch (error) {
    console.log("Returning error result");
    console.error(`Cought error in function : ${error}`);
    return {
          caregiver_categories: [
          ]
      }
  }
}

function GetCategoryButtonList(props) {   
  const result = [];
  
  if (typeof props.caregiverCategories.caregiver_categories !== 'undefined') {
    console.log("Adding buttos now  ",  props.caregiverCategories.caregiver_categories.length);
    props.caregiverCategories.caregiver_categories.forEach((category, index) => {
      result.push(<button type="button" key={Math.random()}> <a href={"#" + category.trait_category_name}>  {category.trait_category_name} </a> </button>);
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
  if (typeof props.caregiverCategories.caregiver_categories === 'undefined' ||
  props.caregiverCategories.caregiver_categories.length === 0) {
    console.log("Cannot set div, caregiver_categories undefined");
    return (
          <div id="ErrorID" className="CaregiverProfile">
              <p> Loading. If this takes more than 30s, please reload. </p>
              <p> If multiple reloads dont work, kindly contact admin@onboard.icu. </p>
              <p> Thanks for your continued support !</p>
          </div>);
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

  mixpanel.init('a709584ba68b4297dce576a32d062ed6', { debug: true, track_pageview: true, persistence: 'localStorage' });
  mixpanel.track('Caregiver Profile opened', {
      'Dependent Name': dependent_public_id
    });

  useEffect( () => {
      if (dependent_public_id.length > 0) {
        get_caregiver_profile_from_public_id(dependent_public_id)
        .then((caregiver_profile_from_async) => {
            setLocalCaregiverProfile(caregiver_profile_from_async);
            console.log("Setting LocalCaregiverProfile : ", typeof caregiver_profile_from_async.caregiver_categories);
            console.log("Setting LocalCaregiverProfile length  : ", caregiver_profile_from_async.caregiver_categories.length);
        });
      } else {
          setLocalCaregiverProfile({caregiver_categories: [{
            trait_category_name: "Please go back to the public profile page ",
            trait_response_strings: [
                {
                    trait_question: "The ",
                    trait_responses: ["."],
                    trait_text_response: ".."
                }]
        
          }]});
      }
  }, []);

  console.log("localCaregiverProfile details :  ", typeof localCaregiverProfile.caregiver_categories);
  if (typeof localCaregiverProfile.caregiver_categories !== 'undefined') {
      console.log("localCaregiverProfile length :  ", localCaregiverProfile.caregiver_categories.length);
  }

  return (
    <div className="CaregiverProfileContainer">
      <div className="CaregiverProfileMain">
        <div className="CaregiverHomeTopbar">
            <div className="CaregiverHomeName">
              <h2> Details for caregivers </h2>
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
