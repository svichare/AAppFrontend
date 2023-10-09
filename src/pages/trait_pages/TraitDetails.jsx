import {React, useState, useEffect, useContext} from "react";
import { API, graphqlOperation } from '@aws-amplify/api'
import { ParameterContext } from '../../App';


import "./TraitDetails.css"

// import { getTraitCategoryResponses } from '../../graphql/queries'
import { updateTraitResponse } from '../../graphql/mutations'


function isIterable(item) {
  return typeof item !== 'undefined' && typeof item[Symbol.iterator] === 'function';
}

// Using local copy as the remote one keeps removing the subitems.
const getTraitCategoryResponsesLocal = /* GraphQL */ `
  query GetTraitCategoryResponses($compound_id: String) {
    getTraitCategoryResponses(compound_id: $compound_id) {
      compound_id
      dependent_id
      trait_category_id
      trait_responses {
        trait_id
        text_response
        selected_response_ids {
          option_text
          id
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

async function get_category_responses(dependent_name, trait_category) {
  var cur_compound_id = dependent_name+ "_" + trait_category;
  console.log("Looking for responses for compund_id : " + cur_compound_id);
  try {
    console.log("Checking request  : " + dependent_name);
    const response = await API.graphql({
      query: getTraitCategoryResponsesLocal,
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
            option_text
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

async function update_trait_response(curTraitId, curCategoryId,
    curDependentStringId, curSelectedId, curSelectedText, curSelectedUpdated,
    curTextResponse, curTextResponseUpdated) {
  // update actionItem with the response.
  const update_trait_response_details = {
    traitId: curTraitId,
    traitCategoryId: curCategoryId,
    dependentId: curDependentStringId,
    selectedId: curSelectedId,
    selectedIdText: curSelectedText,
    isSelectedIdUpdated: curSelectedUpdated,
    textResponse: curTextResponse,
    textResponseUpdated: curTextResponseUpdated
  };
  // const update_trait_response_details = {
  //   traitId: 1,
  //   traitCategoryId: 1,
  //   dependentId: "Beta",
  //   selectedId: 5,
  //   selectedIdText: "Before 5am (hardcoded)",
  //   isSelectedIdUpdated: true,
  //   textResponse: "Just for fun text update (hardcoded)",
  //   textResponseUpdated: false
  // };
  // console.log("Using hardcoded values."); 

  try {
    console.log("Updating the response. : ", JSON.stringify(update_trait_response_details));
      const response = await API.graphql(
        graphqlOperation(updateTraitResponse,
          {updateTraitResponseInput: update_trait_response_details}));
      console.log("received response : ", JSON.stringify(response));
  } catch (error) {
      console.error('Cought error in update_action_response function :',  JSON.stringify(error));
  }
}

function PopulateOptions({TraitOptions, SelectedResponseIds,
                          TraitCategoryId, TraitId, DependentId, setCounter,
                          counter, setSelectedIdChanged}) {
  if (typeof TraitOptions === 'undefined' || TraitOptions.length === 0) {
      console.log("TraitOptions : undefined or empty");
      return;
  }

  if (TraitOptions.length === 1) {
      if (TraitOptions[0].option_text == null) {
        // console.log("TraitOptions has null value");
         return;
      }
  }

  if (typeof SelectedResponseIds !== 'undefined' &&
      SelectedResponseIds != null) {
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
  
  const handleSelectedIdChange = async (updatedResponse, option_text, is_selected) => {
    console.log("Updating selectedID : " + updatedResponse + " : " + option_text);
    // await 
    update_trait_response(TraitId, TraitCategoryId, DependentId, updatedResponse,
    option_text, true,  "", false);
    setCounter(Math.random());
    if (is_selected) {
      console.log("Setting local copy changed to : ", JSON.stringify({
        has_changed: true,
        trait_id_changed: TraitId,
        selected_id_added: updatedResponse,
        selected_id_removed: 0
      }));
      setSelectedIdChanged({
        has_changed: true,
        trait_id_changed: TraitId,
        selected_id_added: updatedResponse,
        selected_id_removed: 0
      });
    } else {
      console.log("Setting local copy changed to : ", JSON.stringify({
        has_changed: true,
        trait_id_changed: TraitId,
        selected_id_added: 0,
        selected_id_removed: updatedResponse
      }));
      setSelectedIdChanged({
        has_changed: true,
        trait_id_changed: TraitId,
        selected_id_added: 0,
        selected_id_removed: updatedResponse
      });
    }
  };
  
  // Check selected options here.
  return (
    <div className="TraitOptionsList">
    {
        TraitOptions.map((value, index) => (
          <div className="TraitOptionItem" key={value.id + counter} value={value.is_selected ? "selected" : "not-selected"}>
            <button type="button"
            onClick={() => {
              value.is_selected = !value.is_selected;
              handleSelectedIdChange(value.id, value.option_text, value.is_selected);
            }}
            key={value.id} > {value.option_text}
            </button>
          </div>
        ))
    }
    </div>
  );
}

function PopulateDescriptionOption({TextResponse, TraitCategoryId,
                                    TraitId, DependentId}) {
  var placeholder_text = (TextResponse == "" ? "Enter details if any .." : "");

  const handleTextResponseChange = (updatedResponse) => {
    update_trait_response(TraitId, TraitCategoryId, DependentId, 0,
    "", false,  updatedResponse, true);
  };
    
  return (
    <textarea className="TraitOptionDetails" type="text"
    rows="2"
           placeholder={placeholder_text} defaultValue={TextResponse}
           onChange={(e) => {
            handleTextResponseChange(e.target.value);
          }}/>
  );
}

function DisplayTraitQuestions({TraitQuestionsList, TraitCategoryId, DependentId, setCounter, counter, setSelectedIdChanged}) {
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
        <PopulateOptions TraitOptions={value.Options}
                         SelectedResponseIds={value.selected_response_ids}
                         key={value.id}
                         TraitCategoryId={TraitCategoryId}
                         TraitId={value.id}
                         DependentId={DependentId}
                         setCounter={setCounter}
                         counter={counter}
                         setSelectedIdChanged={setSelectedIdChanged}/>
        <p>Additional specific details on this topic.(More details you add here, better the AI model will get.)</p>
        <PopulateDescriptionOption TextResponse={value.text_response}
                                   TraitCategoryId={TraitCategoryId}
                                   TraitId={value.id}
                                   DependentId={DependentId}/>
      </div>
      ))}
    </div>
  );
}

export default function TraitDetails({UserId, DependentId, SelectedTrait}) {
  let [localTraitQuestionsList, setLocalTraitQuestionsList] = useState([]);
  const [counter, setCounter] = useState(0);  // will be using it to re-render the page.
  let [selectedIdChanged, setSelectedIdChanged] = useState({
    has_changed: false,
    trait_id_changed: 0,
    selected_id_added: 0,
    selected_id_removed: 0
  });

  let [textResponseChanged, setTextResponseChanged] = useState({
    has_changed: false,
    trait_id_changed: 0,
    updated_test_response: ""
  });

  const { selectedTraitCategory, dependentStringId } = useContext(ParameterContext);
  console.log("Showing trait details for :  " + selectedTraitCategory);

  useEffect( () => {
    if (localTraitQuestionsList.length > 0 ) {
      console.log("Already have question list, so skipping the query.");
      if (selectedIdChanged.has_changed ===true) {
        var copy_of_q_list = localTraitQuestionsList; 
        console.log("Looking for matching entry");
        for (var trait_question of copy_of_q_list) {
          if (trait_question.id === selectedIdChanged.trait_id_changed) {
            console.log("Found the trait");
            if (selectedIdChanged.selected_id_added !== 0) {
              console.log("Adding the entry");
              if (typeof trait_question.selected_response_ids === 'undefined' ||
                trait_question.selected_response_ids === null) {
                trait_question.selected_response_ids = [{id: selectedIdChanged.selected_id_added}];
              } else {
                trait_question.selected_response_ids.push({id: selectedIdChanged.selected_id_added});
              }
            } else if (selectedIdChanged.selected_id_removed !== 0) {
              console.log("Removing the entry");
              var temp_array = trait_question.selected_response_ids.filter(item => item.id !== selectedIdChanged.selected_id_removed);
              trait_question.selected_response_ids = temp_array;
            }
          }
        }
        // Reset this as the value has been used.
        setSelectedIdChanged({
          has_changed: false,
          trait_id_changed: 0,
          selected_id_added: 0,
          selected_id_removed: 0
        });
        console.log("Updating the local copy now");
        setLocalTraitQuestionsList(copy_of_q_list);
      }
      // No need to query cloud as local copy is updated.
      return;
    }

    console.log("Quering Question List.");
    list_trait_questions(selectedTraitCategory)
        .then((trait_questions_from_async) => {
            console.log("Received QuestionList. Now quering responses.");
            get_category_responses(dependentStringId, selectedTraitCategory)
            .then((trait_responses_from_async) => {
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
                      if (typeof matchingEntry.selected_response_ids !== 'undefined' && 
                          matchingEntry.selected_response_ids !== null) {
                        console.log("  including response of length : " + matchingEntry.selected_response_ids.length);
                        trait_question.selected_response_ids = matchingEntry.selected_response_ids;
                      } else {
                        console.log("Type of matchingEntry.selected_response_ids : ", typeof matchingEntry.selected_response_ids)
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
  }, [selectedTraitCategory, selectedIdChanged, localTraitQuestionsList]);

  return (
    <div className="TraitDetailsContainer">
      <div className="TraitDetailsMain">
          <DisplayTraitQuestions TraitQuestionsList={localTraitQuestionsList}
          TraitCategoryId={selectedTraitCategory}
          DependentId={dependentStringId}
          setCounter={setCounter}
          counter={counter}
          setSelectedIdChanged={setSelectedIdChanged}
          />
      </div>
      <div className="GoBackButton" key={999} >
            <button type="button"
            onClick={() => {
              window.history.back();
            }} > Go Back
            </button>
      </div>
      <div className="Bottom">
        <p>.</p>
      </div>
    </div>
  );
}
