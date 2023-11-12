import React, { useState, useEffect, useMemo } from 'react';
import { API } from '@aws-amplify/api'
import { TextField } from '@mui/material';
import { InputAdornment } from '@mui/material';
import { IconButton } from '@mui/material';
import { KeyboardReturnTwoTone } from '@mui/icons-material';

import { getThreads } from '../../graphql/queries'
import ConversationThread from './ConversationThread';
import './Conversation.css'
import {
    DEFAULT_COLLECTION_NAME,
    LOGGING_DISABLED_MESSAGE,
    ALL_THREADS_FIELDNAME,
    ALL_THREADS_THREADNAME,
    LOGGING
} from './ConversationSettings';

const CACHE = {};


const Conversation = () => {
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [collectionName] = useState(DEFAULT_COLLECTION_NAME);
    const [fieldName, setFieldName] = useState(ALL_THREADS_FIELDNAME);
    const [threadName, setThreadName] = useState(ALL_THREADS_THREADNAME);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [filteredThreadCount, setFilteredThreadCount] = useState(0);

    useEffect(() => {
        console.clear();

        !LOGGING && console.log(LOGGING_DISABLED_MESSAGE);

        if (LOGGING) {
            const CACHE_KEYS = Object.keys(CACHE)
            console.log(`📦 Cache size : ${CACHE_KEYS.length} : ${((s) => s > 1024 ? `${(s / 1024).toFixed(2)}MB` : `${s}KB`)((new Blob([JSON.stringify(CACHE)]).size / 1024).toFixed(2))}`);
        }

        const fetchConversation = async () => {
            setLoading(true);
            const cacheKey = btoa(`${collectionName}-${fieldName}-${threadName}`).toString();
            if (CACHE[cacheKey]) {
                LOGGING && console.log(`🏁 Cached threads Returned : ${CACHE[cacheKey].length} : ${((s) => s > 1024 ? `${(s / 1024).toFixed(2)}MB` : `${s}KB`)((new Blob([JSON.stringify(CACHE[cacheKey])]).size / 1024).toFixed(2))}`);
                setThreads(CACHE[cacheKey]);
                setLoading(false);
                return;
            }

            try {
                //log the query
                LOGGING && console.log(`🚀 Fetching threads from API`);
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

    }, [collectionName, fieldName, threadName, debouncedSearchTerm]);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            setDebouncedSearchTerm(searchTerm);
        }
    }

    const memoizedThreadList = useMemo(() => {
        const filteredThreads = threads
            .filter(thread => thread.title.includes(debouncedSearchTerm));

        // Update the filtered thread count
        setFilteredThreadCount(filteredThreads.length);

        return filteredThreads.map((thread, index) => {
            return (<ConversationThread key={index} thread={thread} />)
        });
    }, [threads, debouncedSearchTerm]);

    return (
        <div className="container">
            <div>
                <div className="conversation">
                    <h2>Threads</h2>
                    <p>Search Results: {debouncedSearchTerm.length >= 2 ? filteredThreadCount : 0}</p>
                    <TextField
                        className='search__input'
                        variant="outlined"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyPress}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setDebouncedSearchTerm(searchTerm)}>
                                        <KeyboardReturnTwoTone />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <div className="conversation__body">
                        {debouncedSearchTerm.length >= 2 && (loading ? (
                            <div className="loader"></div>
                        ) : (
                                <div className="conversation__body__messages">
                                    {memoizedThreadList}
                                </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Conversation;