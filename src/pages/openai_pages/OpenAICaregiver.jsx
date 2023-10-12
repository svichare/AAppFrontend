import {useState, useEffect} from "react";

import "./OpenAICaregiver.css"

function GetGPTResponse(query_str) {
    var result_str;
    var regex = /dentist/;
    var index = query_str.search(regex);
    if (index !== -1) {
        result_str = "Rishaan generally has a good demeanor when visiting the dentist. He can patiently wait for "
        result_str += "up to 30 minutes without any complaints, and he's cooperative during the dental procedure as long as he's held securely.";
        return result_str;
    }
    
    regex = /banging/;
    index = query_str.search(regex);
    if (index !== -1) {
        result_str = "Rishaan experiences periodic phases during which he engages in head-banging behavior.  "
        result_str += "These phases typically persist for a couple of weeks and can be halted if he is firmly asked to stop.";
        return result_str;
    }

    regex = /dinner/;
    index = query_str.search(regex);
    if (index !== -1) {
        result_str = "Rishaan enjoys having rice and curry for dinner, and he is quite flexible when it comes to the type of curry. It can be a mild curry with vegetables or chicken."
        result_str += " In case those options don't work, preparing some noodles is a reliable alternative, as he will consistently eat them.";
        return result_str;
    }
    return result_str;
}

export default function CaregiverGPT() {

  const [gPTresponse, setGPTresponse] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async () => {
        // Handle validation here.
        setProcessing(true);
        console.log("Sending query : ", query);
        setGPTresponse("processing ...");

        // const response = GetGPTResponse(query);
        // const response = await setTimeout(GetGPTResponse(query), 2000);
        const response = await setTimeout(() => {
          const response = GetGPTResponse(query);
          setGPTresponse(response);
        }, 2000);
        console.log("Add dep response : ", response);
        // setTimeout(setGPTresponse(response), 2000);
        
        setProcessing(false);
        // For now just navigate to parent screen. Later on check the status of 
    };

  const handleQueryUpdate = (event) => {
        // Handle validation here.
        setQuery(event.target.value);
        console.log("Setting Query to  : ", event.target.value);
    };

    return (
    <div className="CaregiverGPTContainer">
    {loading ? (
        // Show a loading screen when loading is true
        <div className="LoadingPage"> <h2>Loading...</h2> </div>
        ) : (
        <div>
          <div className="CaregiverGPTMain">
            <div className="CaregiverGPTTopbar">
              <h3>Ask me about Rishaan ..</h3>
              <textarea className="CaregiverGPTInputText" value={query}
                onChange={(e) => {setQuery(e.target.value);}} type="text" rows="2" />
              <div className="GoBackButton" key={999} >
                <button type="button" disabled={processing} onClick={handleSubmit} > Submit
              </button>
              </div>
              <h3> Response from Assistant :  </h3>
              {processing ? (
                  <div className="LoadingPage"> <h2>Loading...</h2> </div>
                ) : (
                  <div className="CaregiverGPTResponse">
                    <p> {gPTresponse} </p>
                  </div>
                )
              }
            </div>
          </div>
          <div className="Bottom">
            <p>.</p>
          </div>
        </div>
      )}
    </div>
  );
}

