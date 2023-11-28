import React, { useState, useEffect, useMemo } from 'react';
import { API } from '@aws-amplify/api'
import { LinearProgress, Box, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';

import { getThreads } from '../../graphql/queries'
import ConversationThread from './ConversationThread';
import './Conversation.css'
import {
    LOGGING,
    SUGGESTIONS,
    COLLECTIONS,
    FEATURED_THREADS_COUNT,
    SKIP_THREADS_COUNT
} from './ConversationSettings';
import SearchBar from './SearchBar';
import SearchSuggestions from './SearchSuggestions';

const Conversation = () => {
    const navigate = useNavigate();
    const { query: urlSearchTerm } = useParams();
    const { collectionCode: urlCollectionCode } = useParams();
    const [searchTerm, setSearchTerm] = useState(urlSearchTerm || '');
    const [searchTermDebounced, setSearchTermDebounced] = useState(urlSearchTerm || '');
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [collection, setCollection] = useState(findCollectionByCode(urlCollectionCode));
    const [displayedThreadCount, setDisplayedThreadCount] = useState(0);
    const [topicCountMap, setTopicCountMap] = useState(new Map());
    const [topicSubtopicCountMap, setTopicSubtopicCountMap] = useState(new Map());

    // Initialize Mixpanel
    mixpanel.init('a709584ba68b4297dce576a32d062ed6', { debug: true, track_pageview: true, persistence: 'localStorage' });

    // Get collection by collection code
    function findCollectionByCode(code) {
        return COLLECTIONS.find(collection => collection.code === code);
    }

    // Consolidated function to handle URL changes and update collection
    const handleURLChange = (code) => {
        LOGGING && console.log("useEffect : URL Collection Code : ", code);
        const collection = findCollectionByCode(code);
        if (collection) {
            setCollection(collection);
        } else {
            navigate(`/KnowledgeBase/`);
        }
    };

    // Update Collection when the URL changes
    useEffect(() => {
        handleURLChange(urlCollectionCode);
    }, [urlCollectionCode]);

    // Update the search term when the URL changes
    useEffect(() => {
        const modifiedSearchTerm = urlSearchTerm ? urlSearchTerm.replace(/\+/g, ' ') : '';
        if (modifiedSearchTerm !== searchTermDebounced) {
            setSearchTerm(modifiedSearchTerm || '');
            setSearchTermDebounced(modifiedSearchTerm || '');
        }
    }, [urlSearchTerm]);

    // Update the URL when the search term changes
    useEffect(() => {
        const modifiedSearchTerm = searchTermDebounced.replace(/ /g, '+');
        navigate(`/KnowledgeBase/${collection && collection.code}/search/${modifiedSearchTerm}`);
    }, [searchTermDebounced]);

    // Fetches the conversations once after the component is mounted only if the url code is valid
    useEffect(() => {
        if (!collection) {
            return;
        }
        fetchConversations();
        LOGGING && console.log('Fetching conversations : Should happen only once');
    }, [collection]);



    // Extracted function to handle fetching conversations
    const fetchConversations = async () => {
        setLoading(true);

        try {
            LOGGING && console.log(`🚀 Fetching threads from API`);
            mixpanel.track('Conversation Page Opened', {});

            const collection = findCollectionByCode(urlCollectionCode);
            if (!collection) {
                handleInvalidCollection();
                return;
            }

            const response = await fetchThreadsFromAPI(collection.name);
            handleFetchedThreads(response.data.getThreads);
        } catch (error) {
            handleFetchError(error);
        }
    };

    // Function to handle invalid collection
    const handleInvalidCollection = () => {
        console.error(`Invalid collection code : ${urlCollectionCode}`);
        setThreads([]);
        setLoading(false);
    };

    // Function to handle fetched threads
    const handleFetchedThreads = (fetchedThreads) => {
        const THREAD_COUNT = fetchedThreads.length;

        if (THREAD_COUNT === 0) {
            setThreads([]);
            setLoading(false);
            return;
        }

        setThreads(fetchedThreads);
        updateTopicCountMaps(fetchedThreads);
        setLoading(false);
    };

    // Function to update topic count maps
    const updateTopicCountMaps = (threads) => {
        const curTopicCountMap = new Map();
        const curTopicSubTopicCountMap = new Map();
        let threadTitleCount = 0;

        threads.forEach(obj => {
            const { topic, subtopic, title } = obj;

            if (typeof title !== 'undefined') {
                threadTitleCount++;
            }

            if (typeof topic !== 'undefined') {
                curTopicCountMap.set(topic, (curTopicCountMap.get(topic) || 0) + 1);
            }

            if (typeof subtopic !== 'undefined' && typeof topic !== 'undefined') {
                const cur_pair = `${topic}-${subtopic}`;
                curTopicSubTopicCountMap.set(cur_pair, (curTopicSubTopicCountMap.get(cur_pair) || 0) + 1);
            }
        });

        setTopicCountMap(curTopicCountMap);
        setTopicSubtopicCountMap(curTopicSubTopicCountMap);
        LOGGING && console.log("TopicMap size : ", curTopicCountMap.size, " title count ", threadTitleCount);
        LOGGING && console.log("SubTopicMap size : ", curTopicSubTopicCountMap.size);
    };

    // Function to handle fetch error
    const handleFetchError = (error) => {
        console.error('Error fetching conversation:', error);
        setThreads([]);
        setLoading(false);
    };

    // Function to fetch threads from API
    const fetchThreadsFromAPI = async (collectionName) => {
        try {
            return await API.graphql({
                query: getThreads,
                variables: {
                    collection_name: collectionName,
                    key: undefined,
                    value: undefined
                },
            });
        } catch (error) {
            throw new Error(`Error fetching threads: ${error}`);
        }
    };


    // Debounce the search term so that the API is not called on every keystroke
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            setSearchTermDebounced(searchTerm);
            event.target.blur();
        }
    }

    // Copy the URL to the clipboard
    const copyToClipboard = () => {
        navigator && navigator.clipboard && navigator.clipboard.writeText(window.location.href)
            .then(() => {
                LOGGING && console.log(`📎 Copied URL`);
            }, err => {
                console.error('Could not copy text: ', err);
            });
    };

    // Render the conversations
    const renderConversations = useMemo(() => {
        const lowerCaseSearchTerm = searchTermDebounced.toLowerCase();

        const titleMatches = threads.filter(thread => {
            if (!thread.isValid) return false;

            const lowerCaseTitle = (thread.title || '').toLowerCase();
            const titleMatches = lowerCaseTitle.includes(lowerCaseSearchTerm);

            return titleMatches;
        });

        const messageMatches = threads.filter(thread => {
            if (!thread.isValid) return false;

            const lowerCaseTitle = (thread.title || '').toLowerCase();
            const titleMatches = lowerCaseTitle.includes(lowerCaseSearchTerm);

            return !titleMatches && thread.messages.some(message => {
                const lowerCaseText = (message.text || '').toLowerCase();
                return lowerCaseText.includes(lowerCaseSearchTerm);
            });
        });

        const sortedThreads = [...titleMatches, ...messageMatches];

        setDisplayedThreadCount(sortedThreads.length);

        if (searchTermDebounced.length > 1) {
            mixpanel.track('Conversation Searched', {
                'Search term': searchTermDebounced,
                'threads found': sortedThreads.length
            });
        }

        const displayThreads = searchTermDebounced === '' ? threads.slice(SKIP_THREADS_COUNT, SKIP_THREADS_COUNT + FEATURED_THREADS_COUNT) : sortedThreads;

        console.log(`🔍 Displaying ${displayThreads.length} ${displayThreads.length === 1 ? 'thread' : 'threads'} out of ${threads.length} ${threads.length === 1 ? 'thread' : 'threads'} that match the search term : ${searchTermDebounced}`);

        return displayThreads.map((thread, index) => (
            <ConversationThread key={index} thread={thread} autoExpand={sortedThreads.length === 1} />
        ));
    }, [threads, searchTermDebounced]);


    // Handle suggestion click
    const handleSuggestionSearch = (suggestion) => {
        setSearchTerm(suggestion);
        setSearchTermDebounced(suggestion);
    }

    // Function to clear search term
    const clearSearchTerm = () => {
        setSearchTerm('');
        setSearchTermDebounced('');
    };

    return (
        <div className="container">

            {/* Header */}
            <h2>Explore the Knowledge Base</h2>

            {/* Search Bar */}
            <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setSearchTermDebounced={setSearchTermDebounced}
                handleKeyPress={handleKeyPress}
                copyToClipboard={copyToClipboard}
                clearSearchTerm={clearSearchTerm}
                displayedThreadCount={displayedThreadCount}
            />

            {/* Search Suggestions */}
            <SearchSuggestions
                suggestions={SUGGESTIONS}
                handleSuggestionSearch={handleSuggestionSearch}
            />

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

export default Conversation;