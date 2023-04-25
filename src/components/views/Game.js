import "styles/views/Game.scss";
import {Box, Divider, Button, TextField, ListItem, DialogTitle, Dialog, DialogContent, DialogContentText, DialogActions} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import {useEffect, useRef, useState} from "react";
import {ChatMessage} from "models/ChatMessage";
import User from "../../models/User";
import Team from "../../models/Team";
import Card from "../../models/Card";
import {CardRequest} from "../../models/CardRequest";

export default function Game(){

    const ENTER_KEY_CODE = 13;

    const scrollBottomRef = useRef(null);
    const webSocket = useRef(null);
    const cardWebSocket = useRef(null);
    const [chatMessages, setChatMessages] = useState([]);
    // Activate the following line as soon as the actual user is obtained from the backend.
    // const [user, setUser] = useState('');
    const [message, setMessage] = useState('');
    let [displayedCard, setCard] = useState(new Card({word: "Loading...", taboo1: "Loading...", taboo2: "Loading...", taboo3: "Loading...", taboo4: "Loading...", taboo5: "Loading..."}));

    // Get the actual user from the backend.
    const user = new User({username: "felix", id: 666});
    // Get the actual team from the backend.
    const team = new Team({aRole: "clueGiver", players: [user, new User({username: "lukas"}), new User({username: "lisa"}), new User({username: "laura"})], idxClueGiver: 0});

    // In case this client is the clue giver, the message type is "description", otherwise it is "guess".
    const messageType = team.getClueGiver() === user ? "description" : "guess";

    // Websocket code
    useEffect(() => {
        console.log('Opening Chat WebSocket');
        // Activate the following line for deployment.
        webSocket.current = new WebSocket('wss://sopra-fs23-group-05-server.oa.r.appspot.com/chat');
        // Activate the following line for local testing.
        // webSocket.current = new WebSocket('ws://localhost:8080/chat');
        const openWebSocket = () => {
            webSocket.current.onopen = (event) => {
                console.log('Open Chat WebSocket:', event);
            }
            webSocket.current.onclose = (event) => {
                console.log('Close Chat WebSocket:', event);
            }
        }
        openWebSocket();
        return () => {
            console.log('Closing Chat WebSocket');
            webSocket.current.close();
        }
    }, []);

    // Card websocket code
    const sendCardMessage = () => {
        if (cardWebSocket) {
            console.log('Send Card Request!');
            cardWebSocket.current.send(
                // Take the access code from the URL, e.g. http://localhost:3000/game/123456
                JSON.stringify(new CardRequest(window.location.href.slice(-6), "draw"))
            );
        }
    };

    // Card websocket code
    useEffect(() => {
        console.log('Opening Card WebSocket');
        // Activate the following line for deployment.
        cardWebSocket.current = new WebSocket('wss://sopra-fs23-group-05-server.oa.r.appspot.com/cards');
        // Activate the following line for local testing.
        // cardWebSocket.current = new WebSocket('ws://localhost:8080/cards');
        const openCardWebSocket = () => {
            cardWebSocket.current.onopen = (event) => {
                console.log('Open Card WebSocket:', event);
                sendCardMessage();
            }
            cardWebSocket.current.onclose = (event) => {
                console.log('Close Card WebSocket:', event);
            }
        }
        openCardWebSocket();
        return () => {
            console.log('Closing Card WebSocket');
            cardWebSocket.current.close();
        }
    }, []);

    // Websocket code
    useEffect(() => {
        webSocket.current.onmessage = (event) => {
            const ChatMessage = JSON.parse(event.data);
            console.log('Received Chat Message:', ChatMessage);
            setChatMessages([...chatMessages, {
                accessCode: ChatMessage.accessCode,
                userId: ChatMessage.userId,
                message: ChatMessage.message,
                type: ChatMessage.type
            }]);
            if(scrollBottomRef.current) {
                scrollBottomRef.current.scrollIntoView({ behavior: 'smooth'});
            }
        }
    }, [chatMessages]);

    // Card websocket code
    useEffect(() => {
        cardWebSocket.current.onmessage = (event) => {
            const Card = JSON.parse(event.data);
            console.log('Received Card:', Card);
            setCard({
                word: Card.word,
                taboo1: Card.taboo1,
                taboo2: Card.taboo2,
                taboo3: Card.taboo3,
                taboo4: Card.taboo4,
                taboo5: Card.taboo5
            });
        }
    }, [displayedCard]);

    // Websocket code
    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    }

    // Websocket code
    const handleEnterKey = (event) => {
        if(event.keyCode === ENTER_KEY_CODE){
            sendChatMessage();
        }
    }

    // Websocket code
    const sendChatMessage = () => {
        if(user && message && messageType) {
            console.log('Send Chat Message!');
            webSocket.current.send(
                // Take the access code from the URL, e.g. http://localhost:3000/game/123456
                JSON.stringify(new ChatMessage(window.location.href.slice(-6), user.id, message, messageType))
            );
            setMessage('');
        }
    };

    // Card websocket code
    const sendCardMessageBuzz = () => {
        if (cardWebSocket) {
            console.log('Send Buzz Request!');
            cardWebSocket.current.send(
                // Take the access code from the URL, e.g. http://localhost:3000/game/123456
                JSON.stringify(new CardRequest(window.location.href.slice(-6), "buzz"))
            );
        }
    };

    /* This code is iterating over an array of chatMessages and returning
    * a new array of ListItem components
     */
    const listChatMessages = chatMessages.map((ChatMessage, index) =>
        <Box key={index}
        sx={{
            display: 'flex',
            flexDirection: ChatMessage.type === "description" ? 'row' : 'row-reverse',
            width: '100%',
            alignItems: 'flex-start',
            marginTop: '5px',
        }}>
            <Box
                sx={{
                    backgroundColor: ChatMessage.type === "description" ? 'primary.main' : 'secondary.main',
                    borderRadius: '5px',
                    paddingTop: '2px',
                    paddingBottom: '2px',
                    paddingLeft: '5px',
                    paddingRight: '5px',
                }}
            >
                {ChatMessage.type}: {ChatMessage.message}
            </Box>
        </Box>
    );
    
    const [wordDefinition, setWordDefinition] = useState("");
    const [word] = useState("Apple");
    const [open, setOpen] = useState(false);

    let cardContent = null;

    if(displayedCard) {
        cardContent = (
            <div className="side-box">
                <div>{displayedCard.taboo1}</div>
                <div>{displayedCard.taboo2}</div>
                <div>{displayedCard.taboo3}</div>
                <div>{displayedCard.taboo4}</div>
                <div>{displayedCard.taboo5}</div>
            </div>
      );
    }

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
                        {displayedCard.word}
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
                  {cardContent}
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
              <Box sx={{ flex: '1',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  flexDirection: 'column',
                  width: '100%',
                  paddingTop: '3px',
                  paddingLeft: '8px',
                  paddingRight: '8px',
              }}>
                  {listChatMessages}
                  <ListItem ref={scrollBottomRef}></ListItem>
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
                      onClick={sendChatMessage}
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
          <Button
              variant="contained"
              className="Buzzer"
              onClick={sendCardMessageBuzz}
          >
              Buzzer
          </Button>
      </Box>
    </div>
  );
}
