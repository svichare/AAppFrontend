import React, { useRef, useState } from 'react';
import { Card, CardContent, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, IconButton } from '@mui/material';
import './ConversationThread.css';
import { DownloadRounded } from '@mui/icons-material';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import logo from '../../assets/logo/always_around_me.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

    const [isExpanded, setIsExpanded] = useState(false);

    const handleAccordionChange = (event, newIsExpanded) => {
        setIsExpanded(newIsExpanded);
    };

    return (
        <>
            <Accordion elevation={5} className='thread gradient-paper' onChange={handleAccordionChange}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                <div className='title-container'>
                        <Typography variant='h6' className='thread-title'>{thread.title}</Typography>
                        {isExpanded ? (
                            <IconButton onClick={handleShare}>
                                <DownloadRounded />
                            </IconButton>
                        ) : null}
                </div>
                </AccordionSummary>
                <AccordionDetails className='accordion_details' ref={threadRef}>
                {thread.messages.map((message, index) => (
                    <React.Fragment key={index}><ChatMessage key={index} {...message} /><br /></React.Fragment>
                ))}
                </AccordionDetails>
            </Accordion>
        </>
    )
};

export default ConversationThread;