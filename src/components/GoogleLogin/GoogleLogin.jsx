import React from 'react';
import { GoogleLogin } from 'react-google-login';

const GoogleOAuth = () => {
  const responseGoogle = (response) => {
    console.log(response); // Handle the response from Google OAuth
  };

  return (
    <div>
      <GoogleLogin
        clientId="201175894539-gte8nppbkqha8j0o40cqe7opmrsgmofo.apps.googleusercontent.com"
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
};

export default GoogleOAuth;
