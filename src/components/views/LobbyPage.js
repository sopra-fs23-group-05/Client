import React, {useEffect, useRef, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Box, Button, Typography,} from "@mui/material";
import 'styles/views/AdminLogin.scss';
import 'styles/views/LobbyPage.scss';
import TabooData from "taboo-data";
import {TeamRequest} from "../../models/TeamRequest";

const Lobby = () => {

    const history = useHistory();

    const [lobby, setLobby] = useState(null);
    const [user, setUser] = useState(null);
    const [isLeader, setIsLeader] = useState(false);
    const [settings, setSettings] = useState(null);

    const accessCode = localStorage.getItem('lobbyAccessCode');
    const userId = localStorage.getItem('token');

    const teamWebSocket = useRef(null);

    const [team1Members, setTeam1Members] = useState([]);
    const [team2Members, setTeam2Members] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                //get user
                const userResponse = await api.get(`/users/${userId}`);
                setUser(userResponse.data);
                console.log('user info', userResponse.data);
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
                console.log('lobby settings', lobbyResponse.data.settings);
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchData();
    }, [accessCode, userId, setUser]);

    // For displaying team 1 to a new client joining the lobby
    useEffect(() => {
        if(lobby?.team1?.length > 0) {
            for(let i = 0; i < lobby.team1.length; i++) {
                setTeam1Members([...team1Members, {
                    userId:lobby.team1[i].id,
                    isLeader:lobby.team1[i].leader,
                    username:lobby.team1[i].username
                }]);
            }
        }
    }, [lobby?.team1]);

    const goBack = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('lobbyAccessCode');
        history.push('/homepage');
        window.location.reload();
    };

    // Team WebSocket code
    useEffect(() => {
        console.log('Opening Team WebSocket');
        // TODO get correct domain when as soon as the code is available on main2
        teamWebSocket.current = new WebSocket('ws://localhost:8080/teams');
        const openWebSocket = () => {
            teamWebSocket.current.onopen = (event) => {
                console.log('Open Team WebSocket:', event);
            }
            teamWebSocket.current.onclose = (event) => {
                console.log('Close Team WebSocket:', event);
            }
        }
        openWebSocket();
        return () => {
            console.log('Closing Team WebSocket');
            teamWebSocket.current.close();
        }
    }, []);

    const changeTeam = (teamNr, type) => {
        console.log('Send Team Message!');
        teamWebSocket.current.send(
            JSON.stringify(new TeamRequest(parseInt(window.location.href.slice(-6), 10), teamNr, parseInt(userId, 10), type))
        );
    }

    // TODO: Continue here
    // Team WebSocket code
    useEffect(() => {
        teamWebSocket.current.onmessage = (event) => {
            const IncomingMessage = JSON.parse(event.data);
            console.log('Received Team Message:', IncomingMessage);


            if (IncomingMessage.type === 'addition') {
                if (IncomingMessage.teamNr === 1) {
                    setTeam1Members([...team1Members, {userId: IncomingMessage.userId}]);
                    lobby.team1.push(IncomingMessage.userId);
                } else if (IncomingMessage.teamNr === 2) {
                    lobby.team2.push(IncomingMessage.user);
                }
            }
            console.log('team1', team1Members);
            console.log('lobby', lobby);
            /*
            else if (IncomingMessage.type === 'removal') {
                if (IncomingMessage.teamNr === 1) {
                    lobby.team1 = lobby.team1.filter(user => user.id !== IncomingMessage.user.id);
                } else if (IncomingMessage.teamNr === 2) {
                    lobby.team2 = lobby.team2.filter(user => user.id !== IncomingMessage.user.id);
                }
            }

             */
        }
    }, [lobby, team1Members]);

    const joinTeam = async (teamNr) => {
        try {
            if (teamNr === 1) {
                const requestBody = JSON.stringify({accessCode, teamNr, userId});
                await api.put(`/lobbies/${accessCode}/teams/${teamNr}/additions/users/${userId}`, requestBody);
                lobby.team1.push(user);
                window.location.reload();
            } else if (teamNr === 2) {
                const requestBody = JSON.stringify({accessCode, teamNr, userId});
                await api.put(`/lobbies/${accessCode}/teams/${teamNr}/additions/users/${userId}`, requestBody);
                lobby.team2.push(user);
                window.location.reload();
            }
        } catch (error) {
            alert(`Something went wrong during the join: \n${handleError(error)}`);
        }
    };

    const goToInvitePage = () => {
        history.push(`/lobbies/${accessCode}/invite`)
    }
    const goToSettingsPage = () => {
        history.push(`/lobbies/${accessCode}/settings`)
    }
    const startGame = async () => {
        try {
            //create Game
            await api.post(`/games/${accessCode}`);

            //get json file for the selected category
            const categoryFile = await TabooData.getCategory(settings, 'en');
            console.log("taken settings", settings);
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

            console.log("newObj", newObj);
            const newJson = JSON.stringify(Object.values(newObj));
            console.log("newJson", newJson);

            const array = JSON.parse(newJson);
            console.log("array", array);
            for (let i = 0; i < array.length; i++) {
                const item = JSON.stringify(array[i]);
                const slicedCard = item.slice();
                console.log("sliced", slicedCard);
                await api.post(`/games/${accessCode}/cards`, slicedCard);
            }

            history.push(`/games/${accessCode}/pregame`);
        } catch (error) {
            alert(`Error: \n${handleError(error)}`);
        }
    }

    let content = <div className="horizontal-box"></div>

    if (isLeader) {
        content = (
            <div className="horizontal-box" style={{marginTop: '-80px', marginBottom: '-100px'}}>
                <Button variant="contained"
                        className="buttonLogin"
                        onClick={() => goToSettingsPage()}
                >
                    Settings
                </Button>
                <Button variant="contained"
                        className="buttonLogin"
                        onClick={() => startGame()}
                >
                    Start Game
                </Button>
            </div>
        );
    }

    const team1Content = team1Members.map((user, index) => (
        <div key = {index} className="team-member">{user.userId}</div>
    ));

    return (
        <div className="homePageRoot">
            <div className="horizontal-box">
                <Typography variant="h5" sx={{color: 'white', fontWeight: 700}}>Access Code:</Typography>
                <Typography variant="h5"
                            sx={{color: 'white', fontWeight: 700, marginLeft: '10px'}}>{accessCode}</Typography>
            </div>

            <Box sx={{display: 'flex', flexDirection: 'column', marginBottom: '-80px'}}>
                <div className="buttonPanel">
                    <Typography variant="h5" sx={{color: 'white', marginBottom: '-50px'}}>Team 1</Typography>
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

                <div className="buttonPanel" style={{marginTop: '20px'}}>
                    <Typography variant="h5" sx={{color: 'white', marginBottom: '-50px'}}>Team 2</Typography>
                    <ul className="team-member-box">
                        {lobby?.team2?.map(user => (
                            <div className="team-member" key={user.id}>{user.username}</div>
                        ))}
                    </ul>
                    <Button variant="contained"
                            className="buttonLogin"
                            onClick={() => changeTeam(2, "addition")}
                    >
                        Join
                    </Button>
                </div>
            </Box>

            <div className="horizontal-box">
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
    );
};
export default Lobby;
