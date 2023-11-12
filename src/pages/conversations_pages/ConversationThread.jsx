import React from 'react';
import { Card, CardContent, Typography, CardActions, Paper } from '@mui/material';
import { css } from '@emotion/react';
import './ConversationThread.css';

const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '👦', '👧', '👨', '👩', '👴', '👵'];

const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash += str.charCodeAt(i);
    }
    return hash;
};

const getEmoji = (name) => {
    const hash = hashString(name);
    const index = hash % emojis.length;
    return emojis[index];
};

const ChatMessage = ({ text, sender, messageType }) => {
    return (
        <Card className='message-card gradient-card'>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {`${getEmoji(sender)}  ${sender}`}
                </Typography>
                <Typography
                    variant="body1"
                    component="div"
                    className='message-text'
                    css={css`
                    text-align: ${messageType === 'question' ? 'left' : 'right'};
                    `}>
                    {text}
                </Typography>
            </CardContent>
            <CardActions>
                {/* Add any actions here */}
            </CardActions>
        </Card>
    );
};

const ConversationThread = ({ thread }) => (
    <>
        <Paper elevation={5} className='thread gradient-paper' >
            <br />
            <Typography variant='h5' className='thread-title'>{thread.title}</Typography>
            <br />
            {thread.messages.map((message, index) => (
                <React.Fragment key={index}><ChatMessage key={index} {...message} /><br /></React.Fragment>
            ))}
        </Paper>
    </>
);

export default ConversationThread;