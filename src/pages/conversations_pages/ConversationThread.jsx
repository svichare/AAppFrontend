import React, { useRef } from 'react';
import { Card, CardContent, Typography, Paper } from '@mui/material';
import './ConversationThread.css';
import { IconButton } from '@mui/material';
import { DownloadRounded } from '@mui/icons-material';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import logo from '../../assets/logo/always_around_me.png';

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

    const threadRef = useRef(null);

    const handleShare = async () => {
        if (threadRef.current) {
            const logoImg = document.createElement('img');
            logoImg.src = logo;
            threadRef.current.prepend(logoImg); // prepend to add the logo at the top

            domtoimage.toBlob(threadRef.current)
                .then(blob => {
                    saveAs(blob, `${thread.title}.png`);
                })
                .catch(error => {
                    console.error('Error converting thread to image:', error);
                })
                .finally(() => {
                    threadRef.current.removeChild(logoImg);
                });
        }

        console.log("⬇️ Download", thread.title);
    };



    const isMobile = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    return (
        <>
            <Paper elevation={5} className='thread gradient-paper' ref={threadRef}>
                <div className='title-container'>
                    <Typography variant='h5' className='thread-title'>{thread.title}</Typography>
                    {isMobile ? (<IconButton onClick={handleShare}>
                        <DownloadRounded />
                    </IconButton>) : null}
                </div>
                {thread.messages.map((message, index) => (
                    <React.Fragment key={index}><ChatMessage key={index} {...message} /><br /></React.Fragment>
                ))}
            </Paper>
        </>
    )
};

export default ConversationThread;