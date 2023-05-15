import {Box} from "@mui/material";
import 'styles/views/PreGame.scss';

import {useHistory} from 'react-router-dom';
import {useEffect, useRef, useState} from "react";
import {api} from "../../helpers/api";
import {getWebSocketDomain} from "../../helpers/getDomain";


const PreGame = () => {
    const history = useHistory();
    const accessCode = localStorage.getItem('lobbyAccessCode');

    const playerName = localStorage.getItem('userName')
    const [role, setRole] = useState(null);
    const [team1, setTeam1] = useState(null);
    const [team2, setTeam2] = useState(null);
    const pageWebSocket = useRef(null);
    const preGameTimerWebSocket = useRef(null);
    const [timer, setTimer] = useState(10);

    useEffect(() => {
        async function fetchData() {
            try {
                const responseRole = await api.get(`/games/${accessCode}/users/${playerName}`);
                const responseGame = await api.get(`/games/${accessCode}`);
                await new Promise(resolve => setTimeout(resolve, 100));
                setRole(responseRole.data);
                setTeam1(responseGame.data.team1.points);
                setTeam2(responseGame.data.team2.points);

            } catch (error) {
                console.error(`Something went wrong while fetching the users:`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchData();
    }, [accessCode, playerName]);

    // WebSocket code
    useEffect(() => {
        console.log('Opening Page WebSocket');
        pageWebSocket.current = new WebSocket(getWebSocketDomain() + '/pages/' + accessCode);
        console.log('Opening PreGame WebSocket');
        preGameTimerWebSocket.current = new WebSocket(getWebSocketDomain() + '/pregameTimers/' + accessCode);

        const openWebSocket = () => {
            pageWebSocket.current.onopen = (event) => {
                console.log('Open Page WebSocket:', event);
                console.log('Open PreGame WebSocket:', event);
            }
            pageWebSocket.current.onclose = (event) => {
                console.log('Close Page WebSocket:', event);
                console.log('Close PreGame WebSocket:', event);
            }
        }
        openWebSocket();
        return () => {
            console.log('Closing Page WebSocket');
            pageWebSocket.current.close();
            console.log('Closing PreGame WebSocket');
            preGameTimerWebSocket.current.close();
        }
    }, []);

    // Page WebSocket code
    const changePage = () => {
        console.log('Send Page Message!');
        pageWebSocket.current.send(
            JSON.stringify({url: `/games/${accessCode}`})
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

    useEffect(() => {
        preGameTimerWebSocket.current.onmessage = (event) => {
            const TimerMessage = JSON.parse(event.data);
            console.log('Received Timer Message:', TimerMessage);
            setTimer(TimerMessage);
            if (TimerMessage === 0) {
                changePage(`games/${accessCode}`);
            }
        }
    },[timer]);

    return (
        <div className="homePageRoot"
             style={{
                 display: 'flex',
                 justifyContent: 'center',
                 alignItems: 'center',
                 width: '100%',
                 height: "100%",
             }}>
            <Box sx={{
                display: 'flex',
                alignItems: "center",
                justifyContent: 'center',
                flexDirection: 'column',
                width: '100%',
                height: "100%",
                backgroundColor: '#D1C4E9',
                borderRadius: '20px',
                border: '1px solid white'
            }}
            ><h2 className="h2"> round starts in:</h2>
                <p>
                <span style={{fontFamily: 'Inter, sans-serif', fontWeight: 'bold', fontSize: '50px'}}>{timer}</span>
                </p>
                <h2 className="h2"> your role:</h2>
                <h2 className="role"> {role}</h2>
            </Box>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                width: '100%',
                height: "100%",
                backgroundColor: '#D1C4E9',
                borderRadius: '20px',
                border: '1px solid white'
            }}
            >
                <h1 className="score">Score</h1>
                <h2 className="team">Team 1: {team1}</h2>
                <h2 className="team">Team 2: {team2}</h2>
            </Box>
        </div>
    );

};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default PreGame;
