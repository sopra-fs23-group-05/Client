import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button, Typography, Box,} from "@mui/material";
import 'styles/views/AdminLogin.scss';

const Lobby = () => {

    const history = useHistory();
    const [user, setUser] = useState(null);
    const [isLeader, setIsLeader] = useState(false);
    const [setTeamId] = useState(null);
    const [team1, addToTeam1] = useState(null);
    const [team2, addToTeam2] = useState(null);
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const localToken = localStorage.getItem('token'); //token = user.id
                const response = await api.get(`/users/${localToken}`);

                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the returned users and update the state.
                setUser(response.data);
                setIsLeader(user.leader);

            } catch (error) {
                console.error(`Something went wrong while fetching the user: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the user! See the console for details.");
            }
        }

        fetchData();
    });

    console.log("local token", localStorage.getItem('token'));
    console.log("leader", isLeader);
    console.log("user", user);

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
    const startGame = () => {}//TODO insert code

    let content = <Box sx={{
        width: '50%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'}}
    />

    if (isLeader) {
        content = (
                <Box sx={{
                    width: '50%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'}}
                >
                    <Button variant="contained"
                            sx={{backgroundColor: '#8a2be2', color: 'orange', '&:hover': { backgroundColor: '#8a2be2'}, width: '40%', marginTop: '10px'}}
                            onClick={() => goToSettingsPage()}
                    >
                        Settings
                    </Button>
                    <Button variant="contained"
                            sx={{backgroundColor: '#8a2be2', color: 'orange', '&:hover': { backgroundColor: '#8a2be2'}, width: '40%', marginTop: '10px'}}
                            onClick={() => startGame()}
                    >
                        Start Game
                    </Button>
                </Box>
        );
    }

    return (
            <div className="homePageRoot">
                <Typography  variant="h5" sx={{color: 'white'}}>Access Code:</Typography>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    width: '70%',
                    height: 200,
                    backgroundColor: '#D1C4E9',
                    borderRadius: '20px',
                    border: '1px solid white',
                    marginBottom: '10px'
                }}
                >
                    <Typography variant="h6" sx={{color: 'white'}}>Team 1</Typography>
                    <Box sx={{ width: '80%', height: '100px', backgroundColor: 'lightgray' }}></Box>

                    <Button variant="contained"
                            sx={{backgroundColor: '#8a2be2', color: 'orange', '&:hover': { backgroundColor: '#8a2be2'}, width: '40%', marginTop: '10px'}}
                            onClick={() => clickOnJoinButton(team1)}
                            disabled={clicked}
                    >
                        Join
                    </Button>
                </Box>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    width: '70%',
                    height: 200,
                    backgroundColor: '#D1C4E9',
                    borderRadius: '20px',
                    border: '1px solid white'
                }}
                >
                    <Typography variant="h6" sx={{color: 'white'}}>Team 2</Typography>
                    <Box sx={{ width: '80%', height: '100px', backgroundColor: 'lightgray' }}></Box>

                    <Button variant="contained"
                            sx={{backgroundColor: '#8a2be2', color: 'orange', '&:hover': { backgroundColor: '#8a2be2'}, width: '40%', marginTop: '10px'}}
                            onClick={() => clickOnJoinButton(team2)}
                            disabled={clicked}
                    >
                        Join
                    </Button>
                </Box>

                <Box sx={{
                    width: '50%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'}}
                >
                    <Button variant="contained"
                            sx={{backgroundColor: '#8a2be2', color: 'orange', '&:hover': { backgroundColor: '#8a2be2'}, width: '40%', marginTop: '10px'}}
                            onClick={() => goBack()}
                    >
                        Back
                    </Button>
                    <Button variant="contained"
                            sx={{backgroundColor: '#8a2be2', color: 'orange', '&:hover': { backgroundColor: '#8a2be2'}, width: '40%', marginTop: '10px'}}
                            onClick={() => goToInvitePage()}
                    >
                        Invite
                    </Button>
                </Box>
                {content}
            </div>
    );
};
export default Lobby;
