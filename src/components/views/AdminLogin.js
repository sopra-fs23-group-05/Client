import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Container, TextField, Button, Typography, Box} from "@mui/material";
import 'styles/views/AdminLogin.scss';
import Team from "../../models/Team";

const AdminLogin = props => {
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
            const isLeader = true;
            const userRequestBody = JSON.stringify({username, isLeader});
            const response = await api.post('/users', userRequestBody);

            // Get the returned user and update a new object.
            const user = new User(response.data);

            // Store the token=id into the local storage.
            localStorage.setItem('token', user.id);

            //create two teams
            const teamsRequestBody = JSON.stringify([]);
            const teamResponse1 = await api.post(`/teams`, teamsRequestBody);
            const team1 = new Team(teamResponse1.data);
            const teamResponse2 = await api.post(`/teams`, teamsRequestBody);
            const team2 = new Team(teamResponse2.data);
            localStorage.setItem('team1Token', team1.token);
            localStorage.setItem('team2Token', team2.token);

            // Login successfully worked --> navigate to the route /lobbies/user.id in the GameRouter
            history.push(`/lobbies/${user.id}`);

        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
    };
    console.log(username)

    return (
            <Container sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    width: '30%',
                    height: 200,
                    backgroundColor: '#D1C4E9',
                    borderRadius: '20px',
                    border: '1px solid white'
                }}
                >
                    <Typography variant="h6" sx={{color: 'white'}}>Login</Typography>
                    <TextField
                            id='outlined-basic'
                            label='Username'
                            value={username}
                            onChange={handleUsernameChange}
                            variant='outlined'
                            InputLabelProps={{style: {color: 'white'}}}
                            InputProps={{style: {color: 'white'}}}
                            sx={{
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
                                    }
                                }
                            }}
                    >
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
                                onClick={() => goBack()}
                        >
                            Back
                        </Button>
                        <Button variant="contained"
                                sx={{backgroundColor: '#8a2be2', color: 'orange', '&:hover': { backgroundColor: '#8a2be2'}, width: '40%'}}
                                onClick={() => doLogin()}
                        >
                            Enter
                        </Button>
                    </Box>
                </Box>
            </Container>
    );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default AdminLogin;
