import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import 'styles/views/Settings.scss';
import {Container, TextField, Button, Typography, Box} from "@mui/material";


const Settings = props => {
    const history = useHistory();
    
    const [username, setUsername] = useState(null);
    
    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }

    const doBack = () => {
        localStorage.removeItem('token');
        history.push('/login');
        window.location.reload();
    }

  return (
    <div className="settingsRoot">
                <h1 style={{ color: 'white' }}>Settings</h1>
    <Container sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                width: '100%',
                height: 200,
                backgroundColor: '#D1C4E9',
                borderRadius: '20px',
                border: '1px solid white',
                padding: '20px',
                marginTop: '250px'
                }}
                >
                    <Typography variant="h6" sx={{color: 'white', mb: 1}}>Number of Rounds</Typography>
                    <TextField
                            id='outlined-basic'
                            label='Enter number...'
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
                        marginTop: '40px',
                        marginLeft: '200px'}}
                    >
                        <Button variant="contained"
                                sx={{backgroundColor: '#8a2be2', color: 'orange', '&:hover': { backgroundColor: '#8a2be2'}, width: '40%'}}
                                onClick={() => doBack()}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            </Container>
            <Container sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                width: '100%',
                height: 200,
                backgroundColor: '#D1C4E9',
                borderRadius: '20px',
                border: '1px solid white',
                padding: '20px',
                marginTop: '-70px'
                }}
                >
                    <Typography variant="h6" sx={{color: 'white', mb: 1}}>Time Per Round</Typography>
                    <TextField
                            id='outlined-basic'
                            label='Enter time in seconds...'
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
                        marginTop: '40px',
                        marginLeft: '200px'}}
                    >
                        <Button variant="contained"
                                sx={{backgroundColor: '#8a2be2', color: 'orange', '&:hover': { backgroundColor: '#8a2be2'}, width: '40%'}}
                                onClick={() => doBack()}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            </Container>
            <Button variant="contained"
                sx={{backgroundColor: '#8a2be2', color: 'orange', '&:hover': { backgroundColor: '#8a2be2'}, width: '90%'}}
                onClick={() => doBack()}
                >
                Back
            </Button>

            <h1 style={{ color: 'white' }}>Topic of Words</h1>

            </div>
  );
};

export default Settings;
