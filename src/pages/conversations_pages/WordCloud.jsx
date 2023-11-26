import React, { useEffect, useState } from 'react';
import './WordCloud.css';
import { LinearProgress } from '@mui/material';
import { removeStopwords, eng, mar } from 'stopword';
import ReactWordcloud from 'react-wordcloud';
import { useNavigate } from 'react-router-dom';

const WordCloud = ({ threads, handleWordClick }) => {
    const [words, setWords] = useState(null);
    const navigate = useNavigate();

    const wordCloudOptions = {
        rotations: 1,
        rotationAngles: [0, 0],
        fontFamily: 'Sansation',
        fontSizes: [10, 100],
        fontWeight: 700,
        padding: 5,
        spiral: 'archimedean',
        transitionDuration: 1000,
        deterministic: true,
        enableTooltip: false,
        enableOptimizations: true,
        randomSeed: 42,
    };

    const processWordCloud = (threads) => {
        const customStopWords = ['omitted', 'media', 'video']; // Custom stop words

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
            [...eng, ...mar, ...customStopWords]
        );
        cloudWords = cloudWords.filter((word) => word.length > 4 && word.length < 15);

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
        const topWords = wordCloudArray.slice(0, 50);

        return topWords;
    };

    const processThreads = async () => {
        try {
            if (threads.length > 0) {
                const extractedWords = processWordCloud(threads);
                setWords(extractedWords);
            } else {
                setWords([]);
            }
        } catch (error) {
            console.error('Error fetching threads: ', error);
        }
    };

    useEffect(() => {
        processThreads();
    }, []);

    const renderWordCloud = () => {
        if (!words) {
            return <LinearProgress />;
        }

        return (
            <ReactWordcloud
                words={words}
                options={wordCloudOptions}
                callbacks={{
                    onWordClick: handleWordClick,
                }}
            />
        );
    };

    return (
        <div className="word-cloud-container">
            <div className="word-cloud">{renderWordCloud()}</div>
        </div>
    );
};

export default WordCloud;
