import React, {useRef} from "react";
import {useHistory} from 'react-router-dom';
import 'styles/views/Endscreen.scss';
import TabooLogo from './TabooLogo.png';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import {useEffect, useState} from "react";
import {api} from "../../helpers/api";


const Endscreen = () => {
    const history = useHistory();
    const canvasRef = useRef(null);

    const accessCode = localStorage.getItem('lobbyAccessCode');
    const [team1Points, setTeam1Points] = useState(null);
    const [team2Points, setTeam2Points] = useState(null);
    const [team1Players, setTeam1Players] = useState(null);
    const [team2Players, setTeam2Players] = useState(null);
    const [roundsPlayed, setRoundsPlayed] = useState("");
    const [winner, setWinner] = useState("");
    const [MVPPlayer, setMVPPlayer] = useState("");
    const [leader, setLeader] = useState(false);


    const doHomepage = async () => {
        if (leader) {
            await api.delete(`/games/${accessCode}`);
        }
        localStorage.removeItem('token');
        history.push(`/homepage`);
        window.location.reload();
    };

    const doShare = async () => {
        const canvas = canvasRef.current;
        if (!canvas) {
            alert('Could not create screenshot.');
            return;
        }

        const dataUrl = canvas.toDataURL();
        const uploadUrl = 'https://api.imgur.com/3/image';
        const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                Authorization: 'Client-ID <your-client-id>',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: dataUrl.replace('data:image/png;base64,', ''),
        });
        const json = await response.json();
        const imageUrl = json.data.link;
        const tweetText = `New Taboo Win! Final Score: ${team1Points} | ${team2Points}`;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${`https://sopra-fs23-group-05-client.oa.r.appspot.com/homepage`}&hashtags=Taboo&media=${encodeURIComponent(imageUrl)}`;

        window.open(tweetUrl, '_blank');
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const responseGame = await api.get(`/games/${accessCode}`);
                await new Promise(resolve => setTimeout(resolve, 100));
                setTeam1Points(responseGame.data.team1.points);
                setTeam2Points(responseGame.data.team2.points);
                setTeam1Players(responseGame.data.team1.players);
                setTeam2Players(responseGame.data.team2.players);
                setRoundsPlayed(responseGame.data.roundsPlayed);
                const userId = localStorage.getItem('token');
                const userResponse = await api.get(`/users/${userId}`);
                setLeader(userResponse.data.leader);
                if (team1Points > team2Points) {
                    setWinner(1)
                } else {
                    setWinner(2);
                }
                const responsePlayer = await api.get(`/games/${accessCode}/players/MVP`);
                console.log(responsePlayer);
                setMVPPlayer(responsePlayer.data);


            } catch (error) {
                console.error(`Something went wrong while fetching the users:`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }


        fetchData();
    }, [accessCode, team1Points, team2Points]);



    return (
            <div className="endScreenRoot">
                <img src={TabooLogo} alt="Taboo logo" style={{maxWidth: "100%", maxHeight: "40%"}}/>
                <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginTop: '-50px'
                        }}
                >
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px'}}>
                        <StarIcon style={{color: '#EA854C', margin: '0 -20 0 75', fontSize: '50px'}}/>
                        <h1 className="h1" style={{fontSize: '24px', width: '200px'}}>TEAM {winner} WINS!</h1>
                        <StarIcon style={{color: '#EA854C', margin: '0 75 0 -20', fontSize: '50px'}}/>
                    </div>

                    <h1 className="h1">YOU PLAYED {roundsPlayed} ROUNDS</h1>

                    <h1 className="h1">SCORES</h1>

                    
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '50px',
                        marginBottom: '50px'
                    }}>
                        <div className="textPanel" style={{margin: '-30px 20px -30px 80px', display: 'flex', flexDirection: 'column'}}>
                            <h1 className="h1" style={{fontSize: '26px'}}>TEAM 1</h1>
                            <h1 className="h1" style={{fontSize: '50px', marginTop: '-45px'}}>{team1Points}</h1>
                        </div>
                        <div className="textPanel" style={{margin: '-30px 80px -30px 20px'}}>
                            <h1 className="h1" style={{fontSize: '26px'}}>TEAM 2</h1>
                            <h1 className="h1" style={{fontSize: '50px', marginTop: '-45px'}}>{team2Points}</h1>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '50px',
                        marginBottom: '50px'
                    }}>

                    <div className="textPanel" style={{margin: '-30px 20px -30px 80px', width: '200px', display: 'flex', flexDirection: 'column', height: 'auto'}}>
                        {team1Players && (
                            <>
                                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                    <thead>
                                        <tr>
                                        <th colSpan="2" style={{ textAlign: 'center', color: 'white' }}>Team 1 Players</th>
                                        </tr>
                                        <tr>
                                            <th style={{ textAlign: 'left', borderBottom: '1px solid white', padding: '5px', color: 'white' }}>NAME</th>
                                            <th style={{ textAlign: 'right', borderBottom: '1px solid white', padding: '5px', color: 'white' }}>SCORE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {team1Players.map((player, index) => (
                                            <tr key={player.name} style={{ borderBottom: (index !== team1Players.length - 1) ? '1px solid white' : 'none' }}>
                                                <td style={{ textAlign: 'left', padding: '5px', color: 'white' }}>{player.name}</td>
                                                <td style={{ textAlign: 'right', padding: '5px', color: 'white' }}>{player.personalScore}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>


                    <div className="textPanel" style={{margin: '-30px 80px -30px 20px', width: '200px', display: 'flex', flexDirection: 'column', height: 'auto'}}>
                        {team2Players && (
                            <>
                                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                    <thead>
                                        <tr>
                                        <th colSpan="2" style={{ textAlign: 'center', color: 'white' }}>Team 2 Players</th>
                                        </tr>
                                        <tr>
                                            <th style={{ textAlign: 'left', borderBottom: '1px solid white', padding: '5px', color: 'white' }}>NAME</th>
                                            <th style={{ textAlign: 'right', borderBottom: '1px solid white', padding: '5px', color: 'white' }}>SCORE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {team2Players.map((player, index) => (
                                            <tr key={player.name} style={{ borderBottom: (index !== team2Players.length - 1) ? '1px solid white' : 'none' }}>
                                                <td style={{ textAlign: 'left', padding: '5px', color: 'white' }}>{player.name}</td>
                                                <td style={{ textAlign: 'right', padding: '5px', color: 'white' }}>{player.personalScore}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                        </div>
                    </div>

                    <h1 className="h1" style={{fontSize: '32px', fontWeight: 'bold', color: 'white', marginTop: '50px', marginBottom: '10px'}}>Most Valuable Player</h1>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: '50px', marginBottom: '50px'}}>
                        <EmojiEventsIcon style={{fontSize: '96px', color: '#EA854C'}}/>
                        <div style={{marginLeft: '50px'}}>
                        <h1 className="h1" style={{fontSize: '24px', fontWeight: 'bold', color: '#EA854C', marginBottom: '10px', textAlign: 'left'}}>{MVPPlayer.name}</h1>
                        <h1 className="h1" style={{fontSize: '18px', color: 'white', marginBottom: '10px', textAlign: 'left'}}>Score: {MVPPlayer.personalScore}</h1>
                        </div>
                    </div>

                    <div></div>


                    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '50px'}}>
                        <Button variant="contained" style={{
                            width: '150px',
                            height: '60px',
                            margin: '-0px 20px -30px 100px',
                            fontSize: '20px'
                        }}
                                className="button"
                                onClick={() => doShare()}
                        >
                            Share
                        </Button>
                        <Button variant="contained" style={{
                            width: '150px',
                            height: '60px',
                            margin: '-0px 100px -30px 20px',
                            fontSize: '20px'
                        }}
                                className="button"
                                onClick={() => doHomepage()}
                        >
                            Homepage
                        </Button>
                    </div>
                    <canvas ref={canvasRef} style={{display: 'none'}} width={window.innerWidth}
                            height={window.innerHeight}></canvas>

                </Box>
            </div>
    );
};

export default Endscreen;
