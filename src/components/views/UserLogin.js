import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {TextField, Button, Typography, Box} from "@mui/material";
import 'styles/views/AdminLogin.scss';
import TabooLogo from "./TabooLogo.png";
import Button_Click from "./sounds/Button_Click.mp3";
import BackgroundVideo from "./BackgroundVideo.mp4";
import Lobby from "../../models/Lobby";

const UserLogin = () => {
    const history = useHistory();
    const ENTER_KEY_CODE = 13;
    const [username, setUsername] = useState(null);
    const leader = false;
    const url = window.location.href;
    const parts = url.split("/");
    var accessCodeURL = parts.pop().toString();
    if (accessCodeURL === 'user-login') {
        accessCodeURL = null;
    }
    const [givenAccessCode, setGivenAccessCode] = useState(accessCodeURL);


    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }
    const handleAccessCodeChange = (event) => {
        setGivenAccessCode(event.target.value)
    }

    const playSound = (soundFile) => {
        const audio = new Audio(soundFile);
        audio.play();
      };

    const goBack = () => {
        playSound(Button_Click);
        localStorage.removeItem('token');
        localStorage.removeItem('lobbyAccessCode');
        history.push('/homepage');
    }

    const handleEnterKey = (event) => {
        if (event.keyCode === ENTER_KEY_CODE) {
            doLogin();
        }
    }

    const doLogin = async () => {
        try {
            //find Lobby; if not found, error thrown
            playSound(Button_Click);
            const requestLobby = await api.get(`/lobbies/${givenAccessCode}`);
            const lobby = new Lobby(requestLobby.data);
            localStorage.setItem('lobbyAccessCode', lobby.accessCode);

            //create user
            const requestBody = JSON.stringify({username, leader});
            const response = await api.post('/users', requestBody);
            const user = new User(response.data);
            localStorage.setItem('token', user.id);
            localStorage.setItem('userName', user.username);

            //add user to lobby
            const putBody = JSON.stringify({givenAccessCode, username});
            await api.put(`/lobbies/${givenAccessCode}/additions/users/${user.id}`, putBody);

            //add user to lobby userList
            lobby.lobbyUsers.push(user);

            //show details
            console.log('user id:', user.id);
            console.log('access code:', givenAccessCode);

            // Login successfully worked --> navigate to the route /game in the GameRouter
            history.push(`/lobbies/${lobby.accessCode}`);

        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
            window.location.reload();
        }
    };

    return (
        <div className="adminLoginRoot">
                <video className="homepageVideo" src={BackgroundVideo} autoPlay loop muted />
                <img className="tabooLogo" src={TabooLogo} alt="Taboo logo"/>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'absolute'
                }}
                >
                    <div className="buttonPanel" style={{height: '245.016px'}}>
                        <Typography variant="h5" sx={{color: 'white', marginBottom: '200px', position: 'absolute'}}>Login</Typography>
                        <TextField className="custom-outlined-text-field"
                                   sx={{marginBottom: '20px', marginTop: '-50px'}}
                                   label='Access Code'
                                   value={givenAccessCode}
                                   onChange={handleAccessCodeChange}
                        >
                        </TextField>
                        <TextField className="custom-outlined-text-field"
                                   sx={{marginBottom: '20px', marginTop: '100px'}}
                                   label='Username'
                                   value={username}
                                   onKeyDown={handleEnterKey}
                                   onChange={handleUsernameChange}
                        >
                        </TextField>
                        <div className="horizontal-box" style={{marginTop: '220px'}}>
                            <Button variant="contained"
                                    className="buttonLogin"
                                    onClick={() => goBack()}
                            >
                                Back
                            </Button>
                            <Button variant="contained"
                                    className="buttonLogin"
                                    onClick={() => doLogin()}
                            >
                                Enter
                            </Button>
                        </div>
                    </div>
                    </Box>
            </div>
    );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default UserLogin;
