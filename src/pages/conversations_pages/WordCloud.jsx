import React, { useEffect, useState } from 'react';
import './WordCloud.css';
import { LinearProgress } from '@mui/material';
import { removeStopwords, eng, mar } from 'stopword';
import ReactWordcloud from 'react-wordcloud';
import { GENERIC_STOP_WORDS, MARATHI_STOP_WORDS, CUSTOM_STOP_WORDS } from './Words';

const WordCloud = ({ threads, handleWordClick }) => {
    const [wordMap, setWordMap] = useState(null);
    const MINIMUM_WORD_LENGTH = 3;

    const wordCloudOptions = {
        rotations: 1,
        rotationAngles: [0, 0],
        fontFamily: 'Sansation',
        fontSizes: [20, 150],
        fontWeight: 500,
        padding: 5,
        spiral: 'archimedean',
        transitionDuration: 1000,
        deterministic: true,
        enableTooltip: false,
        enableOptimizations: true,
        randomSeed: 420,
    };

    const processWords = (threads, minimumWordLength) => {
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

    const generateWordCloud = (cloudWords) => {
        const wordCloudMap = new Map();
        cloudWords.forEach((word) => {
            if (wordCloudMap.has(word)) {
                wordCloudMap.set(word, wordCloudMap.get(word) + 1);
            } else {
                wordCloudMap.set(word, 1);
            }
        });

        const wordCloudArray = Array.from(wordCloudMap).map(([text, value]) => ({
            text,
            value,
        }));

        wordCloudArray.sort((a, b) => b.value - a.value);
        const topWords = wordCloudArray.slice(0, 200);

        return topWords;
    };

    const processThreads = async () => {
        try {
            if (threads.length > 0) {
                const cloudWords = processWords(threads, MINIMUM_WORD_LENGTH);
                const extractedWords = generateWordCloud(cloudWords);
                setWordMap(extractedWords);
            } else {
                setWordMap([]);
            }
        } catch (error) {
            console.error('Error fetching threads: ', error);
        }
    };

    useEffect(() => {
        processThreads();
    }, []);

    const renderWordCloud = () => {
        if (!wordMap) {
            return <LinearProgress />;
        }

        return (
            <>

            <ReactWordcloud
                    words={wordMap}
                options={wordCloudOptions}
                callbacks={{
                    onWordClick: handleWordClick,
                }}
                />
            </>
        );
    };

    return (
        <div className="word-cloud-container">
            <div className="word-cloud">{renderWordCloud()}</div>
        </div>
    );
};

export default WordCloud;
