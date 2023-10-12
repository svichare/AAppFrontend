import {React, useState, useContext, useEffect} from "react";
import { useNavigate, useParams } from 'react-router-dom';

import "./CommJourney.css"

import { ParameterContext } from '../../App';

import { API } from '@aws-amplify/api'
import { getDependentPublicDetails } from '../../graphql/queries'
import mixpanel from 'mixpanel-browser';

export default function PottyJourney() {
  const { dependent_public_id } = useParams();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  mixpanel.init('a709584ba68b4297dce576a32d062ed6', { debug: true, track_pageview: true, persistence: 'localStorage' });
  mixpanel.track('PottyJourney opened', {
      'Dependent Name': dependent_public_id
    });

  const returnIntroLine = () => {
    var intro_text = "Age 2: Rishaan needs to have heavy dinner to sleep through the night. So we give him PediaSure at sleep time.";
    if (dependent_public_id == null || typeof dependent_public_id === 'undefined') {
          return "";
      }
      if (dependent_public_id === "Rishaan_647") {
        return intro_text;
      } else {
        return "";
    }
  }

  const returnMidLine = () => {
    var intro_text = "Age 3: We stopped giving Pediasure after dinner. Overall, did not affect his sleep. Rishaan naps for 2 hours, from 3:30 pm to 5:30 pm.";
    if (dependent_public_id == null || typeof dependent_public_id === 'undefined') {
          return "";
      }
      if (dependent_public_id === "Rishaan_647") {
        return intro_text;
      } else {
        return "";
    }
  }

 const returnCurrentState = () => {
      var intro_text = "Age 4: Rishaan's sleep is more or less stable. "+
      " It will get disturbed around once a week though. Couple of things need to happen for a good sleep," +
      "He must nap less than 2 hours, he should have a heavy dinner and he should sleep after 10:30 pm at night." +
      "If all these things happen, he will sleep through the night. Else he will get up around 3:00 am.";
      if (dependent_public_id == null || typeof dependent_public_id === 'undefined') {
          return "";
      }
      if (dependent_public_id === "Rishaan_647") {
        return intro_text;
      } else {
        return "";
      }
  }

  return (
    <div className="CommJourneyContainer">
    {loading ? (
        // Show a loading screen when loading is true
        <div className="LoadingPage"> <h2>Loading...</h2> </div>
        ) : (
        <div>
          <div className="CommJourneyMain">
            <div className="JourneyIntroduction">
              <h2> My journey with stabilizing sleep </h2>
              <p> {returnIntroLine()} </p>
              <p> {returnMidLine()} </p>
              <p> {returnCurrentState()} </p>
            </div>
          </div>
          <div className="Bottom">
            <p>.</p>
          </div>
          </div>
        )}
    </div>
  );
}
