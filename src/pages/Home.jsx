import React from "react";

import * as S from "./HomeStyles";
import { NavBar } from '../components';

import './Home.css';


export default function Home() {
  return (
    <div className="Container">
      <NavBar />
      <div className="Main">
          <br></br>
          <p>Your kid is a combination of thousands of unique traits. </p>
          <p>Connect with the parents of kids which is closest to your kiddo..</p>
          <br></br>
      </div>
      <div className="Bottom" />
    </div>
  );
}
