import React, { useState } from 'react';
import { LinearProgress, ButtonGroup, Button } from '@mui/material';
import WordCloud from './WordCloud';
import { useNavigate } from 'react-router-dom';
import { removeStopwords, eng, mar } from 'stopword';
import { GENERIC_STOP_WORDS, MARATHI_STOP_WORDS, CUSTOM_STOP_WORDS, POLITICS, RELIGION, CONVERSATION_TOPICS } from './Words';
import useThreads from '../../hooks/useThreads';


const WordCloudDemo = () => {
    const collection = { code: 'spr', name: 'thread_details_s_p_r' };
    const MINIMUM_WORD_LENGTH = 3;
    const navigate = useNavigate();
    const [wordCloud, setWordCloud] = useState('all'); // ['all', 'generic_topics', 'religion', 'politics']

    // Fetches threads from the database
    const { threads, isLoading, isError } = useThreads(collection.code);

    // Handles errors and loading
    if (isError) return <div>failed to load</div>
    if (isLoading) return <LinearProgress />

    // Converts threads into an array of words
    const processThreads = (threads) => {
        if (threads.length === 0) { return [] }
        const stopwords = [...eng, ...mar, ...GENERIC_STOP_WORDS, ...MARATHI_STOP_WORDS, ...CUSTOM_STOP_WORDS];
        return threads.flatMap(thread => thread.messages.flatMap(message => message.text.toLowerCase().split(/\s+/)))
            .map(word => word.replace(/\W/g, ''))
            .filter(word => word.length >= MINIMUM_WORD_LENGTH && word.length < 15 && removeStopwords([word], stopwords).length > 0);
    };

    // Extracts topics and subtopics from threads
    const extractTopics = (threads) => {
        let threadTopics = []
        let threadSubTopics = []
        threads.forEach((thread) => {
            threadTopics.push(thread.topic);
            threadSubTopics.push(thread.subtopic);
        }
        );
        return [threadTopics, threadSubTopics]
    }

    // Filters words based on the allowed words
    const filterAllowedWords = (words, allowedWords) => allowedWords ? words.filter(word => allowedWords.includes(word)) : words;

    // Processes threads into an array of words
    let processedWords = threads ? processThreads(threads) : null;

    const wordCloudDemoConfig = {
        'all': { label: 'All Words', filter: null },
        'generic_topics': { label: 'Conversation Topics', filter: CONVERSATION_TOPICS },
        'religion': { label: 'Religion', filter: RELIGION },
        'politics': { label: 'Politics', filter: POLITICS },
        'topics': { label: 'Topics', filter: (threads) => extractTopics(threads)[0] },
        'sub_topics': { label: 'Sub Topics', filter: (threads) => extractTopics(threads)[1] }
    }

    // Filters words based on the word cloud
    if (wordCloudDemoConfig[wordCloud]?.filter) {
        processedWords = Array.isArray(wordCloudDemoConfig[wordCloud].filter) ?
            filterAllowedWords(processedWords, wordCloudDemoConfig[wordCloud].filter) :
            wordCloudDemoConfig[wordCloud].filter(threads);
    }

    // Handles word click
    const handleWordClick = (word) => {
        console.log('Word clicked: ', word);
        navigate(`/KnowledgeBase/${collection.code}/search/${word.text}`);
    }

    // Renders the word cloud
    return (
        <div className="word-cloud-container">
            <div className="word-cloud">
                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    {Object.keys(wordCloudDemoConfig).map(key => (
                        <Button
                            key={key}
                            disabled={key === wordCloud}
                            onClick={() => setWordCloud(key)}
                        >
                            {wordCloudDemoConfig[key].label}
                        </Button>
                    ))}
                </ButtonGroup>

                <WordCloud words={processedWords} handleWordClick={handleWordClick} />
            </div>
        </div>
    );
}

export default WordCloudDemo;
