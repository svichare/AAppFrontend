import {React, useEffect, useState, useContext} from "react";
import { API, graphqlOperation } from '@aws-amplify/api'
import { useNavigate } from 'react-router-dom';

import { ParameterContext } from '../../App';

import { addDependent } from '../../graphql/mutations'
import { useUser } from '../../components/UserContext';

import './AddDependent.css'

async function add_dependent(dependentDetails) {
  // update actionItem with the response.
  if (typeof dependentDetails.parent_email === 'undefined' ||
        dependentDetails.parent_email === null ||
        dependentDetails.parent_email.length === 0) {
      console.log("Not adding dependent as Top level user not set");
      return;
  }
 
  const add_dependent_details = {
    parent_email: dependentDetails.parent_email,
    name: dependentDetails.name,
    verbal: dependentDetails.verbal,
    age: dependentDetails.age,
    diagnosis: dependentDetails.diagnosis,
    public_id: dependentDetails.public_id
  };

  try {
    console.log("Updating the response. : ", JSON.stringify(add_dependent_details));
      const response = await API.graphql(
        graphqlOperation(addDependent,
          {addDependentInput: add_dependent_details}));
      console.log("received response : ", JSON.stringify(response));
  } catch (error) {
      console.error('Cought error in update_action_response function :',  JSON.stringify(error));
  }
}

const diagnosisList = [
    {name: "Autism"}, {name: "Attention-Deficit/Hyperactivity Disorder"},
    {name: "Cerebral Palsy"}, {name: "Fragile X syndrome"}, {name: "Epilepsy"}
    , {name: "Rett syndrome"}, {name: "Tourette syndrome"}, {name: "None"}]

const verbalList = [
    {name: "Non-verbal (No communcation)"},
    {name: "Non-verbal(Communicates basic needs with actions)"},
    {name: "Verbal (Communicates basic needs verbally)"},
    {name: "Verbal (Basic conversational communication)"},
    {name: "Fully verbal"}]

function createRadioElements(dataArray, fieldName, handleInputChange) {
  console.log("Creating radio buttons : ", dataArray.length);
  const list_html = [];
    dataArray.forEach((arrayEntry, index) => {
    list_html.push(
      <div classname="AddDependentDetailsOptions" key={index}>
          <label>
            <input
              type="radio"
              name={fieldName}
              value={arrayEntry.name}
              onChange={handleInputChange}
            />
            {arrayEntry.name}
          </label>
      </div>
      );
    });
  return list_html;
}

export default function AddDependent({}) {
    const { userEmail } = useContext(ParameterContext);
    const { user } = useUser();
    const [localProfileDetails, setLocalProfileDetails] = useState(
        {parent_email: user.email});
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        console.log("Setting : ", name , " to value : ", value);

        setLocalProfileDetails({
            ...localProfileDetails,
            [name]: value,
        });
    };

    const navigate = useNavigate();

    const handleSubmit = async () => {
        // Handle validation here.
        const response = await add_dependent(localProfileDetails, user);
        console.log("Add dep response : ", response);
        // For now just navigate to parent screen. Later on check the status of 
        navigate('/ProfileHome');
    };

    const diagnosis_list_html = createRadioElements(diagnosisList, "diagnosis", handleInputChange);
    const verbal_list_html = createRadioElements(verbalList, "verbal", handleInputChange);

    return (
    <div className="AddDependentContainer">
      <div className="AddDependentMain">
        <h1>Add details of your kid...</h1>
        <p>(* required fields)</p>
        <div className="AddDependentItem">
            <p>First Name* </p>
            <input className="AddDependentDetails" type="text"
               placeholder="Enter first name" name="name"
               onChange={handleInputChange}/>
            <p> Diagnosis* </p>
            <div className="AddDependentDetailsOptions">
              {diagnosis_list_html}
              <label>
                <input
                  type="radio"
                  name="diagnosis"
                  value="Other"
                  onChange={()=> {}}
                />
                Other (Add details in the text box)
              </label>
            </div>
            <input className="AddDependentDetails" type="text"
               placeholder="Diagnosis details (Other)" name="diagnosis"
               onChange={handleInputChange}/>
            <p> Age* </p>
            <input className="AddDependentDetails" type="text"
               placeholder="Age" name="age"
               onChange={handleInputChange}/>
            <p> Communication level* </p>
            <div className="AddDependentDetailsOptions">
                {verbal_list_html}
            </div>
        </div>
        <div className="AddDependentItem">
            <button type="button" onClick={handleSubmit}>Submit</button>
        </div>
      </div>

      <div className="Bottom">
        <p>.</p>
      </div>
    </div>
        );
}
