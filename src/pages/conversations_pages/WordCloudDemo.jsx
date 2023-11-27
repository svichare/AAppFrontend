import React, { useEffect, useState } from 'react';
import { getThreads } from '../../graphql/queries';
import { LinearProgress } from '@mui/material';
import { API } from 'aws-amplify';
import WordCloud from './WordCloud';
import { useNavigate } from 'react-router-dom';


const WordCloudDemo = () => {
    const collection = { code: 'spr', name: 'thread_details_s_p_r' };
    const [threads, setThreads] = useState(null);
    const navigate = useNavigate();

    // IndexedDB setup
    const openDB = async () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("threadsDB", 1);

            request.onerror = (event) => {
                console.error("Error opening IndexedDB", event);
                reject(event);
            };

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                db.createObjectStore("threads");
            };
        });
    };

    const fetchThreads = async (forceRefresh = false, cacheExpiry = 60 * 60 * 1000) => {
        try {
            const db = await openDB();
            const transaction = db.transaction(["threads"], "readonly");
            const store = transaction.objectStore("threads");
            const getThreadsRequest = store.get("threads");

            getThreadsRequest.onsuccess = async (event) => {
                let threads = event.target.result;
                let cacheTimestamp = Date.now();

                if (threads) {
                    cacheTimestamp = threads.cacheTimestamp;
                    threads = threads.data;
                }

                if (forceRefresh || !threads || Date.now() - cacheTimestamp > cacheExpiry) {
                    const response = await API.graphql({
                        query: getThreads,
                        variables: {
                            collection_name: collection.name,
                            key: undefined,
                            value: undefined,
                        },
                    });

                    threads = response.data.getThreads;
                    console.log('threads: ', threads);

                    const writeTransaction = db.transaction(["threads"], "readwrite");
                    const writeStore = writeTransaction.objectStore("threads");
                    writeStore.put({ data: threads, cacheTimestamp: Date.now() }, "threads");
                }

                setThreads(threads);
            };
        } catch (error) {
            console.error('Error fetching threads: ', error);
        }
    };


    useEffect(() => {
        fetchThreads();
    }, []);

    const handleWordClick = (word) => {
        console.log('Word clicked: ', word);
        navigate(`/KnowledgeBase/${collection.code}/search/${word.text}`);
    }



    return (
        <div className="word-cloud-container">
            <div className="word-cloud">
                {threads ? <WordCloud threads={threads} handleWordClick={handleWordClick} /> : <LinearProgress />}
            </div>
        </div>
    );
};

export default WordCloudDemo;
