import {Typography} from "@mui/material";
import 'styles/views/PreGame.scss';
import {useHistory} from 'react-router-dom';
import {useCallback, useEffect, useRef, useState} from "react";
import {api} from "../../helpers/api";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import {getWebSocketDomain} from "../../helpers/getDomain";
import Button_Click from "./sounds/Button_Click.mp3";
import Button from "@mui/material/Button";


const PreGame = () => {
    const history = useHistory();
    const accessCode = localStorage.getItem('lobbyAccessCode');

    const playerName = localStorage.getItem('userName')
    const [role, setRole] = useState("");
    const [isLeader, setIsLeader] = useState(false);
    const [team1Points, setTeam1Points] = useState(-1);
    const [team2points, setTeam2points] = useState(-1);
    const pageWebSocket = useRef(null);
    const timerWebSocket = useRef(null);
    const [timer, setTimer] = useState(10);

    const playSound = (soundFile) => {
        const audio = new Audio(soundFile);
        audio.play().then(() => {});
      };

    // WebSocket code
    useEffect(() => {
        pageWebSocket.current = new WebSocket(getWebSocketDomain() + '/pages/' + accessCode);
        timerWebSocket.current = new WebSocket(getWebSocketDomain() + '/pregameTimers/' + accessCode);

        const openWebSocket = () => {
            pageWebSocket.current.onopen = (event) => {
                console.log('Open Page WebSocket:', event);
            }
            pageWebSocket.current.onclose = (event) => {
                console.log('Close Page WebSocket:', event);
            }
            timerWebSocket.current.onopen = (event) => {
                console.log('Open Timer WebSocket:', event);
            }
            timerWebSocket.current.onerror = (event) => {
                console.log('Close Timer WebSocket:', event);
            }
        }
        openWebSocket();
        return () => {
            console.log('Closing Page WebSocket');
            pageWebSocket.current.close();
            console.log('Closing Timer WebSocket');
            timerWebSocket.current.close();
        }
    }, [accessCode]);

    useEffect(() => {
        async function fetchData() {
            try {
                const responseRole = await api.get(`/games/${accessCode}/users/${playerName}`);
                const responseGame = await api.get(`/games/${accessCode}`);
                setRole(responseRole.data);
                setTeam1Points(responseGame.data.team1.points);
                setTeam2points(responseGame.data.team2.points);

                const userResponse = await api.get(`/users/${localStorage.getItem('token')}`);
                setIsLeader(userResponse.data.leader);
            } catch (error) {
                console.error(`Something went wrong while fetching the users:`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchData().then(() => {});
    }, [accessCode, playerName]);

    // Page WebSocket code
    const changePage = useCallback(() => {
        console.log('Send Page Message!');
        pageWebSocket.current.send(
            JSON.stringify({url: `/games/${accessCode}`})
        );
        console.log('Sent Page Message!');
    }, [accessCode]);

    // Page WebSocket code
    useEffect(() => {
        pageWebSocket.current.onmessage = (event) => {
            console.log(event.data);
            const IncomingMessage = JSON.parse(event.data);
            console.log('Received Page Message:', IncomingMessage);
            history.push(IncomingMessage.url);
        }
    }, [history]);

    const [definition, setDefinition] = useState("");

    // Timer WebSocket code
    useEffect(() => {
        timerWebSocket.current.onmessage = (event) => {
            const TimerMessage = JSON.parse(event.data);
            console.log('Received Timer Message:', TimerMessage);
            setTimer(TimerMessage);
            if (TimerMessage === 0) {
                if(isLeader) {
                    changePage();
                }
            }
        }
    },[isLeader, changePage]);

    const showDefinition = () => {
        playSound(Button_Click);
        if (definition === "") {
            if (role.toString().toLowerCase() === "cluegiver") {
                setDefinition("Describe the word without using the word itself or any of the listed taboo words.");
            } else if (role.toString().toLowerCase() === "buzzer") {
                setDefinition("Click the buzzer button if the Clue-Giver does not follow the rules of the game")
            } else if (role.toString().toLowerCase() === "guesser") {
                setDefinition("Guess the word the Clue-Giver is trying to describe")
            }
        }
        else {setDefinition("")}
    }

    return (
        <div className="homePageRoot" style={{justifyContent: 'center'}}>
            <div className="flex-container" style={{gap: '50px'}}>
            <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert variant="filled" severity="info">
                    The game is loading!
                </Alert>
            </Stack>
            <div className="buttonPanel">
                <Typography variant="h5" className="title"> Next Round Starts</Typography>
                <br/>
                <Typography variant="h4" className="title">{timer}</Typography>
            </div>
            <div className="buttonPanel">
                <Typography variant="h5" className="title"> Your Next Role</Typography>
                <br/>
                <Typography variant="h5" className="title">{role}</Typography>
                <br/>
                <Button variant="contained"
                        className="buttonLogin"
                        onClick={showDefinition}
                >
                    What Do I Do?
                </Button>
                <br/>
                <Typography variant="h8" className="title" style={{fontStyle: 'italic'}}>{definition}</Typography>
            </div>
            <div className="buttonPanel">
                <Typography variant="h5" className="title">Team Scores</Typography>
                <br/>
                <Typography variant="h5" className="title" style={{alignSelf: "flex-start"}}>Team 1:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{team1Points}</Typography>
                <Typography variant="h5" className="title" style={{alignSelf: "flex-start"}}>Team 2:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{team2points}</Typography>
            </div>
            </div>
        </div>
    );

};

export default PreGame;
