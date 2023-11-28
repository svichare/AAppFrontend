// useEmoji.js
import { useState } from 'react';

const useEmoji = (emojis) => {
    const [selectedEmojis, setSelectedEmojis] = useState(emojis);

    const hashString = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash += str.charCodeAt(i);
        }
        return hash;
    };

    const getEmoji = (name) => {
        const hash = hashString(name);
        const index = hash % selectedEmojis.length;
        return selectedEmojis[index];
    };

    return { getEmoji };
};

export default useEmoji;
