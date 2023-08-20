import {React, useState, useEffect} from "react";

import "./TraitDetails.css"

import profile_picture from '../../assets/images/profile_picture.jpg'

async function list_trait_questions(id) {
  // Probably need to fetch the answer options too.
  try {
    var response = {
      data : {
        traitQuestions: []
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
               type: "single",
               options: [{
                   id: 1,
                   text: "4-5 hours",
               }, {
                   id: 2,
                   text: "6-7 hours",
               }, {
                   id: 3,
                   text: "8-10 hours",
               }, {
                   id: 4,
                   text: "Less than 4",
               }, {
                   id: 5,
                   text: "more than 10",
               }],
               default_selection: 2,
               id:101},
          {name: "SleepRoutines",
               description: "Typical things to do ?.",
               type: "details",
               options: [],
               default_selection: "Brushing followed by change in clothes.",
               id:104},
          {name: "SleepBReakers",
               description: "What will cause the sleep to break?.",
               type: "multiple",
               options: [{
                   id: 1,
                   text: "Lights"
               }, {
                   id: 2,
                   text: "Sounds"
               }, {
                   id: 3,
                   text: "Smells"
               }, {
                   id: 4,
                   text: "Touch"
               }
               ],
               default_selection: [1, 4],
               id:105}
          ];
    }
    return response.data.traitCategories;
  } catch (error) {
    console.error(`Cought error in function : ${error}`);
    return  [{name: "SleepTiming",
               description: "How many hours of sleep do they usually have?.",
               type: "single",
               options: [{
                   id: 1,
                   text: "4-5 hours",
               }, {
                   id: 2,
                   text: "6-7 hours",
               }, {
                   id: 3,
                   text: "8-10 hours",
               }, {
                   id: 4,
                   text: "Less than 4",
               }, {
                   id: 5,
                   text: "more than 10",
               }],
               default_selection: 2,
               id:101},
          {name: "SleepRoutines",
               description: "Typical things to do ?.",
               type: "details",
               options: [],
               default_selection: "Brushing followed by change in clothes.",
               id:104},
          {name: "SleepBReakers",
               description: "What will cause the sleep to break?.",
               type: "multiple",
               options: [{
                   id: 1,
                   text: "Lights"
               }, {
                   id: 2,
                   text: "Sounds"
               }, {
                   id: 3,
                   text: "Smells"
               }, {
                   id: 4,
                   text: "Touch"
               }
               ],
               default_selection: [1, 4],
               id:105}
          ];
  }
}

function PopulateOptions({TraitQuestion}) {
  var options_div = "";
  console.log("Checking if TraitQuestion is undefined");
  if (typeof TraitQuestion === 'undefined') {
    return options_div;
  }
  console.log("Checking if TraitQuestion.type is undefined");
  if (typeof TraitQuestion.type === 'undefined') {
    return options_div;
  }
  
  console.log("Options in the question length :" + TraitQuestion.options.length);
  var options_div = "<div class=\"TraitOptionsList\">";
  
  
  TraitQuestion.options.map(value => {
    options_div += "<button > " + value.text + " </button>";
    });

  options_div += "</div>";

  switch (TraitQuestion.type) {
    case "single":
      break;
    case "multiple":
      break;
  }
  const onOptionClick = () => {
    console.log("Option clicked");
    // setSelectedTrait(value);
  };
  
  return (
    <div className="TraitOptionsList">
    {
        TraitQuestion.options.map((value, index) => (
          <div class="TraitOptionItem">
            <button type="button" onClick={onOptionClick} key={value.id}> {value.text}
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
    return <div className="TraitQuestionsList"><div class="TraitDetails" href="#" key={0}>List empty..</div></div>;
  }
  // Add funtion which scrolls to the next question.
  return (
    <div className="TraitQuestionsList">
      {TraitQuestionsList.map((value, index) => (
      <div className="TraitQuestionDetails">
        <p> {index+1}/{TraitQuestionsList.length}: {value.description} </p>
        <PopulateOptions TraitQuestion={value} />
        <PopulateDescriptionOption />
      </div>
      ))}
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
      console.log("localTraitQuestionsList populated");
      console.log("localTraitQuestionsList length : " + localTraitQuestionsList.length);
      console.log("trait_questions_from_async length : " + trait_questions_from_async.length);
    });
  },[]);

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
