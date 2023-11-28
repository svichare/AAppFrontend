import React, { useState, useEffect, useRef } from 'react';
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

    // Get collection by collection code
    const findCollectionByCode = (code) => COLLECTIONS.find(collection => collection.code === code)

    const navigate = useNavigate();
    const { query: urlSearchTerm } = useParams();
    const { collectionCode: urlCollectionCode } = useParams();
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(urlSearchTerm || '');
    const [searchTermDebounced, setSearchTermDebounced] = useState(urlSearchTerm || '');
    const [threads, setThreads] = useState([]);
    const [collection, setCollection] = useState(findCollectionByCode(urlCollectionCode));
    const [displayThreads, setDisplayedThreads] = useState([]);
    const [displayedThreadCount, setDisplayedThreadCount] = useState(0);
    const [topicCountMap, setTopicCountMap] = useState(new Map());
    const [topicSubtopicCountMap, setTopicSubtopicCountMap] = useState(new Map());

    const textFieldRef = useRef(null);

    // Function to update the text field value
    const updateTextField = (newValue) => {
        if (textFieldRef.current) {
            textFieldRef.current.value = newValue;
        }
    };

    // Function to handle initial page load
    const handleInitialPageLoad = () => {
        // Perform all tasks that need to be done on initial page load
        // For example, you might want to fetch some data from an API, set some state, etc.

        setLoading(true);

        // Initialize Mixpanel
        mixpanel.init('a709584ba68b4297dce576a32d062ed6', { debug: true, track_pageview: true, persistence: 'localStorage' });

        // Track the page view
        mixpanel.track('Conversation Page Opened', {});

        // Update the text field
        updateTextField(searchTermDebounced)

    };

    // Call the function inside a useEffect hook that runs only once when the component is mounted
    useEffect(() => handleInitialPageLoad(), []);

    // Consolidated function to handle URL changes and update collection
    const handleURLChange = (code) => {
        LOGGING && console.log("handling url change : URL Collection Code : ", code);
        const collection = findCollectionByCode(code);
        collection ? setCollection(collection) : navigate(`/KnowledgeBase/`);
    };

    // Update Collection when the URL changes
    useEffect(() => handleURLChange(urlCollectionCode), [urlCollectionCode]);



    // Handles URL Search Term Modification
    const handleSearchTermModification = () => {
        const modifiedSearchTerm = urlSearchTerm ? urlSearchTerm.replace(/\+/g, ' ') : '';
        if (modifiedSearchTerm !== searchTermDebounced) {
            setSearchTerm(modifiedSearchTerm || '');
            updateTextField(modifiedSearchTerm || '');
            setSearchTermDebounced(modifiedSearchTerm || '');
        }
    }

    // Update the search term when the URL changes
    useEffect(() => handleSearchTermModification(), [urlSearchTerm]);

    // Handles Search Term URL Modification
    const handleSearchTermURLModification = () => {
        const modifiedSearchTerm = searchTermDebounced.replace(/ /g, '+');
        navigate(`/KnowledgeBase/${collection && collection.code}/search/${modifiedSearchTerm}`);
    }

    // Update the URL when the search term changes
    useEffect(() => handleSearchTermURLModification(), [searchTermDebounced]);

    // Handles Fetching Conversations
    const handleFetchConversations = () => { if (!collection) { return } fetchConversations(); LOGGING && console.log('Fetching conversations : Should happen only once'); }

    // Fetches the conversations once after the component is mounted only if the url code is valid
    useEffect(() => handleFetchConversations(), [collection]);


    // Handles fetching conversations
    const fetchConversations = async () => {
        LOGGING && console.log(`🚀 Fetching threads from API`);

        try {    
            // Check if the URL collection code is valid
            const collection = findCollectionByCode(urlCollectionCode);
            if (!collection) { handleInvalidCollection(); return; }

            // Fetch threads from API
            const response = await fetchThreadsFromAPI(collection.name);
            handleFetchedThreads(response.data.getThreads);
        }
        catch (error) { handleFetchError(error); }
    };

    // Handles invalid collection
    const handleInvalidCollection = () => {
        console.error(`Invalid collection code : ${urlCollectionCode}`);
        setThreads([]);
        setLoading(false);
    };

    // Handles fetched threads
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
    function renderConversations() {
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

        setDisplayedThreads(searchTermDebounced === '' ? threads.slice(SKIP_THREADS_COUNT, SKIP_THREADS_COUNT + FEATURED_THREADS_COUNT) : sortedThreads)

        console.log(`🔍 Displaying ${displayThreads.length} ${displayThreads.length === 1 ? 'thread' : 'threads'} out of ${threads.length} ${threads.length === 1 ? 'thread' : 'threads'} that match the search term : ${searchTermDebounced}`);
    }

    // Renders the conversations whenever the threads or search term (debounced) changes
    useEffect(() => { renderConversations(); }, [threads, searchTermDebounced]);


    // Handle suggestion click
    const handleSuggestionSearch = (suggestion) => {
        setSearchTerm(suggestion);
        updateTextField(suggestion);
        setSearchTermDebounced(suggestion);
    }

    // Function to clear search term
    const clearSearchTerm = () => {
        setSearchTerm('');
        updateTextField('');
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
                copyToClipboard={copyToClipboard}
                clearSearchTerm={clearSearchTerm}
                displayedThreadCount={displayedThreadCount}
                textFieldRef={textFieldRef}
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
                            {displayThreads && displayThreads.map((thread, index) => (
                                <ConversationThread key={index} thread={thread} autoExpand={displayedThreadCount === 1} />
                            ))}
                        </div>
                    </div>
                )}
        </div>
    );
}

export default Conversation;