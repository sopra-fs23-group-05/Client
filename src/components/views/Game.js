import React from 'react';
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import {Box, Divider, Button, Typography} from "@mui/material";

const Player = ({user}) => (
  <div className="player container">
    <div className="player username">{user.username}</div>
    <div className="player name">{user.name}</div>
    <div className="player id">id: {user.id}</div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object
};

const Game = () => {
  //const logout = () => {}
  // use react-router-dom's hook to access the history
  //const history = useHistory();

  /*
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('/users');
        await new Promise(resolve => setTimeout(resolve, 1000));

        setUsers(response.data);

        // This is just some data for you to see what is available.
        // Feel free to remove it.
        console.log('request to:', response.request.responseURL);
        console.log('status code:', response.status);
        console.log('status text:', response.statusText);
        console.log('requested data:', response.data);

        // See here to get more data.
        console.log(response);
      } catch (error) {
        console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the users! See the console for details.");
      }
    }

    fetchData();
  }, []);*/


  /*content = (
            <div className="game">
                <ul className="game user-list">
                </ul>
                <Button
                        width="100%"
                        onClick={() => logout()}
                >
                    Logout
                </Button>
            </div>
    );*/

  return (
    <div className="homePageRoot">
      <Box sx={{display: 'flex', flexDirection: 'column', width: '50%'}}>
          <Box sx={{display: 'flex', flexDirection: 'row'}}>
              <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  width: '100%',
                  height: 200,
                  backgroundColor: '#D1C4E9',
                  borderRadius: '20px',
                  border: '1px solid white'}}
              >
                  <Typography variant="h6" sx={{color: 'white', marginLeft: '20px'}}>Word</Typography>
                  <Box sx={{display: 'flex', flexDirection: 'column', marginLeft: '20px', marginRight: '20px'}}>
                      <Typography variant="h6" sx={{color: 'white'}}>Taboo 1</Typography>
                      <Typography variant="h6" sx={{color: 'white'}}>Taboo 2</Typography>
                      <Typography variant="h6" sx={{color: 'white'}}>Taboo 3</Typography>
                      <Typography variant="h6" sx={{color: 'white'}}>Taboo 4</Typography>
                      <Typography variant="h6" sx={{color: 'white'}}>Taboo 5</Typography>

                  </Box>
              </Box>
                  <Box sx={{display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      width: '100%',
                      height: 200,
                      backgroundColor: '#D1C4E9',
                      borderRadius: '20px',
                      border: '1px solid white',
                      marginLeft: '20px'
                  }}>
                      <Typography variant="h6" sx={{color: 'white'}}>Timer</Typography>
                      <Divider sx={{color: 'white', border: '1px solid white', width: '20%', marginBottom: '30px', marginTop: '30px'}} />
                      <Typography variant="h6" sx={{color: 'white'}}>Score</Typography>
                  </Box>
          </Box>
          <Box sx={{display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              width: '100%',
              height: 300,
              backgroundColor: '#D1C4E9',
              borderRadius: '20px',
              border: '1px solid white',
              marginTop: '20px',
              marginBottom: '20px'}}>
          </Box>
          <Button variant="contained"
                  sx={{backgroundColor: 'red',
                      color: 'black',
                      '&:hover': { backgroundColor: 'darkred'},
                      width: '100%',
                      fontWeight: 'bold',
                      fontSize: '1.5rem'}}
          >
              Buzzer
          </Button>
      </Box>
    </div>
  );
}

export default Game;
