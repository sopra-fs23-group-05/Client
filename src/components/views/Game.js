import "styles/views/Game.scss";
import {Box, Divider, Button} from "@mui/material";

const Game = () => {
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

    return (
    <div className="homePageRoot">
      <Box sx={{display: 'flex', flexDirection: 'column'}}>
          <div className="card-and-timer-box">
              <div className="card-box">
                  <div className="side-box">
                      <div>Word</div>
                      <div>Skip</div>
                  </div>
                  <div className="side-box">
                      <div>Taboo 1</div>
                      <div>Taboo 2</div>
                      <div>Taboo 3</div>
                      <div>Taboo 4</div>
                      <div>Taboo 5</div>
                  </div>
              </div>
                  <div className="timer-box">
                      <div>Timer</div>
                      <div>01:45</div>
                      <Divider sx={{color: 'white', border: '1px solid white', width: '80%', marginBottom: '15px', marginTop: '15px'}} />
                      <div>Score</div>
                      <div>4</div>
                  </div>
          </div>
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
                  className="Buzzer"
          >
              Buzzer
          </Button>
      </Box>
    </div>
  );
}

export default Game;
