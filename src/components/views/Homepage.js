import React from "react";
import {handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import 'styles/views/Homepage.scss';
import TabooLogo from './TabooLogo.png';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';


const Homepage = props => {
    const history = useHistory();
    const buttons = [
      <Button onClick={() => doCreate()} className="button">Create Lobby</Button>,
      <Button onClick={() => doJoin()} className="button">Join Lobby</Button>,
      <Button onClick={() => doRules()} className="button">Rules</Button>,
      ];
    const doCreate = () => {
        try{
            history.push(`/create`);
        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
    };
    const doJoin = () => {
        try{
            history.push(`/join`);
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
        '& > *': {
          m: 1,
        },
      }}
    >
      <ButtonGroup
        className="buttonPanel"
        orientation="vertical"
        aria-label="vertical outlined button group"
      >
        {buttons}
      </ButtonGroup>
    </Box>
    </div>
  );
};

export default Homepage;
