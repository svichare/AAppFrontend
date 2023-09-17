import {React, useEffect, useState, useContext} from "react";
import { API, graphqlOperation } from '@aws-amplify/api'
import { useNavigate } from 'react-router-dom';

import { ParameterContext } from '../../App';

import { addDependent } from '../../graphql/mutations'

import './AddDependent.css'

async function add_dependent(dependentDetails) {
  // update actionItem with the response.
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

export default function AddDependent({}) {
    const { userEmail } = useContext(ParameterContext);

    const [localProfileDetails, setLocalProfileDetails] = useState({
        parent_email: userEmail
      });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        console.log("Setting : ", name , " to value : ", value);

        setLocalProfileDetails({
            ...localProfileDetails,
            [name]: value,
        });
    };

    const navigate = useNavigate();

    const handleSubmit = () => {
        add_dependent(localProfileDetails);
    };

    return (
    <div className="AddDependentContainer">
      <div className="AddDependentMain">
        <h1>Add details ...</h1>
        <div className="AddDependentItem">
            <p> Name </p>
            <input className="AddDependentDetails" type="text"
               placeholder="Enter name" name="name"
               onChange={handleInputChange}/>
            <p> Diagnosis </p>
            <input className="AddDependentDetails" type="text"
               placeholder="Diagnosis" name="diagnosis"
               onChange={handleInputChange}/>
            <p> Age </p>
            <input className="AddDependentDetails" type="text"
               placeholder="Age" name="age"
               onChange={handleInputChange}/>
            <p> Verbal </p>
            <input className="AddDependentDetails" type="text"
               placeholder="Verbal" name="verbal"
               onChange={handleInputChange}/>
            <p> Public ID </p>
            <input className="AddDependentDetails" type="text"
               placeholder="Verbal" name="public_id"
               onChange={handleInputChange}/>
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
