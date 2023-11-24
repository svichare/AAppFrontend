import React, { useState, useEffect, useMemo } from 'react';
import { API } from '@aws-amplify/api'
import { Button, Chip, IconButton, InputAdornment, TextField, LinearProgress, Box, Skeleton } from '@mui/material';
import { KeyboardReturnRounded, Clear, FileCopyRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';

import { getThreads } from '../../graphql/queries'
import ConversationThread from '../conversations_pages/ConversationThread';
import './GroupchatHome.css'
import {
    LOGGING,
    SUGGESTIONS,
    COLLECTIONS,
    FEATURED_THREADS_COUNT,
    SKIP_THREADS_COUNT
} from '../conversations_pages/ConversationSettings';

const GroupchatHome = () => {
    const navigate = useNavigate();
    const { query: urlSearchTerm } = useParams();
    const { collectionCode: urlCollectionCode } = useParams();
    const [searchTerm, setSearchTerm] = useState(urlSearchTerm || '');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(urlSearchTerm || '');
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [collection, setCollection] = useState(getCollectionByCode(urlCollectionCode));
    const [filteredThreadCount, setFilteredThreadCount] = useState(0);
    const [topicCountMap, setTopicCountMap] = useState(new Map());
    const [topicSubtopicCountMap, setTopicSubtopicCountMap] = useState(new Map());
    const [topicDisplayMap, setTopicDisplayMap] = useState(new Map());
    

    // Initialize Mixpanel
    mixpanel.init('a709584ba68b4297dce576a32d062ed6', { debug: true, track_pageview: true, persistence: 'localStorage' });

    // Get collection by collection code
    function getCollectionByCode(code) {
        return COLLECTIONS.find(collection => collection.code === code);
    }

    // Update Collection when the URL changes
    useEffect(() => {
        LOGGING && console.log("useEffect : URL Collection Code : ", urlCollectionCode);
        const collection = getCollectionByCode(urlCollectionCode);
        if (collection) {
            setCollection(collection);
        }
        else {
            navigate(`/KnowledgeBase/`);
        }
    }, [urlCollectionCode]);


    // Fetches the conversations once after the component is mounted only if the url code is valid
    useEffect(() => { if (!collection) { return; } fetchConversations(); LOGGING && console.log('Fetching conversations : Should happen only once') }, [collection]);

    // Function to fetch the conversations from the API
    async function fetchConversations() {
        setLoading(true);

        try {
            //log the query
            LOGGING && console.log(`🚀 Fetching threads from API`);
            mixpanel.track('Conversation Page Opened', {
            });

            // use getCollectionByCode(urlCollectionCode)
            const collection = getCollectionByCode(urlCollectionCode);
            if (!collection) {
                console.error(`Invalid collection code : ${urlCollectionCode}`);
                setThreads([]);
                setLoading(false);
                return;
            }


            const response = await API.graphql({
                query: getThreads,
                variables: {
                    collection_name: collection.name,
                    key: undefined,
                    value: undefined
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
                let topicArray = Array.from(curTopicCountMap);

                topicArray.sort((a, b) => b[1] - a[1]);
                
                setTopicCountMap(new Map(topicArray));
                setTopicDisplayMap(new Map(topicArray));
                LOGGING && console.log("TopicMap size : ", topicArray.length, " title count ", threadTitleCount);
                setTopicSubtopicCountMap(curTopicSubTopicCountMap);
                LOGGING && console.log("SubTopicMap size : ", curTopicSubTopicCountMap.size);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching conversation:', error);
            setThreads([]);
            setLoading(false);
        }
    };

    // Render the conversations
    const renderConversations = useMemo(() => {

        // Filter the threads based on the search term
        const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase();
        LOGGING && console.log(`🔍 Filtering threads with search term : ${lowerCaseSearchTerm}`)

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

        const displayThreads = debouncedSearchTerm === '' ? threads.slice(SKIP_THREADS_COUNT, SKIP_THREADS_COUNT + FEATURED_THREADS_COUNT) : filteredThreads;

        LOGGING && console.log(`🔍 Displaying ${displayThreads.length} ${displayThreads.length === 1 ? 'thread' : 'threads'} out of ${threads.length} ${threads.length === 1 ? 'thread' : 'threads'} that match the search term : ${debouncedSearchTerm}`);

        // Render the filtered threads
        return displayThreads.map((thread, index) => {
            return (<ConversationThread key={index} thread={thread} autoExpand={filteredThreads.length === 1} />)
        });
    }, [threads, debouncedSearchTerm]);

    // Handle suggestion click
    const handleSuggestionClick = (suggestion) => {
        // update the topicDisplayMap to show subtopics.
        let subtopicMap = new Map();
        
        console.log("Travering subtopic map : ", topicSubtopicCountMap.length );
        for (const [key, value] of topicSubtopicCountMap) {
            const [string1, string2] = key;
        
            // Check if string1 matches the filter string
            if (string1 === suggestion) {
              // Use string2 as the key in the new map
              subtopicMap.set(string2, value);
            }
          }
        
        setTopicDisplayMap(new Map(subtopicMap));
    }

    return (
        <div className="container">

            {/* Header */}
            <h2>GroupChat Homepage</h2>

            {/* Topic list */}
            <h3>Discussed topics</h3>
            <div className='search-suggestions'>
                {[...topicDisplayMap].map(([key, value]) => (
                    <Chip className='chip'
                        key={key}
                        label={<><span role="img" aria-label="magnifying glass">🔍</span><span className="suggestion-text">{`${key}: ${value}`}</span></>}
                        onClick={() => handleSuggestionClick(key)}>
                    </Chip>
                ))}
            </div>

            {/* Threads */}
            {loading ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                    <Skeleton className='skeleton' variant="rounded" animation="wave" />
                    <Skeleton className='skeleton' variant="rounded" animation="wave" />
                    <Skeleton className='skeleton' variant="rounded" animation="wave" />
                    <Skeleton className='skeleton' variant="rounded" animation="wave" />
                    <Skeleton className='skeleton' variant="rounded" animation="wave" />
                </Box>
                : (
                    <div className="conversation__body">
                    <div className="conversation__body__messages">
                        {renderConversations}
                        </div>
                    </div>
                )}
        </div>
    );
}

export default GroupchatHome;