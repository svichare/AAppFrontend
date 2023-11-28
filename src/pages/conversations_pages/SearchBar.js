import React from 'react';
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { KeyboardReturnRounded, Clear, FileCopyRounded } from '@mui/icons-material';

const SearchBar = ({
    searchTerm,
    setSearchTerm,
    setSearchTermDebounced,
    handleKeyPress,
    copyToClipboard,
    clearSearchTerm,
    displayedThreadCount,
}) => {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <p style={{ marginLeft: '10px' }}>Search Results: {searchTerm.length >= 2 ? displayedThreadCount : 0}</p>
                <Button className="square-button" onClick={copyToClipboard}>
                    <FileCopyRounded />
                </Button>
            </div>

            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    className='search__input'
                    variant="outlined"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyPress}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => {
                                    setSearchTermDebounced(searchTerm);
                                    document.activeElement.blur();
                                }}>
                                    <KeyboardReturnRounded />
                                </IconButton>
                                <IconButton onClick={clearSearchTerm}>
                                    <Clear />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </div>

        </div>
    );
};


export default SearchBar;
