import React, { useEffect, useState } from 'react';
import { getThreads } from '../../graphql/queries';
import { LinearProgress } from '@mui/material';
import { API } from 'aws-amplify';
import WordCloud from './WordCloud';
import { useNavigate } from 'react-router-dom';
import { removeStopwords, eng, mar } from 'stopword';
import { GENERIC_STOP_WORDS, MARATHI_STOP_WORDS, CUSTOM_STOP_WORDS, POLITICS, RELIGION, CONVERSATION_TOPICS } from './Words';


const WordCloudDemo = () => {
    const collection = { code: 'spr', name: 'thread_details_s_p_r' };
    const [words, setWords] = useState(null);
    const [conversationTopicWords, setConversationTopicWords] = useState(null);
    const [politicalWords, setPoliticalWords] = useState(null);
    const [religionWords, setReligionWords] = useState(null);
    const [topics, setTopics] = useState(null);
    const [subtopics, setSubTopics] = useState(null);

    const MINIMUM_WORD_LENGTH = 3;
    const FILTER_CATEGORIES = 1;


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

            let threads = response.data.getThreads;
            console.log('Fetch using API : threads : ', threads);


            return threads;

        } catch (error) {
            console.error('Error fetching threads: ', error);
        }
    };

    const filterAllowedWords = (words, allowedWords) => {
        if (allowedWords) {
            const filteredWords = words.filter((word) => allowedWords.includes(word));
            return filteredWords;
        } else {
            return words;
        }
    };

    const processThreads = (threads) => {
        try {
            if (threads.length > 0) {
                const processedWords = extractWords(threads, MINIMUM_WORD_LENGTH);
                return processedWords;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error fetching threads: ', error);
        }
    };


    const extractWords = (threads, minimumWordLength) => {
        const getWords = threads.flatMap((thread) =>
            thread.messages.flatMap((message) =>
                message.text.toLowerCase().split(/\s+/)
            )
        );

        let cloudWords = getWords.map((word) => word.replace(/\W/g, ''));
        cloudWords = cloudWords.filter((word) => word !== '');
        cloudWords = cloudWords.filter((word) => isNaN(word));
        cloudWords = removeStopwords(
            cloudWords,
            [...eng, ...mar, ...GENERIC_STOP_WORDS, ...MARATHI_STOP_WORDS, ...CUSTOM_STOP_WORDS]
        );
        cloudWords = cloudWords.filter((word) => word.length >= minimumWordLength && word.length < 15);

        return cloudWords;
    };

    const extractTopics = (threads) => {
        let threadTopics = []
        let threadSubTopics = []

        threads.forEach((thread) => {
            threadTopics.push(thread.topic);
            threadSubTopics.push(thread.subtopic);
        }
        );

        setTopics(threadTopics);
        setSubTopics(threadSubTopics);
    }

    const fetchThreadsAndProcessWords = async () => {
        const threads = await fetchThreads();

        extractTopics(threads);

        const processedWords = threads ? processThreads(threads) : [];

        const conversationTopicWords = filterAllowedWords(processedWords, CONVERSATION_TOPICS);
        const politicalWords = filterAllowedWords(processedWords, POLITICS);
        const religionWords = filterAllowedWords(processedWords, RELIGION);

        setWords(processedWords);
        setPoliticalWords(politicalWords);
        setReligionWords(religionWords);
        setConversationTopicWords(conversationTopicWords);
    }


    useEffect(() => { fetchThreadsAndProcessWords(); }, []);

    const handleWordClick = (word) => {
        console.log('Word clicked: ', word);
        navigate(`/KnowledgeBase/${collection.code}/search/${word.text}`);
    }



    return (
        <div className="word-cloud-container">
            <div className="word-cloud">
                <h1>All Words</h1>
                {words ? <WordCloud words={words} handleWordClick={handleWordClick} /> : <LinearProgress />}

                <h1>Conversation Topics</h1>
                {conversationTopicWords ? <WordCloud words={conversationTopicWords} handleWordClick={handleWordClick} /> : <LinearProgress />}

                <h1>Political Words</h1>
                {politicalWords ? <WordCloud words={politicalWords} handleWordClick={handleWordClick} /> : <LinearProgress />}

                <h1>Religion Words</h1>
                {religionWords ? <WordCloud words={religionWords} handleWordClick={handleWordClick} /> : <LinearProgress />}

                <h1>Topics</h1>
                {topics ? <WordCloud words={topics} handleWordClick={handleWordClick} /> : <LinearProgress />}

                <h1>Sub Topics</h1>
                {subtopics ? <WordCloud words={subtopics} handleWordClick={handleWordClick} /> : <LinearProgress />}
            </div>
        </div>
    );
};

export default WordCloudDemo;
