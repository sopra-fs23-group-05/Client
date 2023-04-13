import React from "react";
import {handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import 'styles/views/Homepage.scss';
import TabooLogo from './TabooLogo.png';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';


const Homepage = props => {
    const history = useHistory();
    const doCreate = () => {
        try{
            history.push(`/admin-login`);
        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
    };
    const doJoin = () => {
        try{
            history.push(`/user-login`);
        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
    };
    const doRules = () => {
        try{
            history.push(`/rules`);
        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
    };

  return (
    <div className="homePageRoot">
      <img src={TabooLogo} alt="Taboo logo" style={{maxWidth: "100%", maxHeight: "40%"}} />
      <Box
      sx={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div className="buttonPanel">
      <Button variant="contained"
        className="button"
        onClick={() =>doCreate()}
        >
        Create Lobby
      </Button>
      <Button variant="contained"
        className="button"
        onClick={() =>doJoin()}
        >
        Join Lobby
      </Button>
      <Button variant="contained"
        className="button"
        onClick={() =>doRules()}
        >
        Rules
      </Button>
      </div>
    </Box>
    </div>
  );
};

export default Homepage;
