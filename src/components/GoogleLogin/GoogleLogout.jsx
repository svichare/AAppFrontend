 import { GoogleLogout } from 'react-google-login';
 
 const clientId = '201175894539-gte8nppbkqha8j0o40cqe7opmrsgmofo.apps.googleusercontent.com';
 
 const onLogoutSuccess = (res) => {
     console.log("Logout successful ! Current user : ", res.profileObj);
 }
 
 const onFailure = (res) => {
     console.log("Login failed ! res : ", res);
 }
 
 function LogoutWithGoogle () {
     return (
         <div id="signInButton">
           <GoogleLogout
                client_id={clientId}
                buttonText="Logout"
                onLogoutSuccess={onLogoutSuccess}
           />
         </div>)
 }
 
 export default LogoutWithGoogle;