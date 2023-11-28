import React from 'react';
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { KeyboardReturnRounded, Clear, FileCopyRounded } from '@mui/icons-material';

const SearchBar = ({
    setSearchTermDebounced,
    copyToClipboard,
    clearSearchTerm,
    displayedThreadCount,
    textFieldRef
}) => {


    // Handles Key Press for Enter Key in Search Bar
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            setSearchTermDebounced(textFieldRef.current.value);
            event.target.blur();
        }
    }

    console.log(textFieldRef?.current?.value)

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <p style={{ marginLeft: '10px' }}>Search Results: {textFieldRef?.current?.value < 2 ? 0 : displayedThreadCount}</p>
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
                    // value={searchTerm}
                    inputRef={textFieldRef}
                    onKeyDown={handleKeyPress}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => {
                                    setSearchTermDebounced(textFieldRef.current.value);
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
