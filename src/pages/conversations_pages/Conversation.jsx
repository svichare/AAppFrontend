import React, { useState, useEffect } from 'react';
import ConversationThread from './ConversationThread';
import { getThreads } from '../../graphql/queries'
import { API } from '@aws-amplify/api'
import './Conversation.css'
import { Button } from '@mui/material';

const cache = {};

const Conversation = () => {
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [collectionName, setCollectionName] = useState("thread_details_telegram_first_file_complete");
    const [fieldName, setFieldName] = useState("title");
    const [threadName, setThreadName] = useState("Recommendation for child psychiatrist or counselor");

    useEffect(() => {
        const fetchConversation = async () => {
            const cacheKey = `${collectionName}-${fieldName}-${threadName}`;
            if (cache[cacheKey]) {
                setThreads(cache[cacheKey]);
                setLoading(false);
                return;
            }

            try {
                const response = await API.graphql({
                    query: getThreads,
                    variables: {
                        collection_name: collectionName,
                        key: fieldName,
                        value: threadName
                    },
                });

                if (response.data.getThreads.length === 0) {
                    console.log("No threads returned!");
                    return [];
                }
                console.log("Returning " + response.data.getThreads.length + " threads.");
                const threads = response.data.getThreads;
                console.log("Thread : ", threads);
                setThreads(threads);
                cache[cacheKey] = threads;
                setLoading(false);
            } catch (error) {
                console.error('Error fetching conversation:', error);
                setLoading(false);
            }
        };

        fetchConversation();
    }, [collectionName, fieldName, threadName]);

    const allConversations = () => {
        setLoading(true);
        setFieldName("");
        setThreadName("");
    }

    const oneConversation = () => {
        setLoading(true);
        setFieldName("title");
        setThreadName("Recommendation for child psychiatrist or counselor");
    }

    return (
        <div className="container">
            <div>
                {loading ? (
                    <div class="loader"></div>
                ) : (
                    <>
                        <div className="conversation">
                            <div className="conversation__header">
                                <h2>Conversations</h2>
                                <Button variant="contained" onClick={() => allConversations()}>All Threads</Button>
                                <Button variant="contained" onClick={() => oneConversation()}>One Thread</Button>
                            </div>
                            <div className="conversation__body">
                                <div className="conversation__body__messages">
                                    {threads.map((thread, index) => (
                                        <ConversationThread key={index} thread={thread} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Conversation;