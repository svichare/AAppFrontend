import { NavBar } from '../components';

import about_photo from '../assets/photos/about_rish_crop2.jpg'

import './About.css';

export default function About({userLoggedIn}) {

return (
    <div className="AboutContainer">
      <div className="AboutMain">
          <br></br>
          <p>We are all in this together. </p>
          <p> and we got this.</p>
          <br></br>
          <p>- Contact me @ Shivaji.Vichare@gmail.com </p>
          <div className="AboutTopImage">
            <img src={about_photo} alt="about_photo" />
          </div>
      </div>
      <div className="AboutBottom">
        <p>.</p>
      </div>
    </div>
);
}
