import {React, useState, useContext, useEffect} from "react";
import { useNavigate, useParams } from 'react-router-dom';

import "./CommJourney.css"

import { ParameterContext } from '../../App';

import { API } from '@aws-amplify/api'
import { getDependentPublicDetails } from '../../graphql/queries'
import mixpanel from 'mixpanel-browser';

export default function CommJourney() {
  const { dependent_public_id } = useParams();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  mixpanel.init('a709584ba68b4297dce576a32d062ed6', { debug: true, track_pageview: true, persistence: 'localStorage' });
  mixpanel.track('CommJourney opened', {
      'Dependent Name': dependent_public_id
    });

  const returnIntroLine = () => {
    var intro_text = "Age 2: Rishaan was verbal at age 2. He went through rapid regression at that point and stopped communicating completly.";
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
      var intro_text = "Age 5: Rishaan now communicates with gestures. He will pull us to the kitchen stove when he is hungry." +
      " Rishaan will sometimes come and touch if he has to use the bathroom. " +
      " He will take us to the things he wants. He does not communicate verbally as of now.";
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
              <h2> My journey with communication skills </h2>
              <p> {returnIntroLine()} </p>
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
