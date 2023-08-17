import {React, useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';


import "./TraitCategories.css"

import profile_picture from '../../assets/images/profile_picture.jpg'

async function list_project_tasks(id) {
  try {
    var response = {
      data : {
        traitCategories: []
      }
    };
    // const response = await API.graphql({
    //   query: allProjectTasks,
    //   variables: {
    //     projectId:id
    //   },
    // })
    // For local testing.
    if (response.data.traitCategories.length === 0) {
      return [{name: "Physical Activities.",
               description: "Mock trait category",
               id:101},
      {name: "Sleep Schedule.",
               description: "Mock trait category 103",
               id:103}];
    }
    return response.data.traitCategories;
  } catch (error) {
    console.error(`Cought error in function : ${error}`);
    return [{name: "Physical Activities.e",
               description: "Mock trait category",
               id:101},
      {name: "Sleep Schedule.e",
               description: "Mock trait category 103",
               id:103}];
  }
}

function DisplayTraitCategories({TraitCategoryList, setSelectedTrait, navigate}) {
  if (typeof TraitCategoryList === "undefined" ||
  TraitCategoryList.length === 0 ) {
    // nothing to do as project not selected.
    console.log("Undefined TraitCategoryList returning without fuss. XXXXXXX");
    return <div class="TraitCategoriesList"><div class="TraitCategory" href="#" key={0}>List empty..</div></div>;
  }
  
  const onCategoryClick = () => {
    console.log("TraitCategory clicked");
    // setSelectedTrait(value);
    navigate("/TraitDetails");
  };
  return (
    <div class="TraitCategoriesList">
      {
        TraitCategoryList.map((value, index) => (
          <div class="TraitCategory">
            <button type="button" onClick={onCategoryClick} key={value.id}> {value.name}
            </button>
          </div>
        ))
      }
    </div>
  );
}

export default function TraitCategories({dependentId}) {
  let [localTraitCategoryList, setLocalTraitCategoryList] = useState([]);
  let [selectedTraitCategory, setSelectedTraitCategory] = useState([]);
  
  const navigate = useNavigate();

  useEffect( () => {
    list_project_tasks()
    .then((trait_categories_from_async) => {
      setLocalTraitCategoryList(trait_categories_from_async);
    });
  }, []);

  return (
    <div className="Container">
      <div className="Main">
        <div className="TraitCategoriesTopbar">
            <div className="TraitCategoriesName">
              <h3>Select a category to view or update</h3>
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
