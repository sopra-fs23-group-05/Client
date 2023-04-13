import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import 'styles/views/Settings.scss';
import {Container, TextField, Button, Typography, Box} from "@mui/material";


const Settings = props => {
    const history = useHistory();
    
    const [rounds, setRounds] = useState(null);
    const [time, setTime] = useState(null);
    
    const handleRoundsChange = (event) => {
        setRounds(event.target.value)
    }
    const handleTimeChange = (event) => {
        setTime(event.target.value)
    }

    const doBack = () => {
        localStorage.removeItem('token');
        history.push('/lobbies');
        window.location.reload();
    }

  return (
    <div className="settingsRoot" style={{ overflowY: 'scroll' }}>
    
    <h1 style={{ color: 'white', marginTop:'1100px', marginRight: '150px', fontFamily: 'Inter, sans-serif', fontWeight: '600', fontSize: '40px' }}>Settings</h1>
    <Container sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <Box className="inputBox" sx={{marginTop: '-120px'}}>
        <Typography variant="h6" sx={{color: 'white', mb: 1, fontFamily: 'Inter, sans-serif', fontWeight: '600', fontSize: '24px', textShadow: '2px 2px 4px rgba(0,0,0,0.4)'}}>Number of Rounds</Typography>
        <TextField
            className='textField'
            id='outlined-basic'
            label='Enter number...'
            value={rounds}
            onChange={handleRoundsChange}
            variant='outlined'
            InputLabelProps={{ className: 'input' }}
            InputProps={{ className: 'input' }}
        />

        <Box className="saveBox">
            <div></div>
            <Button variant="contained" className="saveButton"
            >
            Save
            </Button>
        </Box>
        </Box>
            </Container>
            <Container sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Box className="inputBox" sx={{marginTop: '-50px'}}>
                <Typography variant="h6" sx={{color: 'white', mb: 1, fontFamily: 'Inter, sans-serif', fontWeight: '600', fontSize: '24px', textShadow: '2px 2px 4px rgba(0,0,0,0.4)'}}>Time Per Round</Typography>
                <TextField
                    className='textField'
                    id='outlined-basic'
                    label='Enter time in seconds...'
                    value={time}
                    onChange={handleTimeChange}
                    variant='outlined'
                    InputLabelProps={{ className: 'input' }}
                    InputProps={{ className: 'input' }}
                />
                <Box className="saveBox">
                    <div></div>
                    <Button variant="contained" className="saveButton"
                    >
                    Save
                    </Button>
                </Box>
                </Box>
            </Container>
            <Button variant="contained" className="backButton"            
                onClick={() => doBack()}
                >
                Back
            </Button>

            <h1 style={{ color: 'white', marginTop:'-50px', marginBottom: '-20px', fontFamily: 'Inter, sans-serif', fontWeight: '600', fontSize: '40px' }}>Topic of Words</h1>


            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" className="topicsButton" style={{ backgroundColor: '#DB8E56', margin: '-30px 10px -30px 0px'}}>
                <h1>
                    Animals
                </h1>
            </Button>

            <Button variant="contained" className='topicsButton' style={{ backgroundColor: '#77DE5D', margin: '-30px 0 -30px 10px'}}>
                <h1>
                    Sports
                </h1>
            </Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" className='topicsButton' style={{ backgroundColor: '#EA4848', margin: '-30px 10px -30px 0px'}}>
                <h1>
                    Movies
                </h1>
            </Button>
            
            <Button variant="contained" className='topicsButton' style={{ backgroundColor: '#4D7CF3', margin: '-30px 0 -30px 10px'}}>
                <h1>
                    Countries
                </h1>
            </Button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            
            <Button variant="contained" className='topicsButton' style={{ backgroundColor: '#EEF167', margin: '-30px 10px -30px 0px'}}>
                <h1>
                    Food
                </h1>
            </Button>

            <Button variant="contained" className='topicsButton' style={{ backgroundColor: '#F666CE', margin: '-30px 0 -30px 10px'}}>
                <h1>
                    Music
                </h1>
            </Button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            
            <Button variant="contained" className='topicsButton' style={{ backgroundColor: '#C660F6', margin: '-30px 10px -30px 0px'}}>
                <h1>
                    Famous People
                </h1>
            </Button>

            <Button variant="contained" className='topicsButton' style={{ backgroundColor: '#C1BACB', margin: '-30px 0 -30px 10px'}}>
                <h1>
                    Technology
                </h1>
            </Button>
            </div>

            <Button variant="contained" className="backButton"            
                onClick={() => doBack()}
                >
                Back
            </Button>
            </div>
  );
};

export default Settings;
