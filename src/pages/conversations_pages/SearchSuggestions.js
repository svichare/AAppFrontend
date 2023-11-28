import React from 'react';
import { Chip } from '@mui/material';

const SearchSuggestions = ({ suggestions, handleSuggestionSearch }) => {
    return (
        <div className='search-suggestions'>
            {suggestions.map((suggestion, index) => (
                <Chip
                    className='chip'
                    key={index}
                    label={
                        <>
                            <span role="img" aria-label="magnifying glass">🔍</span>
                            <span className="suggestion-text">{suggestion}</span>
                        </>
                    }
                    onClick={() => handleSuggestionSearch(suggestion)}
                />
            ))}
        </div>
    );
}

export default SearchSuggestions;
