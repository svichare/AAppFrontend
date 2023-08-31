import {React, useState, useEffect, useContext} from "react";
import { API, graphqlOperation } from '@aws-amplify/api'
import { ParameterContext } from '../../App';


import "./TraitDetails.css"

import { getTraitCategoryResponses } from '../../graphql/queries'
import { updateTraitResponse } from '../../graphql/mutations'


function isIterable(item) {
  return typeof item !== 'undefined' && typeof item[Symbol.iterator] === 'function';
}

async function get_category_responses(dependent_name, trait_category) {
  var cur_compound_id = dependent_name+ "_" + trait_category;
  console.log("Looking for responses for compund_id : " + cur_compound_id);
  try {
    console.log("Checking request  : " + dependent_name);
    const response = await API.graphql({
      query: getTraitCategoryResponses,
      variables: {
        compound_id: cur_compound_id
      },
    });
    console.log("Checking response  : " + cur_compound_id);
    if (typeof response.data.getTraitCategoryResponses == 'undefined') {
      return{
      "compound_id": "Beta_1",
      "dependent_id": "101",
      "trait_category_id": "1",
      "trait_responses": [
        {
          "text_response": "This is mocky response1.",
          "trait_id": "1"
        },
        {
          "text_response": "This is mocky response2.",
          "trait_id": "2"
        }
      ]
    };
    }
    console.log("Returning data from lambda for ID : " + dependent_name);
    return response.data.getTraitCategoryResponses;
  } catch (error) {
    console.error(`Cought error in function : ${error}`);
    return{
      "compound_id": "Beta_1",
      "dependent_id": "101",
      "trait_category_id": "1",
      "trait_responses": [
        {
          "text_response": "This is errory response1.",
          "trait_id": "1"
        },
        {
          "text_response": "This is errory response2.",
          "trait_id": "2"
        }
      ]
    };
  }
}


// The schema was initially not updated. Now it is. So this is probably not needed.
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

function PopulateOptions({TraitOptions, SelectedResponseIds}) {
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
        // console.log("TraitOptions has null value");
         return;
      }
  }
  console.log("Checking which options are selected");
  
  if (typeof SelectedResponseIds !== 'undefined' &&
      SelectedResponseIds != null) {
    console.log("Size of TraitOptions : " + TraitOptions.length + " : SelectedResponseIds" + SelectedResponseIds.length);
    for (var i = 0; i < TraitOptions.length; ++i) {
      TraitOptions[i].is_selected = false;
      const matchingEntry = SelectedResponseIds.find(entry => 
          entry.id == TraitOptions[i].id
        );
      if (matchingEntry) {
        TraitOptions[i].is_selected = true;
      }
    }
  }
  
  // Check selected options here.
  return (
    <div className="TraitOptionsList">
    {
        TraitOptions.map((value, index) => (
          <div className="TraitOptionItem" key={value.id + Math.random()}>
            <button type="button" onClick={() => {onOptionClick(value.OptionText)}} key={value.id} disabled={value.is_selected}> {value.OptionText}
            </button>
          </div>
        ))
    }
    </div>
  );
}

async function update_trait_response(curTraitId, curCategoryId,
    curDependentStringId, curSelectedId, curSelectedText, curSelectedUpdated,
    curTextResponse, curTextResponseUpdated) {
  // update actionItem with the response.
  console.log("Updating response to : " + curTextResponse);
  const update_trait_response_details = {
    traitId: curTraitId,
    traitCategoryId: curCategoryId,
    dependentId: curDependentStringId,
    selectedId: 0,
    selectedIdText: "",
    isSelectedIdUpdated: false,
    textResponse: curTextResponse,
    textResponseUpdated: curTextResponseUpdated
  };

  try {
    console.log("Updating the text response.");
      const response = await API.graphql(
        graphqlOperation(updateTraitResponse,
          {updateTraitResponseInput: update_trait_response_details}));
      console.log("received response : ", JSON.stringify(response));
  } catch (error) {
      console.error('Cought error in update_action_response function :',  JSON.stringify(error));
  }
}

