import React from 'react';
import { Card, CardContent, Typography, Paper } from '@mui/material';
import './ConversationThread.css';
import { IconButton } from '@mui/material';
import { FileCopyRounded } from '@mui/icons-material';

const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'];

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
            <CardContent className='card-content'>
                <Typography
                    variant="body1"
                    component="div"
                    className='message-text'>
                    <span style={{ fontSize: '1.5em' }}>{getEmoji(sender)}</span>  {text}
                </Typography>
            </CardContent>
        </Card>
    );
};

const ConversationThread = ({ thread }) => {
    const handleCopy = () => {
        const messagesToCopy = thread.messages.map(({ sender, text }) => `*${sender}*: ${text}`);
        const threadToCopy = `\n*${thread.title}*\n\n${messagesToCopy.join('\n\n')}`;

        navigator.clipboard.writeText(threadToCopy);
        console.log("Copy action triggered");
    };

    return (
        <>
            <Paper elevation={5} className='thread gradient-paper' >
                <div className='title-container'>
                    <Typography variant='h5' className='thread-title'>{thread.title}</Typography>
                    <IconButton onClick={handleCopy}>
                        <FileCopyRounded />
                    </IconButton>
                </div>
                {thread.messages.map((message, index) => (
                    <React.Fragment key={index}><ChatMessage key={index} {...message} /><br /></React.Fragment>
                ))}
            </Paper>
        </>
    )
};

export default ConversationThread;