import React, { useState, useEffect, useMemo } from 'react';
import { API } from '@aws-amplify/api'
import { Button, ButtonGroup, Chip, IconButton, InputAdornment, TextField } from '@mui/material';
import { KeyboardReturnRounded, Clear, FileCopyRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/system';
import mixpanel from 'mixpanel-browser';

import { getThreads } from '../../graphql/queries'
import ConversationThread from './ConversationThread';
import './Conversation.css'
import {
    DEFAULT_COLLECTION_NAME,
    LOGGING_DISABLED_MESSAGE,
    ALL_THREADS_FIELDNAME,
    ALL_THREADS_THREADNAME,
    LOGGING,
    SUGGESTIONS,
    PERSIST_LOGS
} from './ConversationSettings';

const CACHE = {};

const Conversation = () => {
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [collectionName] = useState(DEFAULT_COLLECTION_NAME);
    const [fieldName] = useState(ALL_THREADS_FIELDNAME);
    const [threadName] = useState(ALL_THREADS_THREADNAME);
    const [filteredThreadCount, setFilteredThreadCount] = useState(0);
    const [topicCountMap, setTopicCountMap] = useState(new Map());
    const [topicSubtopicCountMap, setTopicSubtopicCountMap] = useState(new Map());
    

    const navigate = useNavigate();
    const { searchTerm: urlSearchTerm } = useParams();

    const [searchTerm, setSearchTerm] = useState(urlSearchTerm || '');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(urlSearchTerm || '');
    
    mixpanel.init('a709584ba68b4297dce576a32d062ed6', { debug: true, track_pageview: true, persistence: 'localStorage' });

    useEffect(() => {
        if (urlSearchTerm !== debouncedSearchTerm) {
            setSearchTerm(urlSearchTerm || '');
            setDebouncedSearchTerm(urlSearchTerm || '');
        }
    }, [urlSearchTerm]);

    useEffect(() => {
        navigate(`/Conversations/search/${debouncedSearchTerm}`);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        !PERSIST_LOGS && console.clear();

        !LOGGING && console.log(LOGGING_DISABLED_MESSAGE);

        if (LOGGING) {
            const CACHE_KEYS = Object.keys(CACHE)
            console.log(`📦 Cache size : ${CACHE_KEYS.length} : ${((s) => s > 1024 ? `${(s / 1024).toFixed(2)}MB` : `${s}KB`)((new Blob([JSON.stringify(CACHE)]).size / 1024).toFixed(2))}`);
        }

        const fetchConversation = async () => {
            // log search term
            LOGGING && console.log(`🔍 Searching for threads with search term : ${debouncedSearchTerm}`);
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
                mixpanel.track('Conversation Page Opened', {
                });

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
                    // Update the topic count map.
                    const curTopicCountMap = new Map();
                    const curTopicSubTopicCountMap = new Map();
                    var threadTitleCount = 0;
                    threads.forEach(obj => {
                      const topic = obj.topic;
                      const subtopic = obj.subtopic;
                      const title = obj.title;
                      
                      if (typeof title !== 'undefined') {
                          ++threadTitleCount;
                      }

                      // If the topic is not in the map, initialize count to 1; otherwise, increment the count
                      if (typeof topic === 'undefined') {
                          return;
                      }
                      curTopicCountMap.set(topic, (curTopicCountMap.get(topic) || 0) + 1);
                      
                      if (typeof subtopic === 'undefined') {
                          return;
                      }
                      var cur_pair = (topic, subtopic);
                      curTopicSubTopicCountMap.set(cur_pair, (curTopicSubTopicCountMap.get(cur_pair) || 0) + 1);
                    });
                    setTopicCountMap(curTopicCountMap);
                    console.log("TopicMap size : ", curTopicCountMap.size," title count ", threadTitleCount);
                    setTopicSubtopicCountMap(curTopicSubTopicCountMap);
                    console.log("SubTopicMap size : ", curTopicSubTopicCountMap.size);
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

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                console.log(`📎 Copied URL`);
            }, err => {
                console.error('Could not copy text: ', err);
            });
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            setDebouncedSearchTerm(searchTerm);
            event.target.blur();
        }
    }

    const memoizedThreadList = useMemo(() => {
        const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase();
        
        

        const filteredThreads = threads.filter(thread => {
            const titleMatch = thread.title && thread.title.toLowerCase().includes(lowerCaseSearchTerm);
            const messageMatch = thread.messages.some(message => message.text && message.text.toLowerCase().includes(lowerCaseSearchTerm));

            // Only include threads if the title or any of the messages match the search term
            return (titleMatch || messageMatch) && thread.isValid;
        });

        // Update the filtered thread count
        setFilteredThreadCount(filteredThreads.length);
        
        if (debouncedSearchTerm.length > 1) {
            mixpanel.track('Conversation Searched', {
                'Search term': debouncedSearchTerm,
                'threads found': filteredThreads.length
            });
        }

        return filteredThreads.map((thread, index) => {
            return (<ConversationThread key={index} thread={thread} />)
        });
    }, [threads, debouncedSearchTerm]);

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        setDebouncedSearchTerm(suggestion);
    }

    return (
        <div className="container">
            <div>
                <div className="conversation">
                    <h2>Conversation Threads</h2>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{ marginLeft: '10px' }}>Search Results: {debouncedSearchTerm.length >= 2 ? filteredThreadCount : 0}</p>
                        <Button className="square-button" onClick={copyToClipboard}>
                            <FileCopyRounded />
                        </Button>
                    </div>
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
                                    <IconButton onClick={() => {
                                        setDebouncedSearchTerm(searchTerm);
                                        document.activeElement.blur(); // Add this line
                                    }}>
                                        <KeyboardReturnRounded />
                                    </IconButton>
                                    <IconButton onClick={() => {
                                        setSearchTerm('');
                                        setDebouncedSearchTerm('');
                                    }}>
                                        <Clear />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {
                        debouncedSearchTerm.length === 0 && (
                            <div className='search-suggestions'>
                                {SUGGESTIONS.map(suggestion => (
                                    <Chip className='chip'
                                        label={<><span role="img" aria-label="magnifying glass">🔍</span><span className="suggestion-text">{suggestion}</span></>}
                                        onClick={() => handleSuggestionClick(suggestion)}>
                                    </Chip>
                                ))}
                            </div>
                        )
                    }

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