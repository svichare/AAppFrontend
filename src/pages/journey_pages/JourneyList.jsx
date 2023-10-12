import {React, useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { API } from '@aws-amplify/api'
import { allJourneyList } from '../../graphql/queries'
import { ParameterContext } from '../../App';


import "./JourneyList.css"

import profile_picture from '../../assets/images/profile_picture.jpg'

function DisplayJourneyList({JourneyList, dependent_public_id, navigate}) {
  if (typeof JourneyList === "undefined" ||
  JourneyList.length === 0) {
    // nothing to do as project not selected.
    console.log("Undefined JourneyListList returning without fuss. XXXXXXX");
    return <div className="JourneyListList"><div className="JourneyList" href="#" key={0}>List loading..</div></div>;
  }

  const onCategoryClick = (journeyId) => {
    console.log("JourneyList clicked : " + journeyId);
    navigate("/PublicProfile/" + dependent_public_id + "/" + journeyId);
  };
  return (
    <div className="JourneyList">
      {
        JourneyList.map((value, index) => (
          <div className="JourneyList"  key={value.id}>
            <button type="button" onClick={() => onCategoryClick(value.string_id)} key={index}> {value.display_name}
            </button>
          </div>
        ))
      }
    </div>
  );
}

export default function JourneyList({dependentId}) {
  let [localJourneyList, setLocalJourneyList] =
    useState([
        {display_name: "Communication / Speech", string_id: "CommJourney" },
        {display_name: "Potty Training", string_id: "PottyJourney" },
        {display_name: "Sleep schedule", string_id: "SleepJourney" },
        {display_name: "Feeding / Eating", string_id: "FeedingJourney" }]);
  const { dependent_public_id } = useParams();

  const { setSelectedJourneyList } = useContext(ParameterContext);

  const navigate = useNavigate();

  return (
    <div className="JourneyListContainer">
      <div className="JourneyListMain">
        <div className="JourneyListTopbar">
            <div className="JourneyListName">
              <h3>Follow my journey as I develop .. </h3>
            </div>
        </div>
          <DisplayJourneyList JourneyList={localJourneyList}
                                dependent_public_id={dependent_public_id}
                                  navigate={navigate}/>
          <div className="JourneyListBack">
                <button type="button" onClick={() => { navigate('/DependentProfile');}}>Back</button>
          </div>
      </div>
      <div className="Bottom">
            <p>.</p>
          </div>
    </div>
  );
}
