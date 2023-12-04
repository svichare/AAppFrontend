import React, { useState } from 'react';
import { LinearProgress, ButtonGroup, Button } from '@mui/material';
import WordCloud from './WordCloud';
import { useNavigate } from 'react-router-dom';
import { removeStopwords, eng, mar } from 'stopword';
import { GENERIC_STOP_WORDS, MARATHI_STOP_WORDS, CUSTOM_STOP_WORDS, POLITICS, RELIGION, CONVERSATION_TOPICS } from './Words';
import useThreads from './UseThreads';


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

    // Filters words based on the word cloud
    switch (wordCloud) {
        case 'generic_topics':
            processedWords = filterAllowedWords(processedWords, CONVERSATION_TOPICS);
            break;
        case 'religion':
            processedWords = filterAllowedWords(processedWords, RELIGION);
            break;
        case 'politics':
            processedWords = filterAllowedWords(processedWords, POLITICS);
            break;
        case 'topics':
        case 'sub_topics':
            const [topics, subTopics] = extractTopics(threads);
            processedWords = wordCloud === 'topics' ? topics : subTopics;
            break;
        default:
            break;
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
                    <Button onClick={() => setWordCloud('all')}>All Words</Button>
                    <Button onClick={() => setWordCloud('generic_topics')}>Conversation Topics</Button>
                    <Button onClick={() => setWordCloud('religion')}>Religion</Button>
                    <Button onClick={() => setWordCloud('politics')}>Politics</Button>
                    <Button onClick={() => setWordCloud('topics')}>Topics</Button>
                    <Button onClick={() => setWordCloud('sub_topics')}>Sub Topics</Button>
                </ButtonGroup>

                <WordCloud words={processedWords} handleWordClick={handleWordClick} />
            </div>
        </div>
    );
};

export default WordCloudDemo;
