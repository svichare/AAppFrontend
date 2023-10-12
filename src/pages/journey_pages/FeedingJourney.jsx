import {React, useState, useContext, useEffect} from "react";
import { useNavigate, useParams } from 'react-router-dom';

import "./CommJourney.css"

import { ParameterContext } from '../../App';

import { API } from '@aws-amplify/api'
import { getDependentPublicDetails } from '../../graphql/queries'
import mixpanel from 'mixpanel-browser';

export default function FeedingJourney() {
  const { dependent_public_id } = useParams();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  mixpanel.init('a709584ba68b4297dce576a32d062ed6', { debug: true, track_pageview: true, persistence: 'localStorage' });
  mixpanel.track('PottyJourney opened', {
      'Dependent Name': dependent_public_id
    });

  const returnIntroLine = () => {
    var intro_text = "Age 2: Rishaan eats a variety of foods. Like rice+curry, roti + curry. Only issue is that he does not bit food." +
    "He tends to swallow the food directly. He does not eat fruits.";
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
    var intro_text = "Age 3: Rishaan started by biting crunchy food like chips. Now he has started biting his food too.";
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
      var intro_text = "Age 4: Rishaan's now eats variety of textures. He does not bite too hard though." +
      "If something is hard to eat, he will give up. Still does not eat fruit. Drinks smoothies though.";
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
              <h2> My journey with eating food </h2>
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
