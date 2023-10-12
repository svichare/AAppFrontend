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
    var intro_text = "Age 2: Rishaan uses daipers completly";
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
    var intro_text = "Age 3: Rishaan tried the 3 day technique for daiper training. It did not work. We had to give up at that point.";
    if (dependent_public_id == null || typeof dependent_public_id === 'undefined') {
          return "";
      }
      if (dependent_public_id === "Rishaan_647") {
        return intro_text;
      } else {
        return "";
    }
  }

  const returnMidSecondLine = () => {
      var intro_text = "Age 3.5: We used a hybrid approach. When he was home and it was convenient, we removed his daipers." +
      " We kept him on the potty after every 30 minutes. Initially, he had resistance for using the potty." +
      " He would wait for us to put the daiper back on and only use it. ";
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
      var intro_text = "Age 4: Rishaan was mostly without daipers. At home and ABA center." +
      " He mostly uses potty now. But we need to ensure that he is taken to the potty after every hour." +
      " He still does not communicate that he wants to use potty. He is more comfortable using the potty now than the daiper.";
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
              <h2> My journey with potty training.. </h2>
              <p> {returnIntroLine()} </p>
              <p> {returnMidLine()} </p>
              <p> {returnMidSecondLine()} </p>
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
