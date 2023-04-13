import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button, Typography, Box,} from "@mui/material";
import 'styles/views/AdminLogin.scss';

const Lobby = () => {

    const history = useHistory();
    const [setTeamId] = useState(null);
    const [team1, addToTeam1] = useState(null);
    const [addToTeam2] = useState(null);
    const [setClicked] = useState(false);

    const [user, setUser] = useState(null);

    const accessCode = localStorage.getItem('lobbyAccessCode');

    const userId = localStorage.getItem('token');

    useEffect(() => {
        async function fetchData() {
            try {
                const userResponse = await api.get(`/users/${userId}`);
                setUser(userResponse.data);

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
        //TODO remove user from team if already joined
        history.push('/homepage');
        window.location.reload();
    }

    const clickOnJoinButton = async ({team}) => {
        //TODO insert correct function to join a team
        try {
            setClicked(true);
            const localToken = localStorage.getItem('token'); //token = user.id
            const userFoundByToken = await api.get(`/users/${localToken}`);

            if (team.id === 1) {
                addToTeam1(userFoundByToken);
                setTeamId(1);
            }

            if (team.id === 2) {
                addToTeam2(userFoundByToken);
                setTeamId(2);
            }
        }
        catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
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
                                onClick={() => clickOnJoinButton(team1)}
                        >
                            Join
                        </Button>
                    </div>

                    <div className="buttonPanel" style={{marginTop: '20px'}}>
                        <Typography variant="h5" sx={{color: 'white'}}>Team 2</Typography>
                        <Box sx={{ width: '80%', height: '100px', backgroundColor: 'lightgray' }}></Box>
                        <Button variant="contained"
                                className="buttonLogin"
                                onClick={() => clickOnJoinButton(team1)}
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
