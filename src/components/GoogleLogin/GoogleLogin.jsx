import React from 'react';

const GoogleLogin = () => {
  const handleLoginWithGoogle = () => {
    const clientId = '201175894539-gte8nppbkqha8j0o40cqe7opmrsgmofo.apps.googleusercontent.com';
    const redirectUri = encodeURIComponent('https://ab9eb8aaad4647c485ecc2aca8a88f59.vfs.cloud9.us-east-1.amazonaws.com/OAuthCallback'); // Update with your actual callback URL
    const scopes = ['email', 'profile'];
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scopes.join(' ')}`;

    window.location.href = authUrl;
  };

  return (
    <div>
      <button onClick={handleLoginWithGoogle}>Login with Google</button>
    </div>
  );
};

export default GoogleLogin;