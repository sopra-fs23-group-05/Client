import React from 'react';
import QRCode from "react-qr-code";
import {useHistory} from 'react-router-dom';
import 'styles/views/Invite.scss';
import {Container, Button, Typography, Box} from "@mui/material";




const Invite = props => {
    const history = useHistory();
    const accessCode = localStorage.getItem('lobbyAccessCode');

    const doBack = () => {
        history.push(`/lobbies/${accessCode}`)
        window.location.reload();
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`https://sopra-fs23-group-05-client.oa.r.appspot.com/user-login/${accessCode}`);
      };

  return (
    <div className="inviteRoot" style={{ overflowY: 'scroll' }}>
    
    <h1 style={{ color: 'white', fontFamily: 'Inter, sans-serif', fontWeight: '600', fontSize: '40px', marginTop: '100px'}}>Invite To Lobby</h1>
    <h1 style={{ color: 'white', fontFamily: 'Inter, sans-serif', fontWeight: '600', fontSize: '30px', marginTop: '-100px', marginBottom: '20px' }}>Access Code: {accessCode}</h1>
    <Container sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <Box className="qrCodeBox" sx={{marginTop: '-120px'}}>
        <Typography variant="h6" sx={{color: 'black', mb: 1, fontFamily: 'Inter, sans-serif', fontWeight: '600', fontSize: '24px', textAlign: 'center'}}>Send this invite link to your friends</Typography>
        <Button
            variant="contained"
            className="saveButton"
            onClick={copyToClipboard}
            >
            Copy Invite Link
        </Button>
        <Typography variant="h6" sx={{color: 'black', mb: 1, fontFamily: 'Inter, sans-serif', fontWeight: '600', fontSize: '24px'}}>
            <hr style={{borderTop: '1px solid black', width: '150px', marginTop: '30px'}} /> 
        </Typography>
        <Typography variant="h6" sx={{color: 'black', mb: 1, fontFamily: 'Inter, sans-serif', fontWeight: '600', fontSize: '24px'}}>Scan QR Code to join</Typography>

        <div style={{ height: "auto", margin: "0 auto", maxWidth: 200, width: "100%" }}>
            <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={`https://sopra-fs23-group-05-client.oa.r.appspot.com/user-login/${accessCode}`}
            viewBox={`0 0 256 256`}
            />
        </div>

        </Box>
            </Container>
            <Button variant="contained" className="backButton"            
                onClick={() => doBack()}
                >
                Back
            </Button>
    </div>
  );
};

export default Invite;