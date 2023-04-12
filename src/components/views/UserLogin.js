import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {TextField, Button, Typography, Box} from "@mui/material";
import 'styles/views/AdminLogin.scss';
import TabooLogo from "./TabooLogo.png";

const UserLogin = () => {
    const history = useHistory();
    const [username, setUsername] = useState(null);
    const [accessCode] = useState(null);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }

    const goBack = () => {
        localStorage.removeItem('token');
        history.push('/homepage');
        window.location.reload();
    }

    const doLogin = async () => {
        try {
            const leader = false;
            const requestBody = JSON.stringify({username, leader});
            const response = await api.post('/users', requestBody);

            // Get the returned user and update a new object.
            const user = new User(response.data);

            // Store the token into the local storage.
            localStorage.setItem('token', user.id);

            // Login successfully worked --> navigate to the route /game in the GameRouter
            history.push(`/lobbies/${user.id}`);

        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
    };

    return (
            <div className="homePageRoot">
                <img src={TabooLogo} alt="Taboo logo" style={{maxWidth: "100%", maxHeight: "40%"}} />
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',}}
                >
                    <div className="buttonPanel">
                    <Typography variant="h5" sx={{color: 'white'}}>Login</Typography>
                    <TextField className="custom-outlined-text-field"
                            label='Access Code'
                            value={accessCode}
                            onChange={null} //TODO insert Access Code
                    >
                    </TextField>
                    <TextField className="custom-outlined-text-field"
                            label='Username'
                            value={username}
                            onChange={handleUsernameChange}
                    >
                    </TextField>
                    <div className="horizontal-button-box">
                        <Button variant="contained"
                                className="buttonLogin"
                                onClick={() =>goBack()}
                        >
                            Back
                        </Button>
                        <Button variant="contained"
                                className="buttonLogin"
                                onClick={() =>doLogin()}
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
