import React, { useEffect, useState } from 'react';
import './WordCloud.css';
import { LinearProgress } from '@mui/material';
import ReactWordcloud from 'react-wordcloud';

const WordCloud = ({ words, handleWordClick }) => {
    const [wordMap, setWordMap] = useState(null);

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

    const processWords = async () => {
        try {
            if (words.length > 0) {
                const extractedWords = generateWordCloud(words);
                setWordMap(extractedWords);
            } else {
                setWordMap([]);
            }
        } catch (error) {
            console.error('Error fetching threads: ', error);
        }
    };

    useEffect(() => {
        processWords();
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
