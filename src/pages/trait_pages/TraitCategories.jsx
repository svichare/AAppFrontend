import {React, useState} from "react";

import "./TraitCategories.css"

import profile_picture from '../../assets/images/profile_picture.jpg'

export default function TraitCategories({dependentId}) {
  return (
    <div className="Container">
      <div className="Main">
        <div className="TraitCategoriesTopbar">
            <div className="TraitCategoriesName">
              <h3>Select a trait category </h3>
            </div>
        </div>
          <h4>List of trait categories</h4>
      </div>
      <div className="Bottom">
        <p>.</p>
      </div>
    </div>
  );
}
