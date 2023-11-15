import React, { useState, useEffect, useMemo } from 'react';
import { API } from '@aws-amplify/api'
import { Button, Chip, IconButton, InputAdornment, TextField } from '@mui/material';
import { KeyboardReturnRounded, Clear, FileCopyRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';

import { getThreads } from '../../graphql/queries'
import ConversationThread from './ConversationThread';
import './Conversation.css'
import {
    DEFAULT_COLLECTION_NAME,
    ALL_THREADS_FIELDNAME,
    ALL_THREADS_THREADNAME,
    LOGGING,
    SUGGESTIONS,
} from './ConversationSettings';

const Conversation = () => {
    const navigate = useNavigate();
    const { searchTerm: urlSearchTerm } = useParams();
    const [searchTerm, setSearchTerm] = useState(urlSearchTerm || '');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(urlSearchTerm || '');
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [collectionName] = useState(DEFAULT_COLLECTION_NAME);
    const [fieldName] = useState(ALL_THREADS_FIELDNAME);
    const [threadName] = useState(ALL_THREADS_THREADNAME);
    const [filteredThreadCount, setFilteredThreadCount] = useState(0);
    const [topicCountMap, setTopicCountMap] = useState(new Map());
    const [topicSubtopicCountMap, setTopicSubtopicCountMap] = useState(new Map());

    // Initialize Mixpanel
    mixpanel.init('a709584ba68b4297dce576a32d062ed6', { debug: true, track_pageview: true, persistence: 'localStorage' });

    // Update the search term when the URL changes
    useEffect(() => {
        if (urlSearchTerm !== debouncedSearchTerm) {
            setSearchTerm(urlSearchTerm || '');
            setDebouncedSearchTerm(urlSearchTerm || '');
        }
    }, [urlSearchTerm]);

    // Update the URL when the search term changes
    useEffect(() => {
        navigate(`/Conversations/search/${debouncedSearchTerm}`);

    }, [debouncedSearchTerm]);

    // Fetches the conversations once after the component is mounted
    useEffect(() => {
        fetchConversations();
        console.log('Fetching conversations : Should happen only once')
    }, []);

    // Function to fetch the conversations from the API
    async function fetchConversations() {
        setLoading(true);

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
                console.log("TopicMap size : ", curTopicCountMap.size, " title count ", threadTitleCount);
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

    // Debounce the search term so that the API is not called on every keystroke
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            setDebouncedSearchTerm(searchTerm);
            event.target.blur();
        }
    }

    // Copy the URL to the clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                console.log(`📎 Copied URL`);
            }, err => {
                console.error('Could not copy text: ', err);
            });
    };

    // Render the conversations
    const renderConversations = useMemo(() => {

        // Filter the threads based on the search term
        const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase();
        console.log(`🔍 Filtering threads with search term : ${lowerCaseSearchTerm}`)

        // Get the threads that match the search term in the title
        const titleMatches = threads.filter(thread => {
            if (!thread.isValid) return false;
            const lowerCaseTitle = thread.title && thread.title.toLowerCase();
            return lowerCaseTitle && lowerCaseTitle.includes(lowerCaseSearchTerm);
        });

        // Get the threads that match the search term in the messages
        const messageMatches = threads.filter(thread => {
            if (!thread.isValid || (thread.title && thread.title.toLowerCase().includes(lowerCaseSearchTerm))) return false;
            return thread.messages.some(message => {
                const lowerCaseText = message.text && message.text.toLowerCase();
                return lowerCaseText && lowerCaseText.includes(lowerCaseSearchTerm);
            });
        });

        // Combine the title and message matches based on ranking
        const filteredThreads = [...titleMatches, ...messageMatches];

        // Update the filtered thread count
        setFilteredThreadCount(filteredThreads.length);

        // Log the search term and the number of threads found
        if (debouncedSearchTerm.length > 1) {
            mixpanel.track('Conversation Searched', {
                'Search term': debouncedSearchTerm,
                'threads found': filteredThreads.length
            });
        }

        // Render the filtered threads
        return filteredThreads.map((thread, index) => {
            return (<ConversationThread key={index} thread={thread} />)
        });
    }, [threads, debouncedSearchTerm]);

    // Handle suggestion click
    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        setDebouncedSearchTerm(suggestion);
    }

    return (
        <div className="container">
            <h2>Conversation Threads</h2>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <p style={{ marginLeft: '10px' }}>Search Results: {debouncedSearchTerm.length >= 2 ? filteredThreadCount : 0}</p>
                <Button className="square-button" onClick={copyToClipboard}>
                    <FileCopyRounded />
                </Button>
            </div>

                    {

                        <div className='search-suggestions'>
                            {SUGGESTIONS.map(suggestion => (
                                <Chip className='chip'
                                    label={<><span role="img" aria-label="magnifying glass">🔍</span><span className="suggestion-text">{suggestion}</span></>}
                                    onClick={() => handleSuggestionClick(suggestion)}>
                                </Chip>
                            ))}
                        </div>
                    }
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
                                document.activeElement.blur();
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

            {debouncedSearchTerm.length === 0 && (
                <div className='search-suggestions'>
                    {SUGGESTIONS.map(suggestion => (
                        <Chip
                            key={suggestion}
                            className='chip'
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
                        {renderConversations}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Conversation;