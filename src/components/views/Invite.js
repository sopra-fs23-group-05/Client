import React, {useEffect, useRef} from 'react';
import QRCode from "react-qr-code";
import {useHistory} from 'react-router-dom';
import 'styles/views/Invite.scss';
import Button_Click from "./sounds/Button_Click.mp3";
import {Box, Button, Container, Typography} from "@mui/material";
import {getClientDomain, getWebSocketDomain} from "../../helpers/getDomain";
import Start_Sound from "./sounds/Start_Sound.mp3";


const Invite = () => {
    const history = useHistory();
    const accessCode = localStorage.getItem('lobbyAccessCode');
    const pageWebSocket = useRef(null);

    const doBack = () => {
        playSound(Button_Click);
        history.push(`/lobbies/${accessCode}`)
    }

    const playSound = (soundFile) => {
        const audio = new Audio(soundFile);
        audio.play();
    };

    const copyToClipboard = () => {
        playSound(Button_Click);
        navigator.clipboard.writeText(`${getClientDomain()}/user-login/${accessCode}`);
    };

    // Page WebSocket code
    useEffect(() => {
        pageWebSocket.current = new WebSocket(getWebSocketDomain() + '/pages/' + accessCode);
        const openWebSocket = () => {
            pageWebSocket.current.onopen = (event) => {
                console.log('Open Page WebSocket:', event);
            }
            pageWebSocket.current.onclose = (event) => {
                console.log('Close Page WebSocket:', event);
            }
        }
        openWebSocket();
        return () => {
            pageWebSocket.current.close();
        }
    }, []);

    // Page WebSocket code
    useEffect(() => {
        pageWebSocket.current.onmessage = (event) => {
            const IncomingMessage = JSON.parse(event.data);
            console.log('Received Page Message:', IncomingMessage);
            playSound(Start_Sound);
            history.push(IncomingMessage.url);
        }
    }, [history]);

    return (
        <div className="inviteRoot" style={{overflowY: 'scroll'}}>

            <h1 className="title" style={{marginTop: '-50px'}}>Invite To Lobby</h1>
            <h1 className="title" style={{fontSize: '30px', marginTop: '-100px'}}>Access Code: {accessCode}</h1>
            <Container className="flex-container">
                <Box className="qrCodeBox" sx={{marginTop: '-110px'}}>
                    <Typography variant="h6" className="qr-typography">Send this invite link to your
                        friends</Typography>
                    <Button
                        variant="contained"
                        className="saveButton"
                        onClick={copyToClipboard}
                    >
                        Copy Invite Link
                    </Button>
                    <Typography variant="h6" className="qr-typography">
                        <hr style={{borderTop: '1px solid black', width: '150px', marginTop: '30px'}}/>
                    </Typography>
                    <Typography variant="h6" className="qr-typography">Scan QR Code to join</Typography>

                    <div style={{height: "auto", margin: "0 auto", maxWidth: 200, width: "100%"}}>
                        <QRCode
                            size={256}
                            style={{height: "auto", maxWidth: "100%", width: "100%"}}
                            value={`https://sopra-fs23-group-05-client.oa.r.appspot.com/user-login/${accessCode}`}
                            viewBox={`0 0 256 256`}
                        />
                    </div>

                </Box>
            </Container>
            <Button variant="contained"
                    className="backButton"
                    style={{marginTop: '-60px'}}
                    onClick={() => doBack()}
            >
                Back
            </Button>
        </div>
    );
};

export default Invite;