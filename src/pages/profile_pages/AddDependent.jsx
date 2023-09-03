import {React, useEffect, useState, useContext} from "react";
import { API, graphqlOperation } from '@aws-amplify/api'

import { ParameterContext } from '../../App';

import { addDependent } from '../../graphql/mutations'

import './AddDependent.css'

async function add_dependent(dependentDetails) {
  // update actionItem with the response.
  const add_dependent_details = {
    parent_email: dependentDetails.parent_email,
    name: dependentDetails.name
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
