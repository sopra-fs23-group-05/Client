import {api} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import 'styles/views/Settings.scss';
import {Container, Button, Typography, Box, Slider} from "@mui/material";
import {useEffect, useState, useRef} from "react";
import Button_Click from "./sounds/Button_Click.mp3";
import BackgroundVideo from "./BackgroundVideo.mp4";


const Settings = () => {
    const history = useHistory();

    const [rounds, setRounds] = useState(3);
    const [roundTime, setTime] = useState(null);
    const [topic, setTopic] = useState("");
    const sliderRoundsValueRef = useRef(rounds);
    const sliderTimeValueRef = useRef(roundTime);

    const accessCode = localStorage.getItem('lobbyAccessCode');

    useEffect(() => {
        const newValue = sliderRoundsValueRef.current;
        if (!isNaN(newValue)) {
          doSave();
        }
      }, [sliderRoundsValueRef.current]);


      useEffect(() => {
        const newValue = sliderTimeValueRef.current;
        if (!isNaN(newValue)) {
          doSave();
        }
      }, [sliderTimeValueRef.current]);



      const handleRoundsChange = (event, newValue) => {
        sliderRoundsValueRef.current = newValue; // Update the ref value
        setRounds(newValue);
      };
    const handleTimeChange = (event, newValue) => {
        sliderTimeValueRef.current = newValue;
        setTime(newValue);
    }
    const handleTopicsChange = async (topics) => {
        setTopic(topics);
        doSave();
    }

    const playSound = (soundFile) => {
        const audio = new Audio(soundFile);
        audio.play();
      };

    useEffect(() => {
        async function fetchData() {
            try {
                const responseGame = await api.get(`/lobbies/${accessCode}`);
                await new Promise(resolve => setTimeout(resolve, 100));
                setRounds(responseGame.data.settings.rounds);
                setTopic(responseGame.data.settings.topic);
                setTime(responseGame.data.settings.roundTime);
                console.log(responseGame.data.settings.rounds);

            } catch (error) {
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }


        fetchData()
    }, [accessCode]);


    const doSave = async () => {
        playSound(Button_Click);
        const requestBody = JSON.stringify({rounds, topic, roundTime});
        const url = "/lobbies/" + accessCode + "/settings";
        await api.put(url, requestBody);
    };


    const doBack = () => {
        playSound(Button_Click);
        history.push(`/lobbies/${accessCode}`);
    }

    return (
            <div className="settingsRoot" style={{overflowY: 'scroll'}}>
                <video className="homepageVideo" src={BackgroundVideo} autoPlay loop muted />
                <h1 className="settings-title">Settings</h1>

                <Container className="settings-container">
                    <Box className="inputBox" sx={{marginTop: '-115px'}}>
                        <Typography variant="h6" className="typography">Number of Rounds</Typography>
                        <Slider
                                value={rounds}
                                min={3}
                                max={20}
                                valueLabelDisplay="auto"
                                aria-label="Small"
                                onChange={handleRoundsChange}
                                ref={sliderRoundsValueRef}
                                sx={{
                                    color: '#7f5dab'
                                }}
                        />

                        <Box className="saveBox">
                            <div></div>
                        </Box>
                    </Box>
                </Container>

                <Container className="settings-container">
                    <Box className="inputBox" sx={{marginTop: '-85px'}}>
                        <Typography variant="h6" className="typography">Time Per Round</Typography>

                        <Slider
                                value={roundTime}
                                min={30}
                                max={180}
                                step={5}
                                valueLabelDisplay="auto"
                                aria-label="Small"
                                onChange={handleTimeChange}
                                ref={sliderTimeValueRef}
                                sx={{
                                    color: '#7f5dab'
                                }}
                        />

                        <Box className="saveBox">
                            <div></div>
                        </Box>
                    </Box>
                </Container>

                <Button variant="contained"
                        className="backButton"
                        style={{marginTop: '-80px'}}
                        onClick={() => doBack()}
                >
                    Back
                </Button>

                <h1 className="settings-title" style={{fontSize: '38px', marginTop: '-50px', marginRight: '0px'}}>Topic of Words</h1>

                <div className="topic-row" style={{marginTop: '-70px'}}>
                    <Button variant="contained"
                            className="left-topicsButton"
                            style={{backgroundColor: '#d68042', boxShadow: topic === "ANIMALS" ? "0 0 50px 0 #FFF" : ""}}
                            onMouseDown={() => handleTopicsChange("ANIMALS")}
                            onMouseUp={() => handleTopicsChange("ANIMALS")}

                    >
                        <h1>
                            Animals
                        </h1>
                    </Button>

                    <Button variant="contained"
                            className='right-topicsButton'
                            style={{backgroundColor: '#EA4848', boxShadow: topic === "CARS" ? "0 0 50px 0 #FFF" : "",}}
                            onMouseDown={() => handleTopicsChange("CARS")}
                            onMouseUp={() => handleTopicsChange("CARS")}
                    >
                        <h1>
                            Cars
                        </h1>
                    </Button>
                </div>

                <div className="topic-row">
                    <Button variant="contained"
                            className='left-topicsButton'
                            style={{backgroundColor: '#e5e833', boxShadow: topic === "CITY" ? "0 0 50px 0 #FFF" : ""}}
                            onMouseDown={() => handleTopicsChange("CITY")}
                            onMouseUp={() => handleTopicsChange("CITY")}
                    >
                        <h1>
                            Cities
                            /Countries
                        </h1>
                    </Button>

                    <Button variant="contained"
                            className='right-topicsButton'
                            style={{backgroundColor: '#ff8b26', boxShadow: topic === "FOOD" ? "0 0 50px 0 #FFF" : ""}}
                            onMouseDown={() => handleTopicsChange("FOOD")}
                            onMouseUp={() => handleTopicsChange("FOOD")}
                    >
                        <h1>
                            Food
                        </h1>
                    </Button>
                </div>

                <div className="topic-row">
                    <Button variant="contained"
                            className='left-topicsButton'
                            style={{backgroundColor: '#4D7CF3', boxShadow: topic === "PEOPLE" ? "0 0 50px 0 #FFF" : ""}}
                            onMouseDown={() => handleTopicsChange("PEOPLE")}
                            onMouseUp={() => handleTopicsChange("PEOPLE")}
                    >
                        <h1>
                            Famous People
                        </h1>
                    </Button>
                    <Button variant="contained"
                            className='right-topicsButton'
                            style={{backgroundColor: '#C660F6', boxShadow: topic === "THINGS" ? "0 0 50px 0 #FFF" : ""}}
                            onMouseDown={() => handleTopicsChange("THINGS")}
                            onMouseUp={() => handleTopicsChange("THINGS")}
                    >
                        <h1>
                            Home Goods
                        </h1>
                    </Button>
                </div>

                <div className="topic-row">
                    <Button variant="contained"
                            className='left-topicsButton'
                            style={{backgroundColor: '#a32a49', boxShadow: topic === "LITERATURE" ? "0 0 50px 0 #FFF" : ""}}
                            onMouseDown={() => handleTopicsChange("LITERATURE")}
                            onMouseUp={() => handleTopicsChange("LITERATURE")}
                    >
                        <h1>
                            Literature
                        </h1>
                    </Button>

                    <Button variant="contained"
                            className='right-topicsButton'
                            style={{backgroundColor: '#69db4d', boxShadow: topic === "SPORTS" ? "0 0 50px 0 #FFF" : ""}}
                            onMouseDown={() => handleTopicsChange("SPORTS")}
                            onMouseUp={() => handleTopicsChange("SPORTS")}
                    >
                        <h1>
                            Sports
                        </h1>
                    </Button>
                </div>

                <div className="topic-row">
                    <Button variant="contained"
                            className='left-topicsButton'
                            style={{backgroundColor: '#C1BACB', boxShadow: topic === "TV" ? "0 0 50px 0 #FFF" : ""}}
                            onMouseDown={() => handleTopicsChange("TV")}
                            onMouseUp={() => handleTopicsChange("TV")}
                    >
                        <h1>
                            TV
                        </h1>
                    </Button>


                    <Button variant="contained"
                            className='right-topicsButton'
                            style={{backgroundColor: '#42dbdb', boxShadow: topic === "WEB" ? "0 0 50px 0 #FFF" : ""}}
                            onMouseDown={() => handleTopicsChange("WEB")}
                            onMouseUp={() => handleTopicsChange("WEB")}
                    >
                        <h1>
                            Web
                        </h1>
                    </Button>
                </div>

                <Button variant="contained"
                        className="backButton"
                        style={{marginTop: '-40px'}}
                        onClick={() => doBack()}
                >
                    Back
                </Button>
            </div>
    );
};

export default Settings;