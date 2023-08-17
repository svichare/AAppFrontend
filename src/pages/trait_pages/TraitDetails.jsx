import {React, useState, useEffect} from "react";

import "./TraitDetails.css"

import profile_picture from '../../assets/images/profile_picture.jpg'

async function list_trait_questions(id) {
  // Probably need to fetch the answer options too.
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
    if (response.data.traitQuestions.length === 0) {
      return [{name: "SleepTiming",
               description: "How many hours of sleep do they usually have?.",
               id:101},
      {name: "SleepLights",
               description: "What are the light settings they prefer at night?.",
               id:103}];
    }
    return response.data.traitCategories;
  } catch (error) {
    console.error(`Cought error in function : ${error}`);
    return  [{name: "SleepTiming",
               description: "How many hours of sleep do they usually have?.",
               id:101},
      {name: "SleepLights",
               description: "What are the light settings they prefer at night?.",
               id:103}];
  }
}

function DisplayTraitDetails({TraitQuestionsList}) {
  if (typeof TraitQuestionsList === "undefined" ||
  TraitQuestionsList.length === 0 ) {
    // nothing to do as project not selected.
    console.log("Undefined TraitCategoryList returning without fuss. XXXXXXX");
    return <div class="TraitDetailsList"><div class="TraitDetails" href="#" key={0}>List empty..</div></div>;
  }
  return (
    <div class="TraitDetailsList">
      {
        TraitQuestionsList.map((value, index) => (
          <p class="TraitDetails">
            {value.description}
          </p>
        ))
      }
    </div>
  );
}

export default function TraitDetails({UserId, DependentId, SelectedTrait}) {
  let [localTraitQuestionsList, setLocalTraitQuestionsList] = useState([]);
  let [selectedTraitCategory, setSelectedTraitCategory] = useState([]);

  useEffect( () => {
    list_trait_questions()
    .then((trait_questions_from_async) => {
      setLocalTraitQuestionsList(trait_questions_from_async);
    });
  }, []);

  return (
    <div className="Container">
      <div className="Main">
          <DisplayTraitDetails TraitQuestionsList={localTraitQuestionsList} />
      </div>
      <div className="Bottom">
        <p>.</p>
      </div>
    </div>
  );
}
