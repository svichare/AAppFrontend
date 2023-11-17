import React, { useEffect, useState } from 'react'
import { getThreads } from '../../graphql/queries'
import { API, graphqlOperation } from 'aws-amplify';
import './FilterThreads.css';
import { markThreadValidity, markMessageValidity } from '../../graphql/mutations'
import { Button, Card, Paper, Switch } from '@mui/material';
import { styled } from '@mui/system';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { COLLECTIONS } from './ConversationSettings';

const fetchThreads = async (collection, setThreads, setLoading) => {
    setLoading(true);
    const response = await API.graphql({
        query: getThreads,
        variables: {
            collection_name: collection.name,
            key: undefined,
            value: undefined
        },
    });

    const THREAD_COUNT = response.data.getThreads.length;

    if (THREAD_COUNT === 0) {
        console.log("No threads returned!");
        setThreads([]);
        setLoading(false);
    }
    else {
        const threads = response.data.getThreads;
        console.log("Returning " + THREAD_COUNT + " threads.");
        setThreads(threads);
        setLoading(false);
    }
}

const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'];

const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash += str.charCodeAt(i);
    }
    return hash;
};

const getEmoji = (name) => {
    const hash = hashString(name);
    const index = hash % emojis.length;
    return emojis[index];
};

async function update_thread_validity(cur_collection_name, cur_thread_id, cur_new_validity) {

    try {
        const response = await API.graphql(
            graphqlOperation(markThreadValidity,
                {
                    collection_name: cur_collection_name,
                    thread_id: cur_thread_id,
                    new_validity: cur_new_validity
                }));
        console.log(`🔄 Updating the response for collection: ${cur_collection_name}, thread: ${cur_thread_id}, new validity: ${cur_new_validity}. Received response: ${response.data.markThreadValidity.status}`);
    } catch (error) {
        console.error(`❌ Caught error in update_thread_validity function: ${JSON.stringify(error)}`);
    }
}

async function update_message_validity(cur_collection_name, cur_thread_id, cur_new_validity, cur_message_text) {

    try {
        const response = await API.graphql(
            graphqlOperation(markMessageValidity,
                {
                    collection_name: cur_collection_name,
                    thread_id: cur_thread_id,
                    new_validity: cur_new_validity,
                    message_text: cur_message_text
                }));
        console.log(`🔄 Updating the response for collection: ${cur_collection_name}, thread: ${cur_thread_id}, new validity: ${cur_new_validity}, message: ${cur_message_text}. Received response: ${JSON.stringify(response)}`);
    } catch (error) {
        console.error(`❌ Caught error in update_message_validity function: ${JSON.stringify(error)}`);
    }
}

// Renders the FilterThreads component.
export default function FilterThreads() {
    // console.clear();

    const DEFAULT_COLLECTION = COLLECTIONS[0];

    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [collection, setCollection] = useState(undefined);
    const [currentThreadIndex, setCurrentThreadIndex] = useState(0);
    const thread = threads[currentThreadIndex];

    // Gets the threads from the database
    useEffect(() => {

        if (collection) fetchThreads(collection, setThreads, setLoading);
        else {
            // reset threads
            setThreads([]);
        }
    }, [collection]);


    const incrementThreadIndex = () => {
        if (currentThreadIndex < threads.length - 1) {
            setCurrentThreadIndex(currentThreadIndex + 1);
        }
    }

    const decrementThreadIndex = () => {
        if (currentThreadIndex > 0) {
            setCurrentThreadIndex(currentThreadIndex - 1);
        }
    }

    const updateThread = async (thread_id, validity) => {
        console.log("Clicked for thread : ", thread_id, "  new validity : ", validity);
        setThreads(threads.map(thread => {
            if (thread._id === thread_id) {
                thread.isValid = validity;
            }
            return thread;
        }));
        await update_thread_validity(DEFAULT_COLLECTION.name, thread_id, validity);
    }

    const updateMessage = async (thread_id, message_text, validity) => {
        console.log("Clicked for thread : ", thread_id, " message text: ",
            message_text, "  new validity : ", validity);
        setThreads(threads.map(thread => {
            if (thread._id === thread_id) {
                thread.messages.map(message => {
                    if (message.text === message_text) {
                        message.isValid = validity;
                    }
                    return message;
                });
            }
            return thread;
        }));
        await update_message_validity(DEFAULT_COLLECTION.name, thread_id, validity, message_text);
    }

    const IOSSwitch = styled((props) => (
        <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
    ))(({ theme }) => ({
        width: 42,
        height: 26,
        padding: 0,
        '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
                transform: 'translateX(16px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
                    opacity: 1,
                    border: 0,
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                    opacity: 0.5,
                },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
                color: '#33cf4d',
                border: '6px solid #fff',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
                color:
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[600],
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
            },
        },
        '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 22,
            height: 22,
        },
        '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
            opacity: 1,
            transition: theme.transitions.create(['background-color'], {
                duration: 500,
            }),
        },
    }));

    const handleCollectionChange = (event) => {
        console.log("Collection changed to : ", event.target.value);
        setCollection(COLLECTIONS.find(collection => collection.code === event.target.value));
        setThreads([]);
        setCurrentThreadIndex(0);
    }


    return (
        <div className='filter-threads-container'>
            <InputLabel id="demo-simple-select-helper-label">Filter Collection</InputLabel>
            <Select
                variant='outlined'
                className='collection-select'
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                onChange={handleCollectionChange}
                value={collection ? collection.code : ''}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {COLLECTIONS.map((collection, index) => (
                    <MenuItem key={index} value={collection.code}>{collection.code}</MenuItem>
                ))}
            </Select>
            <FormHelperText>{threads && threads.length > 0 && `Showing ${currentThreadIndex + 1} of ${threads.length} threads`}</FormHelperText>


            <Paper elevation={2} className='thread-container paper'>
                {loading ? <div className='loader'></div> : thread && (
                    <>
                        <div className='thread-header'>
                            <div className='thread-header-buttons'>
                                <IOSSwitch
                                    className='thread-switch'
                                    checked={thread.isValid}
                                    onChange={(event) => updateThread(thread._id, event.target.checked)}
                                />
                            </div>
                            <span>{thread.title}</span>
                        </div>
                        <div className='thread-messages'>
                            {thread.messages.map((message, index) => (
                                <Card elevation={2} className='message-container card' key={index}>
                                    <div className='message-header'>
                                        <IOSSwitch
                                            className='message-switch'
                                            checked={message.isValid}
                                            onChange={(event) => updateMessage(thread._id, message.text, event.target.checked)}
                                        />
                                        <span className='emoji'>{getEmoji(message.sender)}</span>
                                    </div>
                                    <div className='message-text no-select'>

                                        <span>{message.text}</span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </>
                )}
            </Paper>
            {collection && !loading && <div className='footer'>
                <Button variant='contained' className='fixed-button' onClick={decrementThreadIndex}>Previous</Button>
                <Button variant='contained' className='fixed-button' onClick={incrementThreadIndex}>Next</Button>
            </div>}
        </div>
    );
}