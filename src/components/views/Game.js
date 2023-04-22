import "styles/views/Game.scss";
import {Box, Divider, Button, TextField, ListItem, List, ListItemText, DialogTitle, Dialog, DialogContent, DialogContentText, DialogActions} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import {useEffect, useRef, useState} from "react";
import {ChatMessageClueGiver} from "models/ChatMessageClueGiver";
import User from "../../models/User";

export default function Game(){

    const ENTER_KEY_CODE = 13;

    const scrollBottomRef = useRef(null);
    const webSocket = useRef(null);
    const [chatMessages, setChatMessages] = useState([]);
    // Activate the following line as soon as the actual user is obtained from the backend.
    // const [user, setUser] = useState('');
    const [message, setMessage] = useState('');


    // Websocket code
    useEffect(() => {
        console.log('Opening WebSocket');
        // Activate the following line for deployment.
        webSocket.current = new WebSocket('wss://sopra-fs23-group-05-server.oa.r.appspot.com/chat');
        // Activate the following line for local testing.
        // webSocket.current = new WebSocket('ws://localhost:8080/chat');
        const openWebSocket = () => {
            webSocket.current.onopen = (event) => {
                console.log('Open:', event);
            }
            webSocket.current.onclose = (event) => {
                console.log('Close:', event);
            }
        }
        openWebSocket();
        return () => {
            console.log('Closing WebSocket');
            webSocket.current.close();
        }
    }, []);

    // Websocket code
    useEffect(() => {
        webSocket.current.onmessage = (event) => {
            const ChatMessageDTO = JSON.parse(event.data);
            console.log('Message:', ChatMessageDTO);
            setChatMessages([...chatMessages, {
                user: ChatMessageDTO.user,
                message: ChatMessageDTO.message
            }]);
            if(scrollBottomRef.current) {
                scrollBottomRef.current.scrollIntoView({ behavior: 'smooth'});
            }
        }
    }, [chatMessages]);

    // Websocket code
    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    }

    // Websocket code
    const handleEnterKey = (event) => {
        if(event.keyCode === ENTER_KEY_CODE){
            sendMessage();
        }
    }

    // Websocket code
    const sendMessage = () => {

        // Delete this line as soon as the actual user is obtained from the backend.
        const user = new User({username: "felix"});

        if(user && message) {
            console.log('Send!');
            webSocket.current.send(
                JSON.stringify(new ChatMessageClueGiver(user, message))
            );
            setMessage('');
        }
    };

    const listChatMessages = chatMessages.map((ChatMessageClueGiver, index) =>
        <ListItem key={index}>
            <ListItemText primary={`${ChatMessageClueGiver.user}: ${ChatMessageClueGiver.message}`}/>
        </ListItem>
    );
    
    const [wordDefinition, setWordDefinition] = useState("");
    const [word] = useState("Apple");
    const [open, setOpen] = useState(false);

    return (
    <div className="homePageRoot" style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
      <Box sx={{display: 'flex', flexDirection: 'column', flex: '1'}}>
          <div className="card-and-timer-box">
              <div className="card-box">
                  <div className="side-box">
                        <Button variant="contained" sx={{width: '80%', bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' }, '&:active': { bgcolor: 'darkgreen' } }}
                                onClick={async () => {
                                const response = await fetch(`https://api.datamuse.com/words?sp=${word}&md=d`);
                                const data = await response.json();
                                if (data.length > 0 && data[0].defs) {
                                    setWordDefinition(data[0].defs[0]);
                                } else {
                                    setWordDefinition("No definition found");
                                }
                                setOpen(true);
                                }}>
                        {word}
                        </Button>

                        <Dialog open={open} onClose={() => setOpen(false)}>
                        <DialogTitle>{word}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>{wordDefinition}</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(false)}>Close</Button>
                        </DialogActions>
                        </Dialog>
                      <Button variant="contained" sx={{width: '80%', bgcolor: 'red', '&:hover': { bgcolor: 'darkred' }, '&:active': { bgcolor: 'darkred' } }}>Skip Card</Button>
                  </div>
                  <div className="side-box">
                      <div>Taboo 1</div>
                      <div>Taboo 2</div>
                      <div>Taboo 3</div>
                      <div>Taboo 4</div>
                      <div>Taboo 5</div>
                  </div>
              </div>
                  <div className="timer-box">
                      <div>Timer</div>
                      <div>01:45</div>
                      <Divider sx={{color: 'white', border: '1px solid white', width: '80%', marginBottom: '15px', marginTop: '15px'}} />
                      <div>Score</div>
                      <div>4</div>
                  </div>
          </div>
          <Box
              sx={{display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              width: '100%',
              height: 300,
              backgroundColor: '#D1C4E9',
              borderRadius: '20px',
              border: '1px solid white',
              marginTop: '20px',
              marginBottom: '20px',
              flex: '1',
              position: 'relative',}}>
              <Box sx={{ flex: '1' }}>
                  <List id="chat-window-messages">
                      {listChatMessages}
                      <ListItem ref={scrollBottomRef}></ListItem>
                  </List>
              </Box>
              <Box sx={{
                  display: 'flex',
                  alignSelf: 'flex-end',
                  margin: '5px',
                  width: 'calc(100% - 10px)',
              }}>
                  <TextField className={"textField-chat-input"}
                             onChange={handleMessageChange}
                             onKeyDown={handleEnterKey}
                             label="Type your message..."
                             value={message}
                      variant="outlined"
                      // placeholder="Describe the word"
                      InputProps={{
                          sx: {
                              '& fieldset': {
                                  backgroundColor: '#6600B6', // Set background color only within the borders
                                  opacity: '0.43',
                                  marginRight: '5px', // Add margin between TextField and Button
                              },
                          },
                      }}
                     sx={{
                             flexGrow: '1',
                         }}
                  />
                  <Button
                      onClick={sendMessage}
                      variant="contained"
                      color="primary"
                          sx={{
                              borderRadius: '15px',
                              height: '100%',
                              flexGrow: '0',
                          }}>
                      <SendIcon />
                  </Button>
              </Box>
          </Box>
          <Button variant="contained"
                  className="Buzzer"
          >
              Buzzer
          </Button>
      </Box>
    </div>
  );
}
