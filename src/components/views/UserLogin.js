import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {TextField, Button, Typography, Box} from "@mui/material";
import 'styles/views/AdminLogin.scss';

const UserLogin = () => {
    const history = useHistory();
    const [username, setUsername] = useState(null);

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
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    width: 300,
                    height: 250,
                    backgroundColor: '#D1C4E9',
                    borderRadius: '20px',
                    border: '1px solid white'
                }}
                >
                    <Typography variant="h6" sx={{color: 'white'}}>Login</Typography>
                    <TextField
                            id='outlined-basic'
                            label='Access Code'
                            variant='outlined'
                            InputLabelProps={{style: {color: 'white'}}}
                            InputProps={{style: {color: 'white'}}}
                            sx={{backgroundColor: 'lightgray',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white'
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white'
                                    }
                                }}}>
                    </TextField>
                    <TextField
                            id='outlined-basic-2'
                            label='Username'
                            value={username}
                            onChange={handleUsernameChange}
                            variant='outlined'
                            InputLabelProps={{style: {color: 'white'}}}
                            InputProps={{style: {color: 'white'}}}
                            sx={{marginTop: '10px',
                                backgroundColor: 'lightgray',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white'
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'white'
                                    },
                                }}}>
                    </TextField>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '65%',
                        marginTop: '10px',}}
                    >
                        <Button variant="contained"
                                sx={{backgroundColor: '#8a2be2', color: 'orange', '&:hover': { backgroundColor: '#8a2be2'}, width: '40%'}}
                                onClick={() =>goBack()}
                        >
                            Back
                        </Button>
                        <Button variant="contained"
                                sx={{backgroundColor: '#8a2be2', color: 'orange', '&:hover': { backgroundColor: '#8a2be2'}, width: '40%'}}
                                onClick={() =>doLogin()}
                        >
                            Enter
                        </Button>
                    </Box>
                </Box>
            </div>
    );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default UserLogin;
