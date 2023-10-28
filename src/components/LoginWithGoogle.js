import { GoogleLogin } from 'react-google-login';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';

const clientId = '201175894539-gte8nppbkqha8j0o40cqe7opmrsgmofo.apps.googleusercontent.com';


function LoginWithGoogle() {
    console.log("Login Attempt start");
    const { login } = useUser();
    const navigate = useNavigate();

    const onSuccess = (res) => {
        console.log("Login successful ! Current user : ", res.profileObj);
        const userData = { name: res.profileObj.givenName, email: res.profileObj.email, image_url: res.profileObj.imageUrl };

        login(userData);
        navigate('/ProfileHome');
    }

    const onFailure = (res) => {
        console.log("Login failed ! res : ", res);
    }
    return (
        <div id="signInButton">
            <GoogleLogin
                client_id={clientId}
                buttonText="Login using gmail"
                render={renderProps => (
                    <button onClick={renderProps.onClick} className="login_navbar-button">Login</button>
                )}
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={false}
            />
        </div>)
}

export default LoginWithGoogle;