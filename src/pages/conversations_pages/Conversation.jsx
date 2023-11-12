import React, { useState, useEffect } from 'react';
import { API } from '@aws-amplify/api'

import { Button } from '@mui/material';
import { getThreads } from '../../graphql/queries'

import ConversationThread from './ConversationThread';
import './Conversation.css'

import {
    DEFAULT_COLLECTION_NAME,
    DEFAULT_FIELD_NAME,
    DEFAULT_THREAD_NAME,
    LOGGING_DISABLED_MESSAGE,
    ALL_THREADS_FIELDNAME,
    ALL_THREADS_THREADNAME,
    LOGGING
} from './ConversationSettings';

const CACHE = {};

const Conversation = () => {
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [collectionName] = useState(DEFAULT_COLLECTION_NAME);
    const [fieldName, setFieldName] = useState(DEFAULT_FIELD_NAME);
    const [threadName, setThreadName] = useState(DEFAULT_THREAD_NAME);

    useEffect(() => {
        console.clear();
        !LOGGING && console.log(LOGGING_DISABLED_MESSAGE);

        if (LOGGING) {
            const CACHE_KEYS = Object.keys(CACHE)
            console.log({ CACHE_KEYS });
        }

        const fetchConversation = async () => {
            setLoading(true);
            const cacheKey = `${collectionName}-${fieldName}-${threadName}`;
            if (CACHE[cacheKey]) {
                LOGGING && console.log(`🏁 Cached threads Returned : ${CACHE[cacheKey].length} : ${((s) => s > 1024 ? `${(s / 1024).toFixed(2)}MB` : `${s}KB`)((new Blob([JSON.stringify(CACHE[cacheKey])]).size / 1024).toFixed(2))}`);
                setThreads(CACHE[cacheKey]);
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
                LOGGING && console.log(`🛸 Fetched ${response.data.getThreads.length} ${response.data.getThreads.length === 1 ? 'thread' : 'threads'} from API : ${((s) => s > 1024 ? `${(s / 1024).toFixed(2)}MB` : `${s}KB`)((new Blob([JSON.stringify(response.data.getThreads)]).size / 1024).toFixed(2))}`);

                const THREAD_COUNT = response.data.getThreads.length;

                if (THREAD_COUNT === 0) {
                    LOGGING && console.log("No threads returned!");
                    setThreads([]);
                    setLoading(false);
                    return;
                }
                else {
                    const threads = response.data.getThreads;
                    setThreads(threads);
                    CACHE[cacheKey] = threads;
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching conversation:', error);
                setThreads([]);
                setLoading(false);
            }
        };

        fetchConversation();
    }, [collectionName, fieldName, threadName]);

    const allConversations = () => {
        LOGGING && console.log(`Fetching all conversations`);
        setLoading(true);
        setFieldName("");
        setThreadName("");
    }

    const oneConversation = () => {
        LOGGING && console.log(`Fetching one conversation`);
        setLoading(true);
        setFieldName("title");
        setThreadName(DEFAULT_THREAD_NAME);
    }

    return (
        <div className="container">
            <div>
                <div className="conversation">
                    <h2>Conversations</h2>
                    <Button variant="contained" onClick={() => allConversations()} disabled={fieldName === ALL_THREADS_FIELDNAME && threadName === ALL_THREADS_THREADNAME} className='threads_button' style={{ marginRight: '10px' }}>All Threads</Button>
                    <Button variant="contained" onClick={() => oneConversation()} disabled={fieldName === DEFAULT_FIELD_NAME && threadName === DEFAULT_THREAD_NAME} className='threads_button'>One Thread</Button>
                    <div className="conversation__body">
                        {loading ? (
                            <div class="loader"></div>
                        ) : (
                                <div className="conversation__body__messages">
                                    {threads.map((thread, index) => (
                                        <ConversationThread key={index} thread={thread} />
                                    ))}
                                </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Conversation;