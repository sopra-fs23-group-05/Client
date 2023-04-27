import "styles/views/Game.scss";
import {Box, Divider, Button, TextField, ListItem, DialogTitle, Dialog, DialogContent, DialogContentText, DialogActions} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import {useEffect, useRef, useState} from "react";
import {useHistory} from 'react-router-dom';
import {api, handleError} from 'helpers/api';
import {ChatMessage} from "models/ChatMessage";
import User from "../../models/User";
import Team from "../../models/Team";
import Card from "../../models/Card";
import {CardRequest} from "../../models/CardRequest";

export default function Game(){
    const accessCode = localStorage.getItem('lobbyAccessCode');
    const playerName = localStorage.getItem('userName')
    const [role,setRole] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const responseRole = await api.get(`/games/${accessCode}/users/${playerName}`);
                setRole(responseRole.data.toString().toLowerCase());


            } catch (error) {
                console.error(`Something went wrong while fetching the users:`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }


        fetchData();
    }, [accessCode, playerName]);

    const ENTER_KEY_CODE = 13;

    const history = useHistory();
    const scrollBottomRef = useRef(null);
    const webSocket = useRef(null);
    const cardWebSocket = useRef(null);
    const [chatMessages, setChatMessages] = useState([]);
    // Activate the following line as soon as the actual user is obtained from the backend.
    // const [user, setUser] = useState('');
    const [message, setMessage] = useState('');
    const [scoredPoints] = useState(4);
    const [roundsPlayed,setRoundsPlayed] = useState("");
    
    
    let [displayedCard, setCard] = useState(new Card({word: "Loading...", taboo1: "Loading...", taboo2: "Loading...", taboo3: "Loading...", taboo4: "Loading...", taboo5: "Loading..."}));


    useEffect(() => {
        async function fetchData() {
            try {
                const responseGame = await api.get(`/games/${accessCode}`);
                await new Promise(resolve => setTimeout(resolve, 100));
                setRounds(responseGame.data.settings.rounds);
                setRoundsPlayed(responseGame.data.roundsPlayed);
                setTime(responseGame.data.settings.roundTime);

            } catch (error) {
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }


        fetchData()
    }, [accessCode]);

    const [rounds, setRounds] = useState("");
    const [roundTime, setTime] = useState("");

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

    // Card websocket code
    const sendCardMessageSkip = () => {
        if (cardWebSocket) {
            console.log('Send Skip Request!');
            cardWebSocket.current.send(
                // Take the access code from the URL, e.g. http://localhost:3000/game/123456
                JSON.stringify(new CardRequest(window.location.href.slice(-6), "skip"))
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

    let timeLeft = roundTime;
    const downloadTimer = setInterval(function () {
        if (timeLeft <= 0) {
            if(roundsPlayed<=rounds){
                console.log(scoredPoints);
                updateTeamScore(scoredPoints);
                clearInterval(downloadTimer);
                history.push(`/games/${accessCode}/pregame`);
            }
            else{
                console.log(scoredPoints);
                updateTeamScore(scoredPoints);
                clearInterval(downloadTimer);
                history.push(`/games/${accessCode}/endscreen`);
            }
        } else {
            document.getElementById("countdown").innerHTML = timeLeft;
        }
        timeLeft -= 1;
    }, 1000);

    const updateTeamScore = async (scoredPoints) => {
        try {
            const requestBody = JSON.stringify({accessCode, scoredPoints});
            await api.put(
              `/games/${accessCode}/turns`,
              requestBody
            );
          
          }
          catch (error) {
          alert(`Something went wrong during the join: \n${handleError(error)}`);
        }
      };

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

    //Buzzer Button is only visible for buzzing team
    //Skip Button is not visible for buzzing team
    //chat input field and send button not visible for buzzing team

    let buzzerButton = null;
    let skipButton = (
            <Button variant="contained" sx={{width: '95%', bgcolor: 'red', '&:hover': { bgcolor: 'darkred' }, '&:active': { bgcolor: 'darkred' } }}
                    onClick={sendCardMessageSkip}
            >Skip Card</Button>
    );
    let sendFields = (
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
    );


    if (role === "buzzer") {
        buzzerButton = (
            <Button variant="contained"
                    className="Buzzer"
                    onClick={sendCardMessageBuzz}
            >
                Buzzer
            </Button>
        );
        skipButton = null;
        sendFields = null;
    }



    //card component is not visible for guessing team
    let cardComponent = null;

    if (role !== "guesser" || role === "cluegiver") {
        cardComponent = (
                <div className="card-box">
                    <div className="side-box">
                        <Button variant="contained" sx={{width: '95%', bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' }, '&:active': { bgcolor: 'darkgreen' } }}
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
                        {skipButton}
                    </div>
                    {cardContent}
                </div>
        );
    }

    return (
    <div className="homePageRoot" style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
      <Box sx={{display: 'flex', flexDirection: 'column', flex: '1'}}>
          <div className="card-and-timer-box">
              {cardComponent}
                  <div className="timer-box">
                      <div>Timer</div>
                      <div id="countdown" className="countdown" style={{fontSize: "25px"}}></div>
                      <Divider sx={{color: 'white', border: '1px solid white', width: '80%', marginBottom: '15px', marginTop: '15px'}} />
                      <div>Score</div>
                      <div>{scoredPoints}</div>
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
              {sendFields}
          </Box>
          {buzzerButton}
      </Box>
    </div>
  );
}
