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

    const fetchThreads = async () => {
        try {
            const response = await API.graphql({
                query: getThreads,
                variables: {
                    collection_name: collection.name,
                    key: undefined,
                    value: undefined,
                },
            });

            const threads = response.data.getThreads;
            console.log('threads: ', threads);
            setThreads(threads);
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