function PopulateDescriptionOption({TextResponse, TraitCategoryId, TraitId}) {
  var placeholder_text = (TextResponse == "" ? "Enter details if any .." : "");

  var dependent_string_id = "Beta";
  
  const handleTextResponseChange = (updatedResponse) => {
    update_trait_response(TraitId, TraitCategoryId, dependent_string_id, 0,
    "", false,  updatedResponse, true);
  };

    
  return (
    <input className="TraitOptionDetails" type="text"
           placeholder={placeholder_text} defaultValue={TextResponse}
           onChange={(e) => {
            // TextResponse = e.target.value;
            handleTextResponseChange(e.target.value);
          }}/>
  );
}

function DisplayTraitQuestions({TraitQuestionsList, TraitCategoryId}) {
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
        <PopulateOptions TraitOptions={value.Options} SelectedResponseIds={value.selected_response_ids} key={value.id}/>
        <PopulateDescriptionOption TextResponse={value.text_response}
                                   TraitCategoryId={TraitCategoryId}
                                   TraitId={value.id}/>
      </div>
      ))}
    </div>
  );
}

export default function TraitDetails({UserId, DependentId, SelectedTrait}) {
  let [localTraitQuestionsList, setLocalTraitQuestionsList] = useState([]);
  let [localTraitReponseList, setLocalTraitReponseList] = useState([]);

  const { selectedTraitCategory, dependentStringId } = useContext(ParameterContext);
  console.log("Showing trait details for :  " + selectedTraitCategory);

  useEffect( () => {
    console.log("Quering Question List.");
    list_trait_questions(selectedTraitCategory)
        .then((trait_questions_from_async) => {
            console.log("Received QuestionList. Now quering responses.");
            get_category_responses(dependentStringId, selectedTraitCategory)
            .then((trait_responses_from_async) => {
                setLocalTraitReponseList(trait_responses_from_async);
                console.log("Received responses. Now checking if there is any match.");
                console.log("Question list length : " + trait_questions_from_async.length);
                if (typeof trait_responses_from_async == 'undefined' ||
                  typeof trait_responses_from_async.trait_responses == 'undefined' || 
                  trait_responses_from_async == null ||
                  trait_responses_from_async.trait_responses == null) {
                  // Nothing to match with.
                  setLocalTraitQuestionsList(trait_questions_from_async);
                  return;
                }
                console.log("Typeof trait_responses_from_async.trait_responses" +
                  typeof trait_responses_from_async.trait_responses);
                for (var trait_question of trait_questions_from_async) {
                    const matchingEntry =
                        trait_responses_from_async.trait_responses.find(
                            entry => entry.trait_id == trait_question.id);
                    if (matchingEntry) {
                      console.log("Found matching entry for : " + matchingEntry.trait_id);
                      if (typeof matchingEntry.selected_response_ids != 'undefined') {
                        console.log("  including response of length : " + matchingEntry.selected_response_ids.length);
                        trait_question.selected_response_ids = matchingEntry.selected_response_ids;
                      }
                      console.log("Including text_response : " + matchingEntry.text_response);
                      // Should the entire object be copied instead of specific values?
                      trait_question.text_response = matchingEntry.text_response;
                    } else {
                        console.log("DID NOT find matching entry for : " + trait_question.id);
                    }
                }
                
                setLocalTraitQuestionsList(trait_questions_from_async);

            });
        });
  }, [selectedTraitCategory]);

  return (
    <div className="TraitDetailsContainer">
      <div className="TraitDetailsMain">
          <DisplayTraitQuestions TraitQuestionsList={localTraitQuestionsList}
          TraitCategoryId={selectedTraitCategory}
          />
      </div>
      <div className="Bottom">
        <p>.</p>
      </div>
    </div>
  );
}
