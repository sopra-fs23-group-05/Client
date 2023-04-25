import {Box} from "@mui/material";
import 'styles/views/PreGame.scss';
import {useHistory} from 'react-router-dom';
import {useEffect, useState} from "react";
import {api} from "../../helpers/api";


const PreGame = () => {
    const history = useHistory();
    const accessCode = localStorage.getItem('lobbyAccessCode');
    const playerName = localStorage.getItem('userName')
    const [role,setRole] = useState(null);


    let timeLeft = 10;
    const downloadTimer = setInterval(function () {
        if (timeLeft <= 0) {
            history.push(`/games/${accessCode}`);
            clearInterval(downloadTimer);
        } else {
            document.getElementById("countdown").innerHTML = timeLeft;
        }
        timeLeft -= 1;
    }, 1000);


    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get(`/games/${accessCode}/users/${playerName}`);
                await new Promise(resolve => setTimeout(resolve, 100));
                setRole(response.data);

            } catch (error) {
                console.error(`Something went wrong while fetching the users:`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchData();
    }, []);
    return (
        <div className="homePageRoot"
             style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: "100%",}}>
            <Box sx={{
                display: 'flex',
                alignItems: "center",
                justifyContent: 'center',
                flexDirection: 'column',
                width: '100%',
                height: "100%",
                backgroundColor: '#D1C4E9',
                borderRadius: '20px',
                border: '1px solid white'
            }}
            ><h2 className="h2"> round starts in:</h2>
                <div id="countdown" className="countdown"></div>
                <h2 className="h2"> your role:</h2>
                <h2 className="role"> {role}</h2>
            </Box>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                width: '100%',
                height: "100%",
                backgroundColor: '#D1C4E9',
                borderRadius: '20px',
                border: '1px solid white'
            }}
            >
                <h1 className="score">Score</h1>
                <h2 className="team">Team 1:</h2>
                <h2 className="team">Team 2:</h2>
            </Box>
        </div>
    );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default PreGame;
