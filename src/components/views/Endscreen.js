import React from "react";
import {handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import 'styles/views/Endscreen.scss';
import TabooLogo from './TabooLogo.png';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';


const Endscreen = props => {
    const history = useHistory();
    const doHomepage = () => {
        try{
            history.push(`/homepage`);
        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
    };
    

  return (
    <div className="endScreenRoot">
      <img src={TabooLogo} alt="Taboo logo" style={{maxWidth: "100%", maxHeight: "40%"}} />
      <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        marginTop: '-50px'
      }}
    >
      
      <h1 className="h1">YOU PLAYED 7 ROUNDS</h1>
      <h1 className="h1">SCORES</h1>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px', marginBottom: '50px'}}>
      <div className="textPanel" style={{margin: '-30px 20px -30px 50px'}}>
        <h1 className="h1" style={{fontSize: '26px'}}>TEAM 1</h1>
        <h1 className="h1" style={{fontSize: '50px', marginTop: '-45px'}}>10</h1>
      </div>
      <div className="textPanel" style={{margin: '-30px 50px -30px 20px'}}>
      <h1 className="h1" style={{fontSize: '26px'}}>TEAM 2</h1>
      <h1 className="h1" style={{fontSize: '50px', marginTop: '-45px'}}>12</h1>
      </div>
    </div>

    <div></div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '20px'}}>
    <StarIcon style={{ color: '#EA854C', margin: '0 -20 0 75', fontSize: '50px'}} />
    <h1 className="h1" style={{ fontSize: '24px', width: '200px'}}>TEAM 2 WINS!</h1>
    <StarIcon style={{ color: '#EA854C', margin: '0 50 0 -20', fontSize: '50px'}} />
    </div>



    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px'}}>
      <Button variant="contained" style={{width: '150px', height: '60px', margin: '-0px 20px -30px 50px', fontSize: '20px'}}
        className="button"
        onClick={() =>doHomepage()}
        >
        Share
      </Button>
      <Button variant="contained" style={{width: '150px', height: '60px', margin: '-0px 50px -30px 20px', fontSize: '20px'}}
        className="button"
        onClick={() =>doHomepage()}
        >
        Homepage
      </Button>
    </div>

    </Box>
    </div>
  );
};

export default Endscreen;
