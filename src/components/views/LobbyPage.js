import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button, Typography, Box,} from "@mui/material";
import 'styles/views/AdminLogin.scss';

const Lobby = () => {

    const history = useHistory();

    const [lobby, setLobby] = useState(null);
    //const [user, setUser] = useState(null);
    const [clicked, setClicked] = useState(false);

    const accessCode = localStorage.getItem('lobbyAccessCode');
    //const userId = localStorage.getItem('token');

    const mockUser = {
        id: 17,
        username: 'mockUser',
        isLeader: false,
    };

    useEffect(() => {
        async function fetchData() {
            try {
                //get user
                //const userResponse = await api.get(`/users/${userId}`);
                //setUser(userResponse.data);

                //get teams
                const lobbyResponse = await api.get(`/lobbies/${accessCode}`);
                setLobby(lobbyResponse.data);


            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchData();
    }, []);

    const goBack = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('lobbyAccessCode');
        //TODO remove user from team if already joined
        history.push('/homepage');
        window.location.reload();
    }

    const joinTeam = async (teamNr) => {
        try {
            if (teamNr === 1 && !clicked) {
                setClicked(true);
                //const teamId = 1; //TODO get correct team id
                //const requestBody = JSON.stringify({accessCode, teamId, userId});
                //const joinedLobby = await api.put(`/lobbies/${accessCode}/teams/${teamId}/additions/users/${userId}`, requestBody)
                lobby.team1.push(mockUser);
                console.log('team1:', lobby.team1);
            }
            else if (teamNr === 2 && !clicked) {
                setClicked(true);
                //const teamId = 2; //TODO get correct team id
                //const requestBody = JSON.stringify({accessCode, teamId, userId});
                //const joinedLobby = await api.put(`/lobbies/${accessCode}/teams/${teamId}/additions/users/${userId}`, requestBody)
                lobby.team2.push(mockUser);
                console.log('team2:', lobby.team2);
            }
        }
        catch (error) {
            alert(`Something went wrong during the join: \n${handleError(error)}`);
        }
    };

    const goToInvitePage = () => {}//TODO insert code
    const goToSettingsPage = () => {}//TODO insert code
    const startGame = async () => {
        await api.post(`/games/${accessCode}`);

        history.push(`/games/${accessCode}/pregame`);
    }

    let content = <div className="horizontal-box"></div>

    //should be if  (user.isLeader)
    if (true) {
        content = (
                <div className="horizontal-box">
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

    return (
            <div className="homePageRoot">
                <div className="horizontal-box" style={{marginBottom: '-80px'}}>
                    <Typography variant="h5" sx={{color: 'white', fontWeight: 700}}>Access Code:</Typography>
                    <Typography variant="h5" sx={{color: 'white', fontWeight: 700, marginLeft: '10px'}}>{accessCode}</Typography>
                </div>

                <Box sx={{display: 'flex', flexDirection: 'column', marginBottom: '-80px'}}>
                    <div className="buttonPanel">
                        <Typography variant="h5" sx={{color: 'white'}}>Team 1</Typography>
                        <Box sx={{ width: '80%', height: '100px', backgroundColor: 'lightgray' }}></Box>
                        <Button variant="contained"
                                className="buttonLogin"
                                onClick={() => joinTeam(1)}
                        >
                            Join
                        </Button>
                    </div>

                    <div className="buttonPanel" style={{marginTop: '20px'}}>
                        <Typography variant="h5" sx={{color: 'white'}}>Team 2</Typography>
                        <Box sx={{ width: '80%', height: '100px', backgroundColor: 'lightgray' }}></Box>
                        <Button variant="contained"
                                className="buttonLogin"
                                onClick={() => joinTeam(2)}
                        >
                            Join
                        </Button>
                    </div>
                </Box>

                <div className="horizontal-box" style={{marginBottom: '-80px'}}>
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
