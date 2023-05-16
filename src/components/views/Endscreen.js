import React, {useRef} from "react";
import {useHistory} from 'react-router-dom';
import 'styles/views/Endscreen.scss';
import TabooLogo from './TabooLogo.png';
import Button from '@mui/material/Button';
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
                } else if(team1Points < team2Points){
                    setWinner(2);
                }
                else{
                    if(team1Players.length < 2){
                        setWinner(2);
                    }
                    else if(team2Players.length < 2){
                        setWinner(1);
                    }
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
            <div className="homePageRoot">
                <div className="flex-container">
                <img src={TabooLogo} alt="Taboo logo" className="tabooLogo"/>
                    <div className="horizontal-box">
                        <StarIcon style={{color: '#EA854C', margin: '-10 0 0 0', fontSize: '50px'}}/>
                        <h1 className="h1">TEAM {winner} WINS!</h1>
                        <StarIcon style={{color: '#EA854C', margin: '-10 0 0 0', fontSize: '50px'}}/>
                    </div>

                    <h1 className="h1">YOU PLAYED {roundsPlayed} ROUNDS</h1>
                    <h1 className="h1">SCORES</h1>

                    <div className="horizontal-box" style={{gap: '10px'}}>
                        <div className="buttonPanel" style={{height: '80px'}}>
                            <h1 className="h1">TEAM 1</h1>
                            <h1 className="h1" style={{fontSize: '40px'}}>{team1Points}</h1>
                        </div>
                        <div className="buttonPanel" style={{height: '80px'}}>
                            <h1 className="h1">TEAM 2</h1>
                            <h1 className="h1" style={{fontSize: '40px'}}>{team2Points}</h1>
                        </div>
                    </div>

                    <div className="horizontal-box" style={{gap: '10px'}}>

                            <div className="buttonPanel" style={{height: 'auto', padding: '15px'}}>
                                {team1Players && (
                                    <>
                                        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                            <thead>
                                                <tr>
                                                <th colSpan="2" className="table-title">Team 1 Players</th>
                                                </tr>
                                                <br/>
                                                <tr>
                                                    <th className="table-row" style={{ textAlign: 'left' }}>NAME</th>
                                                    <th className="table-row" style={{ textAlign: 'right' }}>SCORE</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {team1Players.map((player, index) => (
                                                    <tr key={player.name} style={{ borderBottom: (index !== team1Players.length - 1) ? '1px solid white' : 'none' }}>
                                                        <td className="table-row" style={{ textAlign: 'left' }}>{player.name}</td>
                                                        <td className="table-row" style={{ textAlign: 'right' }}>{player.personalScore}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                )}
                            </div>


                        <div className="buttonPanel" style={{height: 'auto', padding: '15px'}}>
                            {team2Players && (
                                <>
                                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                        <thead>
                                            <tr>
                                            <th colSpan="2" className="table-title">Team 2 Players</th>
                                            </tr>
                                            <br/>
                                            <tr>
                                                <th className="table-row" style={{ textAlign: 'left' }}>NAME</th>
                                                <th className="table-row" style={{ textAlign: 'right' }}>SCORE</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {team2Players.map((player, index) => (
                                                <tr key={player.name} style={{ borderBottom: (index !== team2Players.length - 1) ? '1px solid white' : 'none' }}>
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

                    <h1 className="h1" style={{fontSize: '32px'}}>Most Valuable Player</h1>
                    <div className="horizontal-box">
                        <EmojiEventsIcon style={{fontSize: '96px', color: '#EA854C'}}/>
                        <div style={{marginLeft: '50px'}}>
                        <h1 className="h1" style={{color: '#EA854C', marginBottom: '10px'}}>{MVPPlayer.name}</h1>
                        <h1 className="h1" style={{fontSize: '19px', textAlign: 'left'}}>Score: {MVPPlayer.personalScore}</h1>
                        </div>
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
            </div>
    );
};

export default Endscreen;
