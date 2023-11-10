import {React, useState, useEffect, useContext} from "react";
import { Link, useNavigate } from 'react-router-dom';
import { API, graphqlOperation } from '@aws-amplify/api'
import { allTraitCategories, getTraitCategoryResponseCounts, getThreadsAndMessages } from '../../graphql/queries'
import { markThreadValidity, markMessageValidity } from '../../graphql/mutations'

import { ParameterContext } from '../../App';
import category_index from '../../assets/images/category_index.png'


import "./KbDisplayTopicList.css"
import { Button, styled } from "@mui/material";


async function fetch_topics_and_messages(threadStartRank, threadEndRank) {
  try {
    const response = await API.graphql({
      query: getThreadsAndMessages,
      variables: {
        collection_name: "thread_details_telegram_first_file_complete",
        threads_to_read: ((threadEndRank - threadStartRank) + 1),
        threads_to_skip: (threadStartRank-1)
      },
    });
    // For local testing.
    if (response.data.getThreadsAndMessages.length === 0) {
      console.log("No threads returned!");
      return [];
    }
    console.log("Returning " + response.data.getThreadsAndMessages.length + " threads.");
    return response.data.getThreadsAndMessages;
  } catch (error) {
    console.error(`Cought error in function : ${error}`);
    return [];
  }
}

async function update_thread_validity(cur_collection_name, cur_thread_id, cur_new_validity) {

  try {
    console.log("Updating the response. : ", cur_collection_name,
    " ", cur_thread_id, " ", cur_new_validity);
      const response = await API.graphql(
        graphqlOperation(markThreadValidity,
          {collection_name: cur_collection_name,
          thread_id: cur_thread_id,
          new_validity: cur_new_validity}));
      console.log("received response : ", JSON.stringify(response));
  } catch (error) {
      console.error('Cought error in update_action_response function :',  JSON.stringify(error));
  }
}

function ThreadHierarchy({ threads }) {
  let [updating, setUpdating] = useState(false);

  const handleIsValidChange = async (thread_id, validity) => {
      // Toggle the isValid state
      console.log("Clicked for thread : ", thread_id, "  new validity : ", validity);
      // Call your custom function here
      // e.g., yourCustomFunction(isValid);
      setUpdating(true);
      await update_thread_validity(
        "thread_details_telegram_first_file_complete", thread_id, validity);
      setUpdating(false);
  };

  if (typeof threads === 'undefined' || typeof threads.length === 'undefined' || threads.length === 0) {
    console.log("Threads empty");
    return;
  }
  console.log("Trying to render threads of length : ", threads.length, " type of threads : ", typeof threads);
  return (
    <div>
      {threads.map((thread) => (
        <div key={thread.title}>
          <h3>{thread.title}</h3>
          <strong>IsValid:</strong> {thread.isValid ? "Yes" : "No"}
          <button
            type="button"
            disabled={updating}
            onClick={() => {handleIsValidChange(thread._id, !thread.isValid)}}
            style={{ background: thread.isValid ? 'green' : 'red', color: 'white' }}
          >
            {thread.isValid ? '✓ Valid' : '✗ Invalid'}
          </button>

          <ul>
            {thread.tags && (
              <li>
                Tags: {thread.tags.join(", ")}
              </li>
            )}
            {thread.messages && thread.messages.length > 0 && (
              <li>
                Messages:
                <ul>
                  {thread.messages.map((message) => (
                    <li key={message.text}>
                      <strong>Text:</strong> {message.text}
                      <br />
                      <strong>Message Type:</strong> {message.messageType}
                      <br />
                      <strong>IsValid:</strong> {message.isValid ? "Yes" : "No"}
                      <br />
                      <strong>Sender:</strong> {message.sender}
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default function TopicList({dependentId}) {
  const [threadStartRank, setThreadStartRank] = useState(1);
  const [threadEndRank, setThreadEndRank] = useState(5);
  const [threads, setThreads] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = () => {
    // Call the onFetchThreads function to fetch and display threads
    fetch_topics_and_messages(threadStartRank, threadEndRank)
    .then((threads_returned) => {
      setThreads(threads_returned);
      console.log("Updated local threads ");
    });
  };
  
  return (
    <div className="TraitCategoriesContainer">
      <div className="TraitCategoriesMain">
        <div className="TraitCategoriesTopbar">
            <div className="TraitCategoriesName">
              <h3>Select Threads to view/update</h3>
              <input
                type="text"
                placeholder="Thread Start Rank"
                value={threadStartRank}
                onChange={(e) => setThreadStartRank(e.target.value)}
              />
              <input
                type="text"
                placeholder="Thread End Rank"
                value={threadEndRank}
                onChange={(e) => setThreadEndRank(e.target.value)}
              />
              <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
          {threads && <ThreadHierarchy threads={threads} /> }
        <div className="TraitCategoryBack">
          <Button size="large" variant="contained">
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
