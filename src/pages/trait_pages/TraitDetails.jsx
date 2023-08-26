import {React, useState, useEffect, useContext} from "react";
import { API } from '@aws-amplify/api'
import { ParameterContext } from '../../App';


import "./TraitDetails.css"

const localGetTraitQuestionList = /* GraphQL Update this if schema changes */ `
  query GetTraitQuestionList($id: ID!) {
    getTraitQuestionList(id: $id) {
      QuestionList {
        id
        Name
        Description
        Type
        DefaultSelection
        Options {
            id
            OptionText
        }
        __typename
      }
      __typename
    }
  }
`;

async function list_trait_questions(id) {
  // Probably need to fetch the answer options too.
    console.log("Querying for Questions for ID : " + id);

  try {
    const response = await API.graphql({
      query: localGetTraitQuestionList,
      variables: {
        id:id
      },
    })
    console.log("Received response from getTraitQuestionList");
    // For local testing.
    if (typeof response.data =='undefined' || 
        typeof response.data.getTraitQuestionList =='undefined' || 
        typeof response.data.getTraitQuestionList.QuestionList =='undefined' || 
        response.data.getTraitQuestionList.QuestionList.length === 0) {
        console.log("Returning mock result for undefined results.");

      return [{name: "SleepTiming",
               description: "How many hours of sleep do they usually have?.",
               type: "single",
               Options: [{
                   id: 1,
                   text: "4-5 hours.",
               }, {
                   id: 2,
                   text: "6-7 hours.",
               }, {
                   id: 3,
                   text: "8-10 hours.",
               }, {
                   id: 4,
                   text: "Less than 4.",
               }, {
                   id: 5,
                   text: "more than 10.",
               }],
               default_selection: 2,
               id:101},
          {name: "SleepRoutines",
               description: "Typical things to do before bedtime?.",
               type: "details",
               Options: [],
               default_selection: "Brushing followed by change in clothes.",
               id:104},
          {name: "SleepBReakers",
               description: "What will cause the sleep to break?.",
               type: "multiple",
               Options: [{
                   id: 1,
                   text: "Lights."
               }, {
                   id: 2,
                   text: "Sounds."
               }, {
                   id: 3,
                   text: "Smells."
               }, {
                   id: 4,
                   text: "Touch."
               }
               ],
               default_selection: [1, 4],
               id:105}
          ];
    }

    return response.data.getTraitQuestionList.QuestionList;
  } catch (error) {
    console.error(`Cought error in function : ${error}`);
    return  [{name: "SleepTiming",
               description: "How many hours of sleep do they usually have?.",
               type: "single",
               Options: [{
                   id: 1,
                   text: "4-5 hours",
               }],
               default_selection: 2,
               id:101},
          {name: "SleepRoutines",
               description: "Typical things to do before bedtime?.",
               type: "details",
               Options: [],
               default_selection: "Brushing followed by change in clothes.",
               id:104},
          {name: "SleepBReakers",
               description: "What will cause the sleep to break?.",
               type: "multiple",
               Options: [{
                   id: 4,
                   text: "Touch"
               }
               ],
               default_selection: [1, 4],
               id:105}
          ];
  }
}

function PopulateOptions({TraitOptions}) {
  const onOptionClick = (OptionText) => {
    console.log("Option clicked : " + OptionText);
    // setSelectedTrait(value);
  };
  
  if (typeof TraitOptions === 'undefined' || TraitOptions.length === 0) {
      console.log("TraitOptions : undefined or empty");
      return;
  }

  if (TraitOptions.length === 1) {
      if (TraitOptions[0].OptionText == null) {
         console.log("TraitOptions has null value");
         return;
      }
  }
  // Check selected options here.
  return (
    <div className="TraitOptionsList">
    {
        TraitOptions.map((value, index) => (
          <div className="TraitOptionItem" key={value.id + Math.random()}>
            <button type="button" onClick={() => {onOptionClick(value.OptionText)}} key={value.id} disabled={false}> {value.OptionText}
            </button>
          </div>
        ))
    }
    </div>
  );
}

function PopulateDescriptionOption() {
  return (
    <input className="TraitOptionDetails" type="text" placeholder="Enter details if any .." />
  );
}

function DisplayTraitQuestions({TraitQuestionsList}) {
  if (typeof TraitQuestionsList === "undefined" ||
      TraitQuestionsList.length === 0 ) {
    // nothing to do as project not selected.
    console.log("Undefined TraitQuestionsList returning without fuss. XXXXXXX");
    return <div className="TraitQuestionsList"><div className="TraitDetails" href="#" key={0}>List loading..</div></div>;
  }
  // Add funtion which scrolls to the next question.
  return (
    <div className="TraitQuestionsList" key={TraitQuestionsList.length}>
      {TraitQuestionsList.map((value, index) => (
      <div className="TraitQuestionDetails" key={index}>
        <p> {index+1}/{TraitQuestionsList.length}: {value.Description} </p>
        <PopulateOptions TraitOptions={value.Options} key={value.id}/>
        <PopulateDescriptionOption />
      </div>
      ))}
    </div>
  );
}

export default function TraitDetails({UserId, DependentId, SelectedTrait}) {
  let [localTraitQuestionsList, setLocalTraitQuestionsList] = useState([]);
  const { selectedTraitCategory } = useContext(ParameterContext);
  console.log("Showing trait details for :  " + selectedTraitCategory);

  useEffect( () => {
    list_trait_questions(selectedTraitCategory)
        .then((trait_questions_from_async) => {
            setLocalTraitQuestionsList(trait_questions_from_async);
        });
  }, [selectedTraitCategory]);

  return (
    <div className="TraitDetailsContainer">
      <div className="TraitDetailsMain">
          <DisplayTraitQuestions TraitQuestionsList={localTraitQuestionsList} />
      </div>
      <div className="Bottom">
        <p>.</p>
      </div>
    </div>
  );
}
