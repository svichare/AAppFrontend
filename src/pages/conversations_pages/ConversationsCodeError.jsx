import React from "react"
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from '@mui/material';
import './ConversationsCodeError.css';
import { IconButton } from "@mui/material";
import FileCopyIcon from '@mui/icons-material/FileCopy';




const ConversationsCodeError = () => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate(`/`);
    }

    // composes a new email to onboard.icu@gmail.com
    const sendEmail = () => {
        window.location.href = "mailto:onboard.icu@gmail.com?subject=Request for Access&body=I would like to request access to the conversations feature. Please send me the group code.";
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText('onboard.icu@gmail.com');
    }

    return (
        <Box className="error-page-box">
            <Typography className="error-page-emoji" variant="h2" gutterBottom>
                <div >🙈 Oops!</div>
                group not found
            </Typography>
            <Typography variant="h6" gutterBottom>
                <div className="error-page-emoji spacer">
                    get the group code from onboard.icu@gmail.com
                    <IconButton onClick={copyToClipboard}>
                        <FileCopyIcon />
                    </IconButton>
                </div>
            </Typography>
            <Box>
                <div><Button className="spacer" onClick={sendEmail} variant="contained" color="primary" size="large" href="/home">
                    <span className="button ">✉️ Email</span>
                    {/* <button className="button" type="button">✉️ Email</button> */}
                </Button></div>
                <Button onClick={goHome} variant="contained" color="primary" size="large">
                    <span className="button">🔙 Home</span>
                </Button>
            </Box>
        </Box>
    )
}

export default ConversationsCodeError;