import React from "react";
import { handleError } from "helpers/api";
import { useHistory } from "react-router-dom";
import "styles/views/Homepage.scss";
import TabooLogo from "./TabooLogo.png";
import Button_Click from "./sounds/Button_Click.mp3";
import BackgroundVideo from "./BackgroundVideo.mp4";
import Button from "@mui/material/Button";

const Homepage = () => {
  const history = useHistory();

  const playSound = (soundFile) => {
    const audio = new Audio(soundFile);
    audio.play();
  };

  const doCreate = () => {
    try {
      playSound(Button_Click);
      history.push(`/admin-login`);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  const doJoin = () => {
    try {
      playSound(Button_Click);
      history.push(`/user-login`);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  const doRules = () => {
    try {
      playSound(Button_Click);
      history.push(`/rules`);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  return (
    <div className="homePageRoot">
      <div className="overlay"></div>
      <video className="backgroundVideo" src={BackgroundVideo} autoPlay loop muted />
      <img
        className="tabooLogo"
        src={TabooLogo}
        style={{ marginBottom: "-30px", marginTop: "30px"}}
        alt="Taboo Logo"
      />
      <div className="buttonPanel">
        <Button
          variant="contained"
          className="button"
          onClick={() => doCreate()}
        >
          Create Lobby
        </Button>
        <Button variant="contained" className="button" onClick={() => doJoin()}>
          Join Lobby
        </Button>
        <Button
          variant="contained"
          className="button"
          onClick={() => doRules()}
        >
          Rules
        </Button>
      </div>
    </div>
  );
};

export default Homepage;
