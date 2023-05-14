import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {TextField, Button, Typography, Box} from "@mui/material";
import 'styles/views/AdminLogin.scss';
import Lobby from "../../models/Lobby";
import TabooLogo from "./TabooLogo.png";


const AdminLogin = () => {
    const history = useHistory();
    const [username, setUsername] = useState("");
    const leader = true;
    const ENTER_KEY_CODE = 13;

    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }

    const goBack = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('lobbyAccessCode');
        history.push('/homepage');
        window.location.reload();
    }

    const handleEnterKey = (event) => {
        if (event.keyCode === ENTER_KEY_CODE) {
            doLogin();
        }
    }
    const doLogin = async () => {
        try {
            //create user
            const userRequestBody = JSON.stringify({username, leader});
            const response = await api.post('/users', userRequestBody);

            // Get the returned user and update a new object.
            const user = new User(response.data);
            setUsername(user.username)

            console.log(user);

            // Store the token=id into the local storage.
            localStorage.setItem('token', user.id);
            localStorage.setItem('userName', user.username);

            //post lobby
            const lobbyEmpty = await api.post(`/lobbies`);

            //create lobby object
            const lobby = new Lobby(lobbyEmpty.data);

            console.log(lobby);
            const accessCode = lobby.accessCode;


            //add user to lobby
            await api.put(`/lobbies/${accessCode}/additions/users/${user.id}`);

            //add user to lobby userList
            lobby.lobbyUsers.push(user);

            console.log('current state of lobby:', lobby);

            localStorage.setItem('lobbyAccessCode', accessCode.toString());
            console.log('access code when login:', accessCode);

            // Login successfully worked --> navigate to the route /lobbies/lobby.accessCode in the GameRouter
            history.push(`/lobbies/${lobby.accessCode}`);

        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
            window.location.reload();
        }
    };


    return (
            <div className="homePageRoot">
                <img src={TabooLogo} alt="Taboo logo" style={{maxWidth: "100%", maxHeight: "40%"}}/>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
                >
                    <div className="buttonPanel">
                        <Typography variant="h5" sx={{color: 'white'}}>Login</Typography>
                        <TextField className="custom-outlined-text-field"
                                   label='Username'
                                   value={username}
                                   onKeyDown={handleEnterKey}
                                   onChange={handleUsernameChange}>
                        </TextField>
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
export default AdminLogin;
