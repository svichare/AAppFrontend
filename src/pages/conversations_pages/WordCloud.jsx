import React from 'react';
import './WordCloud.css';
import ReactWordcloud from 'react-wordcloud';

const WordCloud = ({ words, handleWordClick }) => {

    //  Configures the Word cloud 
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

    // Converts an array of words into a word cloud data structure
    const generateWordCloudData = (words) => {
        const wordCloudMap = new Map();
        words.forEach((word) => { wordCloudMap.set(word, (wordCloudMap.get(word) || 0) + 1); });
        const wordCloudData = [...wordCloudMap].map(([text, value]) => ({ text, value })).sort((a, b) => b.value - a.value);
        return wordCloudData.slice(0, 200);
    };

    // Generates word cloud data
    const wordCloudData = words.length > 0 ? generateWordCloudData(words) : null;

    // Renders the word cloud
    return (
        <div className="word-cloud-container">
            <ReactWordcloud
                className="word-cloud"
                words={wordCloudData}
                options={wordCloudOptions}
                callbacks={{
                    onWordClick: handleWordClick,
                }}
            />
        </div>
    );
};

export default WordCloud;
