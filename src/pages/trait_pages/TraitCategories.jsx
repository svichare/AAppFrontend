import {React, useState, useEffect, useContext} from "react";
import { useNavigate } from 'react-router-dom';
import { API } from '@aws-amplify/api'
import { allTraitCategories } from '../../graphql/queries'
import { ParameterContext } from '../../App';


import "./TraitCategories.css"

import profile_picture from '../../assets/images/profile_picture.jpg'

// API.configure({
//   // "aws_project_region": process.env.REACT_APP_PROJECT_REGION,
//   // "aws_appsync_graphqlEndpoint": process.env.REACT_APP_APPSYNC_GRAPHQLENDPOINT,
//   // "aws_appsync_region": process.env.REACT_APP_APPSYNC_REGION,
//   //"aws_appsync_authenticationType": process.env.REACT_APP_APPSYNC_AUTHENTICATIONTYPE,
// //   "aws_appsync_apiKey": process.env.REACT_APP_APPSYNC_APIKEY
//   "aws_project_region": "us-east-1",
//   "aws_appsync_graphqlEndpoint": "https://tixhdigrwnbwrciiub3l25fmui.appsync-api.us-east-1.amazonaws.com/graphql",
//   "aws_appsync_region": "us-east-1",
//   "aws_appsync_authenticationType": "API_KEY",
//   "aws_appsync_apiKey": "da2-xn5orfnwpjf7fkcnrfdtf3mgwi"
// })


async function list_project_tasks(id) {
  try {
    const response = await API.graphql({
      query: allTraitCategories,
      variables: {
      },
    });
    // For local testing.
    if (response.data.allTraitCategories.length === 0) {
      return [{Name: "Physical Activities.",
               Description: "Mock trait category",
               id:101},
      {Name: "Sleep Schedule.",
               Description: "Mock trait category 103",
               id:103}];
    }
    return response.data.allTraitCategories;
  } catch (error) {
    console.error(`Cought error in function : ${error}`);
    return [{Name: "Physical Activities.e",
               Description: "Mock trait category",
               id:101},
      {Name: "Sleep Schedule.e",
               Description: "Mock trait category 103",
               id:103}];
  }
}

function DisplayTraitCategories({TraitCategoryList, setSelectedTraitCategory, navigate}) {
  if (typeof TraitCategoryList === "undefined" ||
  TraitCategoryList.length === 0 ) {
    // nothing to do as project not selected.
    console.log("Undefined TraitCategoryList returning without fuss. XXXXXXX");
    return <div className="TraitCategoriesList"><div className="TraitCategory" href="#" key={0}>List empty..</div></div>;
  }
  
  const onCategoryClick = (categoryId) => {
    console.log("TraitCategory clicked : " + categoryId);
    setSelectedTraitCategory(categoryId);
    navigate("/TraitDetails");
  };
  return (
    <div className="TraitCategoriesList">
      {
        TraitCategoryList.map((value, index) => (
          <div className="TraitCategory"  key={value.id}>
            <button type="button" onClick={() => onCategoryClick(value.id)} key={value.id}> {value.Name}
            </button>
          </div>
        ))
      }
    </div>
  );
}

export default function TraitCategories({dependentId}) {
  let [localTraitCategoryList, setLocalTraitCategoryList] = useState([]);
  // let [localSelectedTraitCategory, setLocalSelectedTraitCategory] = useState([]);
  const { setSelectedTraitCategory } = useContext(ParameterContext);

  const navigate = useNavigate();

  useEffect( () => {
    list_project_tasks()
    .then((trait_categories_from_async) => {
      setLocalTraitCategoryList(trait_categories_from_async);
    });
  }, []);

  return (
    <div className="TraitCategoriesContainer">
      <div className="TraitCategoriesMain">
        <div className="TraitCategoriesTopbar">
            <div className="TraitCategoriesName">
              <h3>Select a category to view/update</h3>
            </div>
        </div>
          <DisplayTraitCategories TraitCategoryList={localTraitCategoryList}
                                  setSelectedTraitCategory={setSelectedTraitCategory}
                                  navigate={navigate}/>
      </div>
      <div className="Bottom">
        <p>.</p>
      </div>
    </div>
  );
}
