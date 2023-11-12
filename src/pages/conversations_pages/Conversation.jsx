import React, { useState, useEffect, useMemo } from 'react';
import { API } from '@aws-amplify/api'
import { saveAs } from 'file-saver';
import { Button, ButtonGroup, IconButton, InputAdornment, TextField } from '@mui/material';
import { KeyboardReturnRounded, Clear } from '@mui/icons-material';

import Backdrop from '@mui/material/Backdrop';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';

import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';

import { getThreads } from '../../graphql/queries'
import ConversationThread from './ConversationThread';
import './Conversation.css'
import {
    DEFAULT_COLLECTION_NAME,
    LOGGING_DISABLED_MESSAGE,
    ALL_THREADS_FIELDNAME,
    ALL_THREADS_THREADNAME,
    LOGGING,
    SUGGESTIONS
} from './ConversationSettings';

const CACHE = {};

const Conversation = () => {
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [collectionName] = useState(DEFAULT_COLLECTION_NAME);
    const [fieldName] = useState(ALL_THREADS_FIELDNAME);
    const [threadName] = useState(ALL_THREADS_THREADNAME);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [filteredThreadCount, setFilteredThreadCount] = useState(0);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        console.clear();

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
            event.target.blur();
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

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        setDebouncedSearchTerm(suggestion);
    }

    const handleCopy = () => {
        if (!debouncedSearchTerm) return;
        // Filter threads
        const filteredThreads = threads.filter(thread => thread.title.includes(debouncedSearchTerm));

        // Map to only include properties displayed on the screen
        const threadsToCopy = filteredThreads.map(({ title, messages }) => {
            const filteredMessages = messages.map(({ sender, text }) => `*${sender}*: ${text}`);
            return `\n*${title}*\n\n${filteredMessages.join('\n\n')}`;
        });

        // Copy to clipboard
        navigator.clipboard.writeText(threadsToCopy.join('\n\n'));
        console.log("Copy action triggered");
    };

    const handleSave = () => {
        if (!debouncedSearchTerm) return;
        // Implement save functionality
        // Filter threads
        const filteredThreads = threads.filter(thread => thread.title.includes(debouncedSearchTerm));

        // Map to only include properties displayed on the screen
        const threadsToCopy = filteredThreads.map(({ title, messages }) => {
            const filteredMessages = messages.map(({ sender, text }) => ({ sender, text }));
            return { title, messages: filteredMessages };
        });

        const blob = new Blob([JSON.stringify(threadsToCopy)], { type: "text/plain;charset=utf-8" });
        saveAs(blob, `threads_${debouncedSearchTerm}.json`);
        console.log("Save action triggered");
    };

    const handlePrint = () => {
        if (!debouncedSearchTerm) return;
        const printWindow = window.open('', '_blank', 'width=600,height=600');
        const threadsToPrint = document.querySelector('.conversation__body__messages').outerHTML;
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Threads</title>
                </head>
                <body>
                    ${threadsToPrint}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.onafterprint = () => printWindow.close();
        printWindow.print();
        console.log("Print action triggered");
    };

    const handleShare = () => {
        if (!debouncedSearchTerm) return;
        // Implement share functionality
        if (navigator.share) {
            // Filter threads
            const filteredThreads = threads.filter(thread => thread.title.includes(debouncedSearchTerm));

            // Map to only include properties displayed on the screen
            const threadsToCopy = filteredThreads.map(({ title, messages }) => {
                const filteredMessages = messages.map(({ sender, text }) => `*${sender}*: ${text}`);
                return `\n*${title}*\n\n${filteredMessages.join('\n\n')}`;
            });
            navigator.share({
                title: 'Threads',
                text: threadsToCopy.join('\n\n'),
            })
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing', error));
        }
        console.log("Share action triggered");
    };

    const isMobile = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    const actions = [
        { icon: <FileCopyIcon />, name: 'Copy', action: handleCopy },
        { icon: <SaveIcon />, name: 'Save', action: handleSave },
        { icon: <PrintIcon />, name: 'Print', action: handlePrint },
        ...(isMobile() ? [{ icon: <ShareIcon />, name: 'Share', action: handleShare }] : [])
    ];



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
                            <div>
                                <ButtonGroup className='conversation_suggestions' variant="contained" aria-label="outlined primary button group">
                                    {SUGGESTIONS.map(suggestion => (
                                        <Button onClick={() => handleSuggestionClick(suggestion)}>{suggestion}</Button>
                                    ))}
                                </ButtonGroup>
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

            <Backdrop open={open} />
            <SpeedDial
                ariaLabel="SpeedDial tooltip example"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        tooltipOpen
                        onClick={() => {
                            action.action();
                            handleClose();
                        }}
                    />
                ))}
            </SpeedDial>
        </div>
    );
};

export default Conversation;