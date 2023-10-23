import {React, useState, useEffect, useContext} from "react";
import { useNavigate } from 'react-router-dom';
import { API } from '@aws-amplify/api'
import { allTraitCategories } from '../../graphql/queries'
import { ParameterContext } from '../../App';


import "./TraitCategories.css"

import profile_picture from '../../assets/images/profile_picture.jpg'

async function list_trait_categories() {
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
    return <div className="TraitCategoriesList"><div className="TraitCategory" href="#" key={0}>List loading..</div></div>;
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
    list_trait_categories()
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
          <div className="TraitCategoryBack">
                <button type="button" onClick={() => { navigate('/DependentProfile');}}>Back</button>
          </div>
      </div>
      <div className="Bottom">
        <p>.</p>
      </div>
    </div>
  );
}
