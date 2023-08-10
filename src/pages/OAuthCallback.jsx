import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import axios from 'axios';


const OAuthCallback = (setUserEmail) => {
  const [localUserEmail, setLocalUserEmail] = useState('');
  useEffect(() => {
    // Parse the access token from the URL query parameters
    const tokenFragment = window.location.hash.substring(1); // Remove the initial '#' character
    const params = new URLSearchParams(tokenFragment);
    const accessToken = params.get('access_token'); // Get the value of the access_token parameter
    console.log('Access token From the dericeted URL: ' + accessToken);

    if (typeof accessToken === 'undefined') {
      return;
    }
    // Call google to fetch email address.
    const fetchUserEmail = async () => {
      try {
        const response = await axios.get('https://people.googleapis.com/v1/people/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            personFields: 'emailAddresses',
          },
        });

        // Extract the user's primary email address from the API response
        const primaryEmail = response.data.emailAddresses.find(email => email.metadata.primary).value;
        // Set email ID for calling function.
        setUserEmail(primaryEmail);
        setLocalUserEmail(primaryEmail);
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    fetchUserEmail();
    // Fetch User profile from DocumentDB.
  }, []);
  
  return <div>OAuth Callback. User authenticated : {localUserEmail} </div>;
};

export default OAuthCallback;
