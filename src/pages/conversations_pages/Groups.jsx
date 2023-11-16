import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { WhatsApp, Telegram } from '@mui/icons-material';

import './Groups.css'
import {
    DEFAULT_COLLECTION,
    ALL_THREADS_FIELDNAME,
    ALL_THREADS_THREADNAME,
    LOGGING,
    SUGGESTIONS,
    COLLECTIONS
} from './ConversationSettings';

const Groups = () => {
    const navigate = useNavigate();


    //    navigate(`/Conversations/${collection.code}/search/${debouncedSearchTerm}`);

    // Creates styled MUI button with margin
    const StyledButton = ({ children, ...props }) => (
        <Button
            color="primary"
            size="large"
            variant="contained"
            sx={{ margin: '10px' }}
            {...props}
        >
            {children}
        </Button>
    );

    const navigateToWhatsapp = () => {
        navigate(`/Conversations/${COLLECTIONS[1].code}/search`);
    }

    const navigateToTelegram = () => {
        navigate(`/Conversations/${COLLECTIONS[0].code}/search`);
    }


    return (
        <div className="container">
            <h2>Conversation Threads</h2>

            <StyledButton startIcon={<WhatsApp />} onClick={navigateToWhatsapp}> WhatsApp </StyledButton>
            <StyledButton startIcon={<Telegram />} onClick={navigateToTelegram}> Telegram </StyledButton>



        </div>
    );
};

export default Groups;