import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {TextField, Button, Typography, Box} from "@mui/material";
import 'styles/views/PreGame.scss';


const PreGame = () => {
  const history = useHistory();
  const [username, setUsername] = useState(null);

  let timeLeft = 10;
  const downloadTimer = setInterval(function(){
    if(timeLeft <= 0){
      clearInterval(downloadTimer);
      document.getElementById("countdown").innerHTML = "push to game";
      //history.push("/game");
    } else {
      document.getElementById("countdown").innerHTML = timeLeft;
    }
    timeLeft -= 1;
  }, 1000);



  return (
      <div className="homePageRoot">
        <Box sx={{
          display: 'flex',
          alignItems: "center",
          justifyContent: 'center',
          flexDirection: 'column',
          width: '30%',
          height: 200,
          backgroundColor: '#D1C4E9',
          borderRadius: '20px',
          border: '1px solid white'
        }}
        ><h2> round starts in:</h2>
          <div id="countdown"></div>
          <h2> your role:</h2>
          <h2>  xx</h2>
        </Box>
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
            <h1>Score</h1>
            <h2>Team 1:</h2>
            <h2>Team 2:</h2>
        </Box>
      </div>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default PreGame;
