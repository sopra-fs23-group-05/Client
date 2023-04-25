import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button, Typography, Box,} from "@mui/material";
import 'styles/views/AdminLogin.scss';
import 'styles/views/LobbyPage.scss';

const Lobby = () => {

    const history = useHistory();
  
    const [lobby, setLobby] = useState(null);
    const [user, setUser] = useState(null);
    const [isLeader, setIsLeader] = useState(false);
  
    const accessCode = localStorage.getItem('lobbyAccessCode');
    const userId = localStorage.getItem('token');
  
    useEffect(() => {
      async function fetchData() {
        try {
          //get user
          const userResponse = await api.get(`/users/${userId}`);
          setUser(userResponse.data);
          console.log('user info', userResponse.data);
          setIsLeader(userResponse.data.leader);
  
          //get teams
          const lobbyResponse = await api.get(`/lobbies/${accessCode}`);
          setLobby(lobbyResponse.data);
          console.log('lobby info:', lobbyResponse.data);
  
        } catch (error) {
          console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
          console.error("Details:", error);
          alert("Something went wrong while fetching the users! See the console for details.");
        }
      }
      fetchData();
    }, [accessCode, userId, setUser]);
  
    const goBack = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('lobbyAccessCode');
      //TODO remove user from team if already joined
      history.push('/homepage');
      window.location.reload();
    };
  
    const joinTeam = async (teamNr) => {
        try {
          for (let i = 0; i < lobby.team1.length; i++) {
            if (lobby.team1[i].id === user.id) {
              alert("you already joined team 1");
              teamNr = 0;
            }
          }
      
          for (let i = 0; i < lobby.team2.length; i++) {
            if (lobby.team2[i].id === user.id) {
              alert("you already joined team 2");
              teamNr = 0;
            }
          }
      
          if (teamNr === 1) {
            const requestBody = JSON.stringify({ accessCode, teamNr, userId });
            await api.put(
              `/lobbies/${accessCode}/teams/${teamNr}/additions/users/${userId}`,
              requestBody
            );
            const updatedLobby = { ...lobby };
            updatedLobby.team1.push(user);
            setLobby(updatedLobby);
      
          } else if (teamNr === 2) {
            const requestBody = JSON.stringify({ accessCode, teamNr, userId });
            await api.put(
              `/lobbies/${accessCode}/teams/${teamNr}/additions/users/${userId}`,
              requestBody
            );
            const updatedLobby = { ...lobby };
            updatedLobby.team2.push(user);
            setLobby(updatedLobby);
      
          }
        } catch (error) {
          alert(`Something went wrong during the join: \n${handleError(error)}`);
        }
      };

    const goToInvitePage = () => {history.push(`/lobbies/${accessCode}/invite`)}
    const goToSettingsPage = () => {history.push(`/lobbies/${accessCode}/settings`)}
    const startGame = async () => {
        await api.post(`/games/${accessCode}`);

        history.push(`/games/${accessCode}/pregame`);
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

    return (
            <div className="homePageRoot">
                <div className="horizontal-box">
                    <Typography variant="h5" sx={{color: 'white', fontWeight: 700}}>Access Code:</Typography>
                    <Typography variant="h5" sx={{color: 'white', fontWeight: 700, marginLeft: '10px'}}>{accessCode}</Typography>
                </div>

                <Box sx={{display: 'flex', flexDirection: 'column', marginBottom: '-80px'}}>
                    <div className="buttonPanel">
                        <Typography variant="h5" sx={{color: 'white', marginBottom: '-50px'}}>Team 1</Typography>
                        <ul className="team-member-box">
                            {lobby?.team1?.map(user => (
                                    <div className="team-member" key={user.id}>{user.username}</div>
                            ))}
                        </ul>
                        <Button variant="contained"
                                className="buttonLogin"
                                onClick={() => joinTeam(1)}
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
                                onClick={() => joinTeam(2)}
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
