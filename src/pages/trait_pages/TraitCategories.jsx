import {React, useState, useEffect, useContext} from "react";
import { Link, useNavigate } from 'react-router-dom';
import { API } from '@aws-amplify/api'
import { allTraitCategories, getTraitCategoryResponseCounts } from '../../graphql/queries'
import { ParameterContext } from '../../App';
import category_index from '../../assets/images/category_index.png'


import "./TraitCategories.css"
import { Button, styled } from "@mui/material";


async function list_trait_categories() {
  try {
    const response = await API.graphql({
      query: allTraitCategories,
      variables: {
      },
    });
    // For local testing.
    if (response.data.allTraitCategories.length === 0) {
      return [{Name: "Physical Activities.",
               Description: "Mock trait category",
               id:101},
      {Name: "Sleep Schedule.",
               Description: "Mock trait category 103",
               id:103}];
    }
    return response.data.allTraitCategories;
  } catch (error) {
    console.error(`Cought error in function : ${error}`);
    return [{Name: "Physical Activities.e",
               Description: "Mock trait category",
               id:101},
      {Name: "Sleep Schedule.e",
               Description: "Mock trait category 103",
               id:103}];
  }
}

async function get_trait_response_counts(cur_dependent_id) {
  try {
    console.log("Getting response count");
    const response = await API.graphql({
      query: getTraitCategoryResponseCounts,
      variables: {
        dependent_id: cur_dependent_id
      },
    });
    // For local testing.
    if (response.data.getTraitCategoryResponseCounts.length === 0) {
      return [];
    }
    return response.data.getTraitCategoryResponseCounts;
  } catch (error) {
    console.error(`Cought error in function : ${error}`);
    return [];
  }
}


function DisplayTraitCategories({TraitCategoryList, setSelectedTraitCategory, navigate}) {
  if (typeof TraitCategoryList === "undefined" ||
  TraitCategoryList.length === 0 ) {
    // nothing to do as project not selected.
    console.log("Undefined TraitCategoryList returning without fuss. XXXXXXX");
    return <div className="TraitCategoriesList"><div className="TraitCategory" href="#" key={0}>List loading..</div></div>;
  }
  
  const onCategoryClick = (categoryId) => {
    console.log("TraitCategory clicked : " + categoryId);
    setSelectedTraitCategory(categoryId);
    navigate("/TraitDetails");
  };

  // Your function to get the color name based on the percent complete
  const getButtonColor = (percent_complete) => {
    if (percent_complete === 100) {
      return "complete";
    } else if (percent_complete < 5) {
      return "notStarted";
    } else {
      return "inProgress";
    }
  };

  const TraitCategoriesButton = styled(Button)({
    padding: '10px',
    width: '20rem',
    border: 'none',
    cursor: 'pointer',
    fontFamily: ['SawarabiGothic', 'Helvetica', 'sans-serif'],
    fontSize: '1.1rem',
  });

  return (
    <div className="TraitCategoriesList">
      {TraitCategoryList.map((value, index) => (
        // Remove the div element and use the color prop of the Button component
        <TraitCategoriesButton
          variant="contained"
          color={getButtonColor(value.percent_complete)}
          onClick={() => onCategoryClick(value.id)}
          key={value.id}
        >
          {value.Name}
        </TraitCategoriesButton>
      ))}
    </div>
  );
}

export default function TraitCategories({dependentId}) {
  let [localTraitCategoryList, setLocalTraitCategoryList] = useState([]);
  // let [localSelectedTraitCategory, setLocalSelectedTraitCategory] = useState([]);
  const { setSelectedTraitCategory } = useContext(ParameterContext);
  const { dependentStringId } = useContext(ParameterContext);
  const navigate = useNavigate();

  useEffect( () => {
    if (typeof dependentStringId === 'undefined' || dependentStringId.length===0) {
      console.log("Dependent ID not set");
      navigate("/Home");
    } else {
      console.log("Dependent ID set: ", dependentStringId);
    }
    list_trait_categories()
    .then((trait_categories_from_async) => {
      get_trait_response_counts(dependentStringId).then((response_counts_from_async) =>  {
        for(var trait_category_index in trait_categories_from_async) {
          var question_count = trait_categories_from_async[trait_category_index].TraitCount;
          var response_count = 0;
          const matchingEntry = response_counts_from_async.find(entry =>
            entry.trait_category_id == trait_categories_from_async[trait_category_index].id
          );
          if (matchingEntry) {
            if (typeof matchingEntry.response_counts !== 'undefined') {
              response_count =  matchingEntry.response_counts;
            }
          }
          var complete_percentage = response_count < question_count ? (response_count*100) / question_count  : 100;
          console.log("Setting percent complete : ", complete_percentage,
          " ", question_count, " ", response_count);
          trait_categories_from_async[trait_category_index].percent_complete = complete_percentage;
        }
        setLocalTraitCategoryList(trait_categories_from_async);  
      });
    });
  }, []);

  return (
    <div className="TraitCategoriesContainer">
      <div className="TraitCategoriesMain">
        <div className="TraitCategoriesTopbar">
            <div className="TraitCategoriesName">
              <h3>Select a category to view/update</h3>
            </div>
        </div>
        <div className="CategoryIndexImage">
              <img src={category_index} alt="category_index" />
        </div>
          <DisplayTraitCategories TraitCategoryList={localTraitCategoryList}
                                  setSelectedTraitCategory={setSelectedTraitCategory}
                                  navigate={navigate}/>
        <div className="TraitCategoryBack">
          <Link to="/DependentProfile">
            <Button size="large" variant="contained">
              Back
            </Button>
          </Link>
          </div>
      </div>
    </div>
  );
}
