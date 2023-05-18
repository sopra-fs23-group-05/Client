import "styles/views/Game.scss";
import {
    Box,
    Divider,
    Button,
    TextField,
    ListItem,
    DialogTitle,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import SendIcon from '@mui/icons-material/Send';
import {useEffect, useRef, useState} from "react";
import {useHistory} from 'react-router-dom';
import {api, handleError} from 'helpers/api';
import {ChatMessage} from "models/ChatMessage";
import User from "../../models/User";
import Card from "../../models/Card";
import Button_Click from "./sounds/Button_Click.mp3";
import Send_Sound from "./sounds/Send_Sound.mp3";
import Receive_Sound from "./sounds/Receive_Sound.mp3";
import Buzzer_Sound from "./sounds/Buzzer_Sound.mp3";
import {CardRequest} from "../../models/CardRequest";
import {getWebSocketDomain} from 'helpers/getDomain';

export default function Game() {
    const accessCode = window.location.pathname.slice(-6);
    const userId = localStorage.getItem('token');
    const playerName = localStorage.getItem('userName')
    const [role, setRole] = useState("");
    const [isLeader, setIsLeader] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                // response is "cluegiver", "guesser" or "buzzer"
                const responseRole = await api.get(`/games/${accessCode}/users/${playerName}`);
                setRole(responseRole.data.toString().toLowerCase());
                
                const userResponse = await api.get(`/users/${userId}`);
                setIsLeader(userResponse.data.leader);
            } catch (error) {
                console.error(`Something went wrong while fetching the users:`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }
        fetchData();
    }, [accessCode, playerName, userId]);

    const ENTER_KEY_CODE = 13;

    const history = useHistory();
    const scrollBottomRef = useRef(null);
    const webSocket = useRef(null);
    const cardWebSocket = useRef(null);
    const pageWebSocket = useRef(null);
    const timerWebSocket = useRef(null);
    const [chatMessages, setChatMessages] = useState([]);
    // Activate the following line as soon as the actual user is obtained from the backend.
    // const [user, setUser] = useState('');
    const [message, setMessage] = useState('');
    let [scoredPoints, setScoredPoints] = useState(0);
    const [roundsPlayed, setRoundsPlayed] = useState("");
    const [team1Players, setTeam1Players] = useState([]);
    const [team2Players, setTeam2Players] = useState([]);
    // In case this client is the clue giver, the message type is "description", otherwise it is "guess".

    const [timer, setTimer] = useState(null);
    const messageType = role === "cluegiver" ? "description" : "guess";

    const playSound = (soundFile) => {
        const audio = new Audio(soundFile);
        audio.play();
      };


    const doLeave = async () => {
        playSound(Button_Click);
        await api.delete(`/games/${accessCode}/${playerName}`);
        localStorage.removeItem('lobbyAccessCode');
        localStorage.removeItem('token');
        localStorage.removeItem('userName')

        const responseGame = await api.get(`/games/${accessCode}`);
        setTeam1Players(responseGame.data.team1.players);
        setTeam2Players(responseGame.data.team2.players);
        if(team1Players.length < 2 || team2Players.length < 2){
            changePage(`/games/${accessCode}/endscreen`);
            history.push('/homepage');
            window.location.reload();
        }
        else{
            history.push('/homepage');
            window.location.reload();
        }
    }

    const updateTeamScore = async (scoredPoints) => {
        try {
            const requestBody = JSON.stringify({accessCode, scoredPoints});
            await api.put(
                    `/games/${accessCode}/turns`,
                    requestBody
            );

        } catch (error) {
            alert(`Something went wrong during the join: \n${handleError(error)}`);
        }
    };

    let [displayedCard, setCard] = useState(new Card({
        word: "Loading...",
        taboo1: "Loading...",
        taboo2: "Loading...",
        taboo3: "Loading...",
        taboo4: "Loading...",
        taboo5: "Loading..."
    }));


    useEffect(() => {
        async function fetchData() {
            try {
                const responseGame = await api.get(`/games/${accessCode}`);
                await new Promise(resolve => setTimeout(resolve, 100));
                setRounds(responseGame.data.settings.rounds);
                setRoundsPlayed(responseGame.data.roundsPlayed);
                startTimer();
            } catch (error) {
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }


        fetchData()
    }, [accessCode]);

    const [rounds, setRounds] = useState("");

    // Get the actual user from the backend.
    const user = new User({username: "felix", id: 666});

    // Websocket code
    useEffect(() => {
        console.log('Opening Chat WebSocket');
        console.log('Opening Page WebSocket');
        webSocket.current = new WebSocket(getWebSocketDomain() + '/chat' );
        pageWebSocket.current = new WebSocket(getWebSocketDomain() + '/pages' );
        timerWebSocket.current = new WebSocket(getWebSocketDomain() + '/timers' );


        const openWebSocket = () => {
            webSocket.current.onopen = (event) => {
                console.log('Open Chat WebSocket:', event);
                console.log('Open Page WebSocket:', event);
                console.log('Open Timer WebSocket:', event);
            }
            webSocket.current.onclose = (event) => {
                console.log('Close Chat WebSocket:', event);
                console.log('Close Page WebSocket:', event);
                console.log('Close Timer WebSocket:', event);
            }
        }
        openWebSocket();
        return () => {
            console.log('Closing Chat WebSocket');
            webSocket.current.close();
            console.log('Closing Page WebSocket');
            pageWebSocket.current.close();
            console.log('Closing Timer WebSocket');
            timerWebSocket.current.close();
        }
    }, [accessCode]);

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
        cardWebSocket.current = new WebSocket(getWebSocketDomain() + '/cards' );
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
            playSound(Receive_Sound);
            setChatMessages([...chatMessages, {
                accessCode: ChatMessage.accessCode,
                userId: ChatMessage.userId,
                message: ChatMessage.message,
                type: ChatMessage.type
            }]);
            if (scrollBottomRef.current) {
                scrollBottomRef.current.scrollIntoView({behavior: 'smooth'});
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
            setScoredPoints(Card.turnPoints);
        }
    }, [displayedCard], [scoredPoints]);

    // Websocket code
    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    }

    // Websocket code
    const handleEnterKey = (event) => {
        if (event.keyCode === ENTER_KEY_CODE) {
            sendChatMessage();
        }
    }

    // Websocket code
    const sendChatMessage = () => {
        if (user && message && messageType) {
            playSound(Send_Sound);
            console.log('Send Chat Message!');
            webSocket.current.send(
                    // Take the access code from the URL, e.g. http://localhost:3000/game/123456
                    JSON.stringify(new ChatMessage(window.location.href.slice(-6), parseInt(localStorage.getItem('token')), message, messageType))
            );
            setMessage('');
        }
    };

    // Card websocket code
    const sendCardMessageBuzz = () => {
        playSound(Buzzer_Sound);
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
        playSound(Button_Click);
        if (cardWebSocket) {
            console.log('Send Skip Request!');
            cardWebSocket.current.send(
                    // Take the access code from the URL, e.g. http://localhost:3000/game/123456
                    JSON.stringify(new CardRequest(window.location.href.slice(-6), "skip"))
            );
        }
    };

    // Page WebSocket code
    const changePage = (url) => {
        console.log('Send Page Message!');
        pageWebSocket.current.send(
            JSON.stringify({url: url})
        );
    }

    // Page WebSocket code
    useEffect(() => {
        pageWebSocket.current.onmessage = (event) => {
            console.log(event.data);
            const IncomingMessage = JSON.parse(event.data);
            console.log('Received Page Message:', IncomingMessage);
            history.push(IncomingMessage.url);
        }
    }, [history]);
    const startTimer = () => {
        console.log('Send Timer Message!');
        timerWebSocket.current.send("");
    }
    // Timer WebSocket code
    useEffect(() => {
        timerWebSocket.current.onmessage = (event) => {
            const TimerMessage = JSON.parse(event.data);
            console.log('Received Timer Message:', TimerMessage);
            setTimer(TimerMessage);
            if (TimerMessage === 0) {
                webSocket.current.close();
                if (roundsPlayed <= rounds) {
                    updateTeamScore(scoredPoints);
                    //TODO: fix changePage
                    changePage(`/games/${accessCode}/pregame`);
                } else {
                    updateTeamScore(scoredPoints);
                    //TODO: fix changePage
                    changePage(`/games/${accessCode}/endscreen`);
                }
            }
        }
    }, [timer,accessCode,roundsPlayed,rounds,updateTeamScore,changePage, scoredPoints]);

    /* This code is iterating over an array of chatMessages and returning
    * a new array of ListItem components
     */
    const listChatMessages = chatMessages.map((ChatMessage, index) =>
            <div className="chat-message-line" key={index}
                 style={{flexDirection: ChatMessage.type === "description" ? 'row' : 'row-reverse'}}>
                <Box
                        sx={{
                            backgroundColor: ChatMessage.type === "description" ? 'primary.main' : 'secondary.main',
                            borderRadius: '5px',
                            paddingTop: '2px',
                            paddingBottom: '2px',
                            paddingLeft: '5px',
                            paddingRight: '5px',
                            maxWidth: '100%'
                        }}
                >
                    {ChatMessage.type}: {ChatMessage.message}
                </Box>
            </div>
    );

    const [wordDefinition, setWordDefinition] = useState("");
    const [openDefinition, setOpenDefinition] = useState(false);
    const [openLeave, setOpenLeave] = useState(false);

    const handleOpenLeave = async (open) => {
        playSound(Button_Click);
        setOpenLeave(open);
    }

    const handleOpenDefinitionChange = async (open) => {
        playSound(Button_Click);
        setOpenDefinition(open);
    }

    let cardContent = null;

    if (displayedCard) {
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
            <Button variant="contained" className="skip-button"
                    onClick={sendCardMessageSkip}
            >
                Skip Card
            </Button>
    );
    let sendFields = (
            <div className="send-fields">
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
                            height: '100%'
                        }}>
                    <SendIcon/>
                </Button>
            </div>
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
                        <Button variant="contained" className="word-button"
                                onClick={async () => {
                                    const response = await fetch(`https://api.datamuse.com/words?sp=${displayedCard.word}&md=d`);
                                    const data = await response.json();
                                    if (data.length > 0 && data[0].defs) {
                                        setWordDefinition(data[0].defs[0]);
                                    } else {
                                        setWordDefinition("No definition found");
                                    }
                                    handleOpenDefinitionChange(true);
                                }}>
                            {displayedCard.word}
                        </Button>

                        <Dialog open={openDefinition} onClose={() => setOpenDefinition(false)}>
                            <DialogTitle>{displayedCard.word}</DialogTitle>
                            <DialogContent>
                                <DialogContentText>{wordDefinition}</DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => handleOpenDefinitionChange(false)}>Close</Button>
                            </DialogActions>
                        </Dialog>
                        {skipButton}
                    </div>
                    {cardContent}
                </div>
        );
    }

    let clickOnLeave = (
            <Dialog open={openLeave} onClose={() => setOpenLeave(false)}>
                <DialogTitle>Leave Game?</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to leave this game?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenLeave(false)}>Close</Button>
                    <Button style={{color: "red"}} onClick={() => doLeave()}>Leave</Button>
                </DialogActions>
            </Dialog>
    );

    let leaveButton = null;

    if (!isLeader) {
        leaveButton = (
            <div className="leave-box">
            <Button variant="contained" className="leaveButton"
                        onClick={() => handleOpenLeave(true)}
                >
                    <LogoutIcon sx={{color: 'white'}}/>
                </Button>
            </div>
        )
    }

    let timerBox = (
            <div className="flex-container" style={{gap: '0'}}>

                <div>
                {leaveButton}
                {clickOnLeave}
                </div>

                <div className="timer-box">
                    <div  className="title">Timer</div>
                    <div className="title" id="timer">60</div>
                    <Divider sx={{color: 'white', border: '0.5px solid white', width: '80%', margin: '5px'}}/>
                    <div  className="title">Score</div>
                    <div  className="title">{scoredPoints}</div>
                </div>


            <Dialog open={openLeave} onClose={() => handleOpenLeave(false)}>
            <DialogTitle>Leave Game?</DialogTitle>
            <DialogContent>
                <DialogContentText>Are you sure you want to leave this game?</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleOpenLeave(false)}>Close</Button>
                <Button style={{color: "red"}} onClick={() => doLeave()}>Leave</Button>
            </DialogActions>
            </Dialog>
            </div>
    );

    if (role === "guesser") {
        timerBox =
                <div className="horizontal-box" style={{justifyContent: 'space-between'}}>

                    <div className="timer-box">
                        <div  className="title">Timer</div>
                        <div className="title" id="timer">60</div>
                        <Divider sx={{color: 'white', border: '0.5px solid white', width: '80%', margin: '5px'}}/>
                        <div  className="title">Score</div>
                        <div  className="title">{scoredPoints}</div>
                    </div>

                    <div>
                    <Button style={{marginTop: '-80px'}}
                        onClick={() => setOpenLeave(true)}
                    >
                        <LogoutIcon sx={{color: 'white'}}/>
                    </Button>
                    {clickOnLeave}
                    </div>

                </div>
    }


    return (
            <div className="homePageRoot" style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
                <div className="flex-container" style={{marginTop: '-20px'}}>
                    <div className="card-and-timer-box">
                        {cardComponent}
                        {timerBox}
                    </div>
                    <div className="chat-components-box">
                        <div className="chat-box-containing-messages"
                             style={{height: role === "buzzer" ? '525px' : '539px'}}
                        >
                            {listChatMessages}
                            <ListItem ref={scrollBottomRef}></ListItem>
                        </div>
                        {sendFields}
                    </div>
                    {buzzerButton}
                </div>
            </div>
    );
}