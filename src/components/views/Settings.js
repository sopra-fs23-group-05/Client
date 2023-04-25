
import {api} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import 'styles/views/Settings.scss';
import {Container, TextField, Button, Typography, Box} from "@mui/material";
import {useEffect, useState} from "react";


const Settings = props => {
    const history = useHistory();
    
    const [rounds, setRounds] = useState("");
    const [roundTime, setTime] = useState("");
    const [topic, setTopic] = useState("");

    const accessCode = localStorage.getItem('lobbyAccessCode');
    const handleRoundsChange = (event) => {
        setRounds(event.target.value)
    }
    const handleTimeChange = (event) => {
        setTime(event.target.value)
    }
    const handleTopicsChange = async (topics) => {
        setTopic(topics);
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const responseGame = await api.get(`/lobbies/${accessCode}`);
                await new Promise(resolve => setTimeout(resolve, 100));
                setRounds(responseGame.data.settings.rounds);
                setTopic(responseGame.data.settings.topic);
                setTime(responseGame.data.settings.roundTime);

            } catch (error) {
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }


        fetchData()
    }, [accessCode]);
    

      const doSave = async () => {
        console.log(accessCode);      
        const requestBody = JSON.stringify({rounds, topic, roundTime});
        console.log(requestBody);
        const url = "/lobbies/" + accessCode + "/settings";
        console.log(url);
        await api.put(url, requestBody);
      };


    const doBack = () => {
        history.push(`/lobbies/${accessCode}`);
        window.location.reload();
    }

  return (
    <div className="settingsRoot" style={{ overflowY: 'scroll' }}>
    
    <h1 style={{ color: 'white', marginTop:'1250px', marginRight: '150px', fontFamily: 'Inter, sans-serif', fontWeight: '600', fontSize: '40px' }}>Settings</h1>
    <Container sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <Box className="inputBox" sx={{marginTop: '-120px'}}>
        <Typography variant="h6" sx={{color: 'white', mb: 1, fontFamily: 'Inter, sans-serif', fontWeight: '600', fontSize: '24px', textShadow: '2px 2px 4px rgba(0,0,0,0.4)'}}>Number of Rounds</Typography>
        <TextField
            className='textField'
            id='outlined-basic'
            value={rounds}
            onChange={handleRoundsChange}
            variant='outlined'
            InputLabelProps={{ className: 'input' }}
            InputProps={{ className: 'input' }}
        />

        <Box className="saveBox">
            <div></div>
            <Button variant="contained" className="saveButton"
            onClick={() => doSave()}
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
                    value={roundTime}
                    onChange={handleTimeChange}
                    variant='outlined'
                    InputLabelProps={{ className: 'input' }}
                    InputProps={{ className: 'input' }}
                />
                <Box className="saveBox">
                    <div></div>
                    <Button variant="contained" className="saveButton"
                    onClick={() => doSave()}
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
            <Button variant="contained" className="topicsButton" style={{ backgroundColor: '#DB8E56', boxShadow: topic === "ANIMALS" ? "0 0 50px 0 #FFF" : "", margin: '-30px 10px -30px 0px'}}
            onClick={() =>handleTopicsChange("ANIMALS")}
            >
                <h1>
                    Animals
                </h1>
            </Button>

            <Button variant="contained" className='topicsButton' style={{ backgroundColor: '#77DE5D', boxShadow: topic === "SPORTS" ? "0 0 50px 0 #FFF" : "", margin: '-30px 0 -30px 10px'}}
            onClick={() => handleTopicsChange("SPORTS")}
            >
                <h1>
                    Sports
                </h1>
            </Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" className='topicsButton' style={{ backgroundColor: '#EA4848', boxShadow: topic === "MOVIES" ? "0 0 50px 0 #FFF" : "", margin: '-30px 10px -30px 0px'}}
            onClick={() => handleTopicsChange("MOVIES")}
            >
                <h1>
                    Movies
                </h1>
            </Button>
            
            <Button variant="contained" className='topicsButton' style={{ backgroundColor: '#4D7CF3', boxShadow: topic === "COUNTRIES" ? "0 0 50px 0 #FFF" : "", margin: '-30px 0 -30px 10px'}}
            onClick={() => handleTopicsChange("COUNTRIES")}
            >
                <h1>
                    Countries
                </h1>
            </Button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            
            <Button variant="contained" className='topicsButton' style={{ backgroundColor: '#EEF167', boxShadow: topic === "FOOD" ? "0 0 50px 0 #FFF" : "", margin: '-30px 10px -30px 0px'}}
            onClick={() => handleTopicsChange("FOOD")}
            >
                <h1>
                    Food
                </h1>
            </Button>

            <Button variant="contained" className='topicsButton' style={{ backgroundColor: '#F666CE', boxShadow: topic === "MUSIC" ? "0 0 50px 0 #FFF" : "", margin: '-30px 0 -30px 10px'}}
            onClick={() => handleTopicsChange("MUSIC")}
            >
                <h1>
                    Music
                </h1>
            </Button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            
            <Button variant="contained" className='topicsButton' style={{ backgroundColor: '#C660F6', boxShadow: topic === "FAMOUS_PEOPLE" ? "0 0 50px 0 #FFF" : "", margin: '-30px 10px -30px 0px'}}
            onClick={() => handleTopicsChange("FAMOUS_PEOPLE")}
            >
                <h1>
                    Famous People
                </h1>
            </Button>

            <Button variant="contained" className='topicsButton' style={{ backgroundColor: '#C1BACB', boxShadow: topic === "TECHNOLOGY" ? "0 0 50px 0 #FFF" : "", margin: '-30px 0 -30px 10px'}}
            onClick={() => handleTopicsChange("TECHNOLOGY")}
            >
                <h1>
                    Technology
                </h1>
            </Button>
            </div>
        <Button variant="contained" className="backButton"
                onClick={() => doSave()}
        >
            Save
        </Button>
            <Button variant="contained" className="backButton"            
                onClick={() => doBack()}
                >
                Back
            </Button>
            </div>
  );
};

export default Settings;
