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
import {useCallback, useEffect, useRef, useState} from "react";
import {useHistory} from 'react-router-dom';
import {api, handleError} from 'helpers/api';
import {ChatMessage} from "models/ChatMessage";
import Card from "../../models/Card";
import Button_Click from "./sounds/Button_Click.mp3";
import Notification_Sound from "./sounds/Notification_Sound.mp3";
import Buzzer_Sound from "./sounds/Buzzer_Sound.mp3";
import Leave_Sound from "./sounds/Leave_Sound.mp3";
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
        fetchData().then(() => {});
    }, [accessCode, playerName, userId]);

    const ENTER_KEY_CODE = 13;
    const history = useHistory();
    const scrollBottomRef = useRef(null);
    const chatWebSocket = useRef(null);
    const cardWebSocket = useRef(null);
    const pageWebSocket = useRef(null);
    const timerWebSocket = useRef(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState('');
    let [scoredPoints, setScoredPoints] = useState(0);
    const [roundsPlayed, setRoundsPlayed] = useState("");
    const [buzzerWasPressed, setBuzzerWasPressed] = useState(false);
    const [timer, setTimer] = useState(null);
    const messageType = role === "cluegiver" ? "description" : "guess";
    const [rounds, setRounds] = useState("");

    const playSound = (soundFile) => {
        const audio = new Audio(soundFile);
        audio.play().then(() => {});
      };

    const doLeave = async () => {
        playSound(Leave_Sound);

        try {
            //if the leader clicks on finish, the game will end after the current round is over for everyone
            if (isLeader) {
                await api.put(`/games/${accessCode}/finishes`);
            }

            else {
                //delete the player from the team/game
                await api.delete(`/games/${accessCode}/${playerName}`);

                // redirect leaving player to homepage
                history.push('/homepage');
                localStorage.removeItem('lobbyAccessCode');
                localStorage.removeItem('token');
                localStorage.removeItem('userName');
            }
        } catch (error) {
            alert(`Something went wrong: \n${handleError(error)}`);
        }
    }

    const changeTurn = useCallback(async () => {
        console.log("changeTurn called");
        if(isLeader) {
            try {
                await api.put(`/games/${accessCode}/turns`);
                if (roundsPlayed < rounds) {
                    changePage(`/games/${accessCode}/pregame`);
                } else {
                    changePage(`/games/${accessCode}/endscreen`);
                }
            } catch (error) {
                alert(`Something went wrong while changing the turn in the backend: \n${handleError(error)}`);
            }
        }
    }, [accessCode, isLeader, rounds, roundsPlayed]);

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
            } catch (error) {
                console.error("Details:", error);
                alert("Something went wrong while fetching the game!");
            }
        }
        fetchData().then(() => {});
    }, [accessCode, doLeave]);

    // Websocket code
    useEffect(() => {
        chatWebSocket.current = new WebSocket(getWebSocketDomain() + '/chats/' + accessCode);
        pageWebSocket.current = new WebSocket(getWebSocketDomain() + '/pages/' + accessCode);
        cardWebSocket.current = new WebSocket(getWebSocketDomain() + '/cards/' + accessCode);
        timerWebSocket.current = new WebSocket(getWebSocketDomain() + '/timers/' + accessCode);

        const openWebSocket = () => {
            chatWebSocket.current.onopen = (event) => {
                console.log('Open Chat WebSocket:', event);
            }
            chatWebSocket.current.onclose = (event) => {
                console.log('Close Chat WebSocket:', event);
            }
            pageWebSocket.current.onopen = (event) => {
                console.log('Open Page WebSocket:', event);
            }
            pageWebSocket.current.onclose = (event) => {
                console.log('Close Page WebSocket:', event);
            }
            cardWebSocket.current.onopen = (event) => {
                console.log('Open Card WebSocket:', event);
            }
            cardWebSocket.current.onclose = (event) => {
                console.log('Close Card WebSocket:', event);
            }
            timerWebSocket.current.onopen = (event) => {
                console.log('Open Timer WebSocket:', event);
            }
            timerWebSocket.current.onclose = (event) => {
                console.log('Close Timer WebSocket:', event);
            }
        }
        openWebSocket();
        return () => {
            console.log('Closing Chat WebSocket');
            chatWebSocket.current.close();
            console.log('Closing Page WebSocket');
            pageWebSocket.current.close();
            console.log('Closing Card WebSocket');
            cardWebSocket.current.close();
            console.log('Closing Timer WebSocket');
            timerWebSocket.current.close();
        }
    }, [accessCode]);

    // Chat websocket code
    useEffect(() => {
        chatWebSocket.current.onmessage = (event) => {
            const ChatMessage = JSON.parse(event.data);
            console.log('Received Chat Message:', ChatMessage);
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
            const CardDTO = JSON.parse(event.data);
            console.log('Received Card:', CardDTO);
            playSound(Notification_Sound);
            if (CardDTO.word !== displayedCard.word) {
                enableBuzzer();
            }
            setCard({
                word: CardDTO.word,
                taboo1: CardDTO.taboo1,
                taboo2: CardDTO.taboo2,
                taboo3: CardDTO.taboo3,
                taboo4: CardDTO.taboo4,
                taboo5: CardDTO.taboo5
            });
            setScoredPoints(CardDTO.turnPoints);
        }
    }, [displayedCard], [scoredPoints]);

    const enableBuzzer = () => {
        setBuzzerWasPressed(false);
    }
    // Chat websocket code
    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    }

    // Chat websocket code
    const handleEnterKey = (event) => {
        if (event.keyCode === ENTER_KEY_CODE) {
            sendChatMessage();
        }
    }

    // Chat websocket code
    const sendChatMessage = () => {
        if (message && messageType) {
            console.log('Send Chat Message!');
            chatWebSocket.current.send(
                    // Take the access code from the URL, e.g. http://localhost:3000/game/123456
                    JSON.stringify(new ChatMessage(window.location.href.slice(-6), parseInt(localStorage.getItem('token')), message, messageType))
            );
            setMessage('');
        }
    };

    // Card websocket code
    const sendCardMessage = (action) => {
        if (cardWebSocket) {
            console.log('Send ' + action + ' request!');
            cardWebSocket.current.send(
                // Take the access code from the URL, e.g. http://localhost:3000/game/123456
                JSON.stringify(new CardRequest(window.location.href.slice(-6), action))
            );
        }
    };

    // Page websocket code
    const changePage = (url) => {
        console.log('Send Page Message!');
        pageWebSocket.current.send(
            JSON.stringify({url: url})
        );
    }

    // Page websocket code
    useEffect(() => {
        pageWebSocket.current.onmessage = (event) => {
            console.log(event.data);
            const IncomingMessage = JSON.parse(event.data);
            console.log('Received Page Message:', IncomingMessage);
            history.push(IncomingMessage.url);
        }
    }, [history]);

    // Timer websocket code
    useEffect(() => {
        timerWebSocket.current.onmessage = (event) => {
            const TimerMessage = JSON.parse(event.data);
            console.log('Received Timer Message:', TimerMessage);
            setTimer(TimerMessage);
            if (TimerMessage === 0) {
                chatWebSocket.current.close();
                changeTurn().then(() => {});
            }
        }
    }, [changeTurn, changePage]);

    /* This code is iterating over an array of chatMessages and returning
    * a new array of ListItem components. */
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
                    onClick={() => {
                        sendCardMessage("skip");
                        playSound(Button_Click);
                    }}
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
                        onClick={() => {
                            if (!buzzerWasPressed) {
                                setBuzzerWasPressed(true);
                                sendCardMessage("buzz");
                                playSound(Buzzer_Sound);
                            }
                        }}
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
                                        setWordDefinition(data[0].defs.map(def => def.substring(2)));
                                    } else {
                                        setWordDefinition("No definition found");
                                    }
                                    await handleOpenDefinitionChange(true);
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

    const leaderInformation = (isLeader) ? "When you click on finish, the game will end for each player after the current round." : "";
    const title = (isLeader) ? "Finish Game" : "Leave Game";
    const action = (isLeader) ? "finish" : "leave";
    const buttonWord = (isLeader) ? "Finish" : "Leave";

    let clickOnLeave = (
            <Dialog open={openLeave} onClose={() => setOpenLeave(false)}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to {action} this game? {leaderInformation}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenLeave(false)}>Close</Button>
                    <Button style={{color: "red"}}
                            onClick={() => {
                                doLeave().then(() => {});
                                handleFinishButtonClick();
                                setOpenLeave(false);
                            }}
                    >
                        {buttonWord}
                    </Button>
                </DialogActions>
            </Dialog>
    );

    const disabledFinishButton = (isLeader && roundsPlayed === rounds);
    const [leaderClickedOnFinish, setLeaderClickedOnFinish] = useState(false);

    const handleFinishButtonClick = () => {
        if (isLeader) {
            setLeaderClickedOnFinish(true);
        }
    }

    let leaveButton = (
        <div className="leave-box">
        <Button
                disabled={disabledFinishButton || leaderClickedOnFinish}
                onClick={() => handleOpenLeave(true)}
            >
                <LogoutIcon sx={{color: (disabledFinishButton || leaderClickedOnFinish) ? 'grey' : 'white' }}/>
            </Button>
        </div>
    )


    let timerBox = (
            <div className="flex-container" style={{gap: '0', height: '100%'}}>

                <div>
                {leaveButton}
                {clickOnLeave}
                </div>

                <div className="timer-box">
                    <div  className="title">Timer</div>
                    <div className="title" >{timer}</div>
                    <Divider sx={{color: 'white', border: '0.5px solid white', width: '80%', margin: '5px'}}/>
                    <div  className="title">Score</div>
                    <div  className="title">{scoredPoints}</div>
                </div>
            </div>
    );

    if (role === "guesser") {
        timerBox =
                <div className="horizontal-box" style={{justifyContent: 'space-between'}}>

                    <div className="timer-box">
                        <div  className="title">Timer</div>
                        <div className="title">{timer}</div>
                        <Divider sx={{color: 'white', border: '0.5px solid white', width: '80%', margin: '5px'}}/>
                        <div  className="title">Score</div>
                        <div  className="title">{scoredPoints}</div>
                    </div>

                    <div>
                    <Button style={{marginTop: '-80px'}}
                            disabled={disabledFinishButton || leaderClickedOnFinish}
                            onClick={() => handleOpenLeave(true)}
                    >
                        <LogoutIcon sx={{color: (disabledFinishButton || leaderClickedOnFinish) ? 'grey' : 'white' }}/>
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