import React, {useEffect, useRef, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button, Typography} from "@mui/material";
import 'styles/views/AdminLogin.scss';
import 'styles/views/LobbyPage.scss';
import 'styles/views/Homepage.scss';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import TabooData from "taboo-data";
import Button_Click from "./sounds/Button_Click.mp3";
import Join_Sound from "./sounds/Join_Sound.mp3";
import Start_Sound from "./sounds/Start_Sound.mp3";
import {TeamRequest} from "../../models/TeamRequest";
import {getWebSocketDomain} from "../../helpers/getDomain";

const Lobby = () => {

    const history = useHistory();

    const [lobby, setLobby] = useState(null);
    const [user, setUser] = useState(null);
    const [isLeader, setIsLeader] = useState(false);
    const [settings, setSettings] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorAlertVisible, setErrorAlertVisible] = useState(false);

    const accessCode = window.location.pathname.slice(-6);
    const userId = localStorage.getItem('token');
    const username = localStorage.getItem('userName');

    const teamWebSocket = useRef(null);
    const pageWebSocket = useRef(null);

    const [team1Members, setTeam1Members] = useState([]);
    const [team2Members, setTeam2Members] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const handleStartGame = () => {
        setIsLoading(true);


        setTimeout(() => {
            setIsLoading(false);

        }, 2000);
    };

    const playSound = (soundFile) => {
        const audio = new Audio(soundFile);
        audio.play().then(() => {});
    };


    useEffect(() => {
        async function fetchData() {
            try {
                console.log('The site was reloaded');

                const remainingUsersResponse = await api.get(`/lobbies/${accessCode}/remainingUsers`);
                setRemainingUsers(remainingUsersResponse.data);
                //get user
                const userResponse = await api.get(`/users/${userId}`);
                console.log('user info', userResponse.data);
                setUser(userResponse.data);
                setIsLeader(userResponse.data.leader);

                //get lobby
                const lobbyResponse = await api.get(`/lobbies/${accessCode}`);
                setLobby({
                    accessCode: lobbyResponse.data.accessCode,
                    lobbyLeader: lobbyResponse.data.lobbyLeader,
                    aSettings: lobbyResponse.data.settings,
                    lobbyUsers: lobbyResponse.data.lobbyUsers,
                    team1: lobbyResponse.data.team1,
                    team2: lobbyResponse.data.team2
                });
                setSettings(lobbyResponse.data.settings.topic.toString().toLowerCase());
                console.log('lobby info:', lobbyResponse.data);

                // Display the users in the teams
                if (lobbyResponse.data.team1.length > 0) {
                    setTeam1Members(prevState => {
                        const updatedMembers = lobbyResponse.data.team1.map(element => ({
                            username: element.username
                        }));
                        return [...prevState, ...updatedMembers];
                    });
                }
                if (lobbyResponse.data.team2.length > 0) {
                    setTeam2Members(prevState => {
                        const updatedMembers = lobbyResponse.data.team2.map(element => ({
                            username: element.username
                        }));
                        return [...prevState, ...updatedMembers];
                    });
                }
            } catch (error) {
                setErrorMessage(error);
                setErrorAlertVisible(true);
                setTimeout(() => {
                    setErrorAlertVisible(false);
                }, 8000);
            }
        }

        fetchData();
    }, [accessCode, userId]);


    const goBack = async () => {
        playSound(Button_Click);
        if (isLeader) {
            if (team1Members.some((member) => member.username === user.username)) {
                teamWebSocket.current.send(JSON.stringify(new TeamRequest(parseInt(window.location.href.slice(-6), 10), 1, parseInt(userId, 10), "LeaderLeftLobby")));
            } else {
                teamWebSocket.current.send(JSON.stringify(new TeamRequest(parseInt(window.location.href.slice(-6), 10), 2, parseInt(userId, 10), "LeaderLeftLobby")));
            }
        } else {
            if (team1Members.some((member) => member.username === user.username)) {
                teamWebSocket.current.send(JSON.stringify(new TeamRequest(parseInt(window.location.href.slice(-6), 10), 1, parseInt(userId, 10), "UserLeftLobby")));
            } else {
                teamWebSocket.current.send(JSON.stringify(new TeamRequest(parseInt(window.location.href.slice(-6), 10), 2, parseInt(userId, 10), "UserLeftLobby")));
            }
        }
        localStorage.removeItem('token');
        localStorage.removeItem('lobbyAccessCode');

        history.push('/homepage');
        window.location.reload();
    };

    // WebSocket code
    useEffect(() => {
        console.log('Opening Team WebSocket');
        teamWebSocket.current = new WebSocket(getWebSocketDomain() + '/teams');
        console.log('Opening Page WebSocket');
        pageWebSocket.current = new WebSocket(getWebSocketDomain() + '/pages/' + accessCode);
        const openWebSocket = () => {
            teamWebSocket.current.onopen = (event) => {
                console.log('Open Team WebSocket:', event);
                console.log('Open Page WebSocket:', event);
            }
            teamWebSocket.current.onclose = (event) => {
                console.log('Close Team WebSocket:', event);
                console.log('Close Page WebSocket:', event);
            }
        }
        openWebSocket();
        return () => {
            console.log('Closing Team WebSocket');
            teamWebSocket.current.close();
            console.log('Closing Page WebSocket');
            pageWebSocket.current.close();
        }
    }, []);

    // Team WebSocket code
    const changeTeam = (teamNr, type) => {
        console.log('Send Team Message!');
        teamWebSocket.current.send(JSON.stringify(new TeamRequest(parseInt(window.location.href.slice(-6), 10), teamNr, parseInt(userId, 10), type)));
    }

    // Team WebSocket code
    useEffect(() => {
        const handleMessage = async (event) => {
            const IncomingMessage = JSON.parse(event.data);
            console.log('Received Team Message:', IncomingMessage);

            if (IncomingMessage.type === 'addition') {
                playSound(Join_Sound);
                if (IncomingMessage.teamNr === 1) {
                    setTeam1Members([...team1Members, {username: IncomingMessage.username}]);
                    lobby.team1.push({id: null, leader: null, username: IncomingMessage.username});
                } else if (IncomingMessage.teamNr === 2) {
                    setTeam2Members([...team2Members, {username: IncomingMessage.username}]);
                    lobby.team2.push({id: null, leader: null, username: IncomingMessage.username});
                }
            } else if (IncomingMessage.type === 'removal') {
                if (IncomingMessage.teamNr === 1) {
                    lobby.team1 = lobby.team1.filter((user) => user.username !== IncomingMessage.username);
                    const newTeam1Members = team1Members.filter((member) => member.username !== IncomingMessage.username);
                    setTeam1Members(newTeam1Members);
                } else if (IncomingMessage.teamNr === 2) {
                    lobby.team2 = lobby.team2.filter((user) => user.username !== IncomingMessage.username);
                    const newTeam2Members = team2Members.filter((member) => member.username !== IncomingMessage.username);
                    setTeam2Members(newTeam2Members);
                }
            } else if (IncomingMessage.type === 'UserLeftLobby') {

                console.log('User left lobby');
                if (IncomingMessage.teamNr === 1) {
                    lobby.team1 = lobby.team1.filter((user) => user.username !== IncomingMessage.username);
                    const newTeam1Members = team1Members.filter((member) => member.username !== IncomingMessage.username);
                    setTeam1Members(newTeam1Members);
                } else if (IncomingMessage.teamNr === 2) {
                    console.log('User left team 2');
                    lobby.team2 = lobby.team2.filter((user) => user.username !== IncomingMessage.username);
                    const newTeam2Members = team2Members.filter((member) => member.username !== IncomingMessage.username);
                    setTeam2Members(newTeam2Members);
                }
            } else if (IncomingMessage.type === 'LeaderLeftLobby') {
                history.push('/homepage');
            } else if (IncomingMessage.type === 'error') {
                if (IncomingMessage.username === user.username) {
                    alert("Joining this team would lead to an unfair game. Therefore, wait until more users have joined the lobby or join the other team!");
                }
            }

            const remainingUsersResponse = await api.get(`/lobbies/${accessCode}/remainingUsers`);
            setRemainingUsers(remainingUsersResponse.data);
        };

        teamWebSocket.current.onmessage = handleMessage;
    }, [accessCode, lobby, team1Members, team2Members, user]);


    // Page WebSocket code
    const changePage = () => {
        console.log('Send Page Message!');
        pageWebSocket.current.send(JSON.stringify({url: `/games/${accessCode}/pregame`}));
    }

    // Page WebSocket code
    useEffect(() => {
        pageWebSocket.current.onmessage = (event) => {
            const IncomingMessage = JSON.parse(event.data);
            console.log('Received Page Message:', IncomingMessage);
            playSound(Start_Sound);
            history.push(IncomingMessage.url);
        }
    }, [history]);

    const goToInvitePage = () => {
        playSound(Button_Click);
        history.push(`/lobbies/${accessCode}/invite`)
    }
    const goToSettingsPage = () => {
        playSound(Button_Click);
        history.push(`/lobbies/${accessCode}/settings`)
    }
    const startGame = async () => {
        try {
            handleStartGame();
            if (settings === "city") {
                setSettings("city-country");
            }
            //create Game
            await api.post(`/games/${accessCode}`);

            //get json file for the selected category

            const categoryFile = await TabooData.getCategory(settings, 'en');
            const categoryJSONFile = JSON.stringify(categoryFile);
            const originalObj = JSON.parse(categoryJSONFile);

            // post all cards from the json file
            const newObj = {};

            for (const word in originalObj) {
                const tabooWords = originalObj[word]
                newObj[word] = {
                    word
                }
                let numberOfTabooWords = 0;
                for (let i = 0; i < tabooWords.length; i++) {
                    numberOfTabooWords += 1;
                    newObj[word]["taboo" + (i + 1)] = tabooWords[i];
                }
                //if number of taboo words in json file != 5, we add "-" to all remaining
                if (numberOfTabooWords !== 5) {
                    const leftTabooWords = 5 - numberOfTabooWords;
                    for (let i = 0; i < leftTabooWords; i++) {
                        newObj[word]["taboo" + (numberOfTabooWords + 1 + i)] = "-";
                    }
                }
            }

            const newJson = JSON.stringify(Object.values(newObj));

            const array = JSON.parse(newJson);
            for (let i = 0; i < array.length; i++) {
                const item = JSON.stringify(array[i]);
                const slicedCard = item.slice();
                await api.post(`/games/${accessCode}/cards`, slicedCard);
            }
            if (isLeader) {
                await api.put(`/games/${accessCode}/cards`);
                console.log("The cards were shuffled and the first card was drawn.");
                changePage();
            }
        } catch (error) {
            setErrorMessage(error);
            setErrorAlertVisible(true);
            setTimeout(() => {
                setErrorAlertVisible(false);
            }, 8000);
        }
    }

    let content = <div className="horizontal-box"></div>

    const checkAllUsersJoinedTeam = async () => {
        const usersResponse = await api.get(`/lobbies/${accessCode}/users/teams`);
        return usersResponse.data;
    }

    if (isLeader) {
        content = (<div className="horizontal-box" style={{marginTop: '-24px'}}>
                <Button
                    variant="contained"
                    className="buttonLogin"
                    onClick={() => goToSettingsPage()}
                >
                    Settings
                </Button>
                <Button
                    variant="contained"
                    className="buttonLogin"
                    onClick={() => startGame()}
                    disabled={team1Members.length < 2 || team2Members.length < 2 || !checkAllUsersJoinedTeam()}
                >
                    {isLoading ? 'Loading' : 'Start Game'} {}
                </Button>
            </div>);
    }

    const team1Content = team1Members.map((user) => (
        <div key={user.username} className="team-member">{user.username}</div>));

    const team2Content = team2Members.map((user) => (
        <div key={user.username} className="team-member">{user.username}</div>));


    const [remainingUsers, setRemainingUsers] = useState(4);

    return (<div className="homePageRoot">
            <div className="flex-container">

                <div className="horizontal-box" style={{marginTop: '-20px'}}>
                    <Typography variant="h5" className="title" style={{fontSize: '30px'}}>Access Code:</Typography>
                    <Typography variant="h5" className="title" style={{fontSize: '30px'}}>{accessCode}</Typography>
                </div>

                <div className="horizontal-box" style={{marginTop: '-30px'}}>
                    <Typography variant="h5" className="title" style={{fontSize: '16px'}}>Username:</Typography>
                    <Typography variant="h5" className="title" style={{fontSize: '16px'}}>{username}</Typography>
                </div>


                <div className="flex-container">
                    <div className="buttonPanel" style={{marginTop: '-20px'}}>
                        <Typography variant="h5" className="title" style={{marginTop: '-20px'}}>Team 1</Typography>
                        <ul className="team-member-box">
                            {team1Content}
                        </ul>
                        <Button variant="contained"
                                className="buttonLogin"
                                onClick={() => changeTeam(1, "addition")}
                        >
                            Join
                        </Button>
                    </div>

                    <div className="buttonPanel">
                        <Typography variant="h5" className="title" style={{marginTop: '-20px'}}>Team 2</Typography>
                        <ul className="team-member-box">
                            {team2Content}
                        </ul>
                        <Button variant="contained"
                                className="buttonLogin"
                                onClick={() => changeTeam(2, "addition")}
                        >
                            Join
                        </Button>
                    </div>
                </div>

                <div className="horizontal-box" style={{marginTop: '0px'}}>
                    <Typography variant="h5" className="title" style={{fontSize: '16px', marginTop: '-20px'}}>You
                        need {remainingUsers} more players to start the game!</Typography>
                </div>

                <div className="horizontal-box" style={{marginTop: '-15px'}}>
                    <Button variant="contained"
                            className="buttonLogin"
                            onClick={() => goBack()}
                    >
                        Back
                    </Button>
                    <Button variant="contained"
                            className="buttonLogin"
                            onClick={() => goToInvitePage()}
                    >
                        Invite
                    </Button>
                </div>
                {content}
            </div>
            {errorAlertVisible && (<Stack sx={{width: '100%'}} spacing={2}>
                    <Alert variant="filled" severity="error">
                        Error: {handleError(errorMessage)}
                    </Alert>
                </Stack>)}
        </div>);
};
export default Lobby;
