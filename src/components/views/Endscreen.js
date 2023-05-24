import React, {useCallback, useRef} from "react";
import {useHistory} from 'react-router-dom';
import 'styles/views/Endscreen.scss';
import TabooLogo from './TabooLogo.png';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Button_Click from "./sounds/Button_Click.mp3";
import Winner_Sound from "./sounds/Winner_Sound.mp3";
import {useEffect, useState} from "react";
import {api, handleError} from "../../helpers/api";


const Endscreen = () => {

    const playSound = (soundFile) => {
        const audio = new Audio(soundFile);
        audio.play();
      };

    playSound(Winner_Sound);
    const history = useHistory();
    const canvasRef = useRef(null);
    const userId = localStorage.getItem('token');
    const accessCode = localStorage.getItem('lobbyAccessCode');
    const [team1Points, setTeam1Points] = useState(0);
    const [team2Points, setTeam2Points] = useState(0);
    const [team1Players, setTeam1Players] = useState(null);
    const [team2Players, setTeam2Players] = useState(null);
    const [team1Size, setTeam1Size] = useState(0);
    const [team2Size, setTeam2Size] = useState(0);
    const [roundsPlayed, setRoundsPlayed] = useState("");
    const [winner, setWinner] = useState(0);
    const [MVPPlayer, setMVPPlayer] = useState(null);
    const [leader, setLeader] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorAlertVisible, setErrorAlertVisible] = useState(false);


    const doHomepage = async () => {
        playSound(Button_Click);
        if (leader) {
            await api.delete(`/games/${accessCode}`);
        }
        localStorage.removeItem('token');
        history.push(`/homepage`);
        window.location.reload();
    };


    const doShare = async () => {
        playSound(Button_Click);
        const canvas = canvasRef.current;
        if (!canvas) {
            alert('Could not create screenshot.');
            return;
        }

        const tweetText = `New Taboo Win! Final Score: ${team1Points} | ${team2Points}`;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${`https://sopra-fs23-group-05-client.oa.r.appspot.com/homepage`}&hashtags=Taboo`;

        window.open(tweetUrl, '_blank');
    };

    const calculateWinner = useCallback( ( ) => {
        if(team1Size < 2){
            setWinner(2);
        }
        else if(team2Size < 2){
            setWinner(1);
        }
        else{
            if (team1Points > team2Points) {
                setWinner(1)
            } else if(team1Points < team2Points){
                setWinner(2);
            } else if(team1Points === team2Points){
                setWinner(0);
            }
        }
    }, [team1Points, team2Points, team1Size, team2Size]);

    let MVPInformation = (
        <div style={{marginLeft: '50px'}}>
            <h1 className="h1" style={{color: '#EA854C', marginBottom: '10px'}}>No MVP</h1>
        </div>
    )

    const checkMVPInformation = useCallback( ( ) => {
        if (MVPPlayer !== null) {
            MVPInformation = (
                <div style={{marginLeft: '50px'}}>
                    <h1 className="h1" style={{color: '#EA854C', marginBottom: '10px'}}>{MVPPlayer.name}</h1>
                    <h1 className="h1" style={{fontSize: '19px', textAlign: 'left'}}>Score: {MVPPlayer.personalScore}</h1>
                </div>
            );
        }
    }, [MVPPlayer]);

    useEffect(() => {
        async function fetchData() {
            try {
                const userResponse = await api.get(`/users/${userId}`);
                setLeader(userResponse.data.leader);
                console.log(responsePlayer);

                const responseGame = await api.get(`/games/${accessCode}`);
                await new Promise(resolve => setTimeout(resolve, 100));
                setTeam1Points(responseGame.data.team1.points);
                setTeam2Points(responseGame.data.team2.points);
                setTeam1Size(responseGame.data.team1.players.length);
                setTeam2Size(responseGame.data.team2.players.length);
                setTeam1Players(responseGame.data.team1.players);
                setTeam2Players(responseGame.data.team2.players);
                setRoundsPlayed(responseGame.data.roundsPlayed);

                calculateWinner();

                const responsePlayer = await api.get(`/games/${accessCode}/players/MVP`);
                setMVPPlayer(responsePlayer.data);
                checkMVPInformation();

            } catch (error) {
                setErrorMessage(error);
                setErrorAlertVisible(true);
                setTimeout(() => {
                setErrorAlertVisible(false);
              }, 8000);
            }
        }
        fetchData();
    }, [accessCode, calculateWinner, checkMVPInformation, team1Points, team2Points, team1Size, team2Size, userId]);

    let winnerInformation = "";

    if (winner === 0) {
        winnerInformation = "IT'S A TIE!";
    } else if (winner === 1) {
        winnerInformation = "TEAM 1 WINS!";
    } else if (winner === 2) {
        winnerInformation = "TEAM 2 WINS!";
    }

    return (
            <div className="homePageRoot">
                <div className="flex-container" style={{gap: '5px'}}>
                <img src={TabooLogo} alt="Taboo logo" className="tabooLogo"/>
                    <div className="horizontal-box">
                        <StarIcon style={{color: '#EA854C', margin: '-10 0 0 0', fontSize: '50px'}}/>
                        <h1 className="h1">
                        {winnerInformation}
                        </h1>
                        <StarIcon style={{color: '#EA854C', margin: '-10 0 0 0', fontSize: '50px'}}/>
                    </div>

                    <div className="h1" style={{marginTop: '5px'}}>YOU PLAYED {roundsPlayed} ROUNDS</div>
                    <div className="h1" style={{margin: '20px 15px'}}>SCORES</div>

                    <div className="horizontal-box" style={{gap: '10px'}}>
                        <div className="buttonPanel" style={{height: '25px', gap: '5px'}}>
                            <div className="h1">TEAM 1</div>
                            <div className="h1" style={{fontSize: '40px'}}>{team1Points}</div>
                        </div>
                        <div className="buttonPanel" style={{height: '25px', gap: '5px'}}>
                            <div className="h1">TEAM 2</div>
                            <div className="h1" style={{fontSize: '40px'}}>{team2Points}</div>
                        </div>
                    </div>

                    <div className="horizontal-box" style={{ gap: '10px' }}>
                        <div className="buttonPanel" style={{ height: '129px', padding: '15px', overflow: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                            {team1Players && (
                                <>
                                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th colSpan="2" className="table-title">Team 1 Players</th>
                                            </tr>
                                            <tr>
                                                <th className="table-row" style={{ textAlign: 'left' }}>NAME</th>
                                                <th className="table-row" style={{ textAlign: 'right' }}>SCORE</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {team1Players.map((player, index) => (
                                                <tr key={player.name} style={{ borderBottom: (index !== team1Size - 1) ? '1px solid white' : 'none' }}>
                                                    <td className="table-row" style={{ textAlign: 'left' }}>{player.name}</td>
                                                    <td className="table-row" style={{ textAlign: 'right' }}>{player.personalScore}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </div>

                        <div className="buttonPanel" style={{ height: '129px', padding: '15px', overflow: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                            {team2Players && (
                                <>
                                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th colSpan="2" className="table-title">Team 2 Players</th>
                                            </tr>
                                            <tr>
                                                <th className="table-row" style={{ textAlign: 'left' }}>NAME</th>
                                                <th className="table-row" style={{ textAlign: 'right' }}>SCORE</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {team2Players.map((player, index) => (
                                                <tr key={player.name} style={{ borderBottom: (index !== team2Size - 1) ? '1px solid white' : 'none' }}>
                                                    <td className="table-row" style={{ textAlign: 'left' }}>{player.name}</td>
                                                    <td className="table-row" style={{ textAlign: 'right' }}>{player.personalScore}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </div>
                    </div>


                    <div className="h1" style={{fontSize: '32px', marginTop: '15px'}}>Most Valuable Player</div>
                    <div className="horizontal-box">
                        <EmojiEventsIcon style={{fontSize: '96px', color: '#EA854C'}}/>
                        {MVPInformation}
                    </div>

                    <div className="horizontal-box" style={{gap: '20px'}}>
                        <Button variant="contained"
                                className="button"
                                style={{height: '60px'}}
                                onClick={() => doShare()}
                        >
                            Share
                        </Button>
                        <Button variant="contained"
                                className="button"
                                style={{height: '60px'}}
                                onClick={() => doHomepage()}
                        >
                            Homepage
                        </Button>
                    </div>
                    <canvas ref={canvasRef} style={{display: 'none'}} width={window.innerWidth}
                            height={window.innerHeight}></canvas>

                </div>
                {errorAlertVisible && (
                <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert variant="filled" severity="error">
                    Error: {handleError(errorMessage)}
                </Alert>
                </Stack>
            )}
            </div>
    );
};

export default Endscreen;
