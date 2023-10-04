import { GoogleLogout } from 'react-google-login';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';


 const clientId = '201175894539-gte8nppbkqha8j0o40cqe7opmrsgmofo.apps.googleusercontent.com';
 
 
 function LogoutWithGoogle () {
   const { logout } = useUser();
   const navigate = useNavigate();

  
   const onLogoutSuccess = (res) => {
     console.log("Logout successful !");
     logout();
     navigate('/Home');
   }

     return (
         <div id="signInButton">
           <GoogleLogout
                client_id={clientId}
                buttonText="Logout"
                render={renderProps => (
                 <button onClick={renderProps.onClick} className="login_navbar-button">Logout</button>
                )}
                onLogoutSuccess={onLogoutSuccess}
           />
         </div>)
 }
 
 export default LogoutWithGoogle;