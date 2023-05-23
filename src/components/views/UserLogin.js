import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button, TextField, Typography} from "@mui/material";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import 'styles/views/AdminLogin.scss';
import TabooLogo from "./TabooLogo.png";
import Button_Click from "./sounds/Button_Click.mp3";
import Lobby from "../../models/Lobby";

const UserLogin = () => {
    const history = useHistory();
    const ENTER_KEY_CODE = 13;
    const [username, setUsername] = useState("");
    const leader = false;
    const url = window.location.href;
    const parts = url.split("/");
    var accessCodeURL = parts.pop().toString();
    if (accessCodeURL === 'user-login') {
        accessCodeURL = "";
    }

    const [errorMessage, setErrorMessage] = useState("");
    const [givenAccessCode, setGivenAccessCode] = useState(accessCodeURL);
    const [errorAlertVisible, setErrorAlertVisible] = useState(false); // State for error alert

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }
    const handleAccessCodeChange = (event) => {
        setGivenAccessCode(event.target.value);
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
            setErrorMessage(error);
            setErrorAlertVisible(true); // Show the error alert
            setTimeout(() => {
                setErrorAlertVisible(false); // Hide the error alert after 5 seconds
            }, 5000);
        }
    };

    return (
        <div className="homePageRoot">
            <img className="tabooLogo" src={TabooLogo} alt="Taboo Logo"/>
            <div className="buttonPanel">
                <Typography variant="h5" sx={{color: 'white', marginBottom: '20px'}}>Login</Typography>
                <TextField className="custom-outlined-text-field"
                           sx={{marginBottom: '20px'}}
                           label='Access Code'
                           value={givenAccessCode}
                           onChange={handleAccessCodeChange}
                />
                <TextField className="custom-outlined-text-field"
                           sx={{marginBottom: '20px'}}
                           label='Username'
                           value={username}
                           onKeyDown={handleEnterKey}
                           onChange={handleUsernameChange}
                />
                <div className="horizontal-box">
                    <Button variant="contained"
                            className="buttonLogin"
                            onClick={() => goBack()}
                    >
                        Back
                    </Button>
                    <Button variant="contained"
                            className="buttonLogin"
                            onClick={() => doLogin()}
                            disabled={username === '' || givenAccessCode === ''}
                    >
                        Enter
                    </Button>
                </div>
            </div>
            {errorAlertVisible && ( // Render the alert if errorAlertVisible is true
                <Stack sx={{width: '100%'}} spacing={2}>
                    <Alert variant="filled" severity="error">
                        Something went wrong during the login: {handleError(errorMessage)}
                    </Alert>
                </Stack>
            )}
        </div>
    );
};

export default UserLogin;
