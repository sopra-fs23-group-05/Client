import React from "react";
import {handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import 'styles/views/Homepage.scss';
import {Button} from 'components/ui/Button';
import TabooLogo from './TabooLogo.png';


const Homepage = props => {
    const history = useHistory();
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
      <div className="buttonPanel">
        <Button className="button"
          onClick={() => doCreate()}
          >
          Create Lobby
        </Button>
        <Button className="button"
          onClick={() => doJoin()}
          >
          Join Lobby
        </Button>
        <Button className="button"
          onClick={() => doRules()}
          >
          Rules
        </Button>
      </div>
    </div>
  );
};

export default Homepage;
