import React from "react";
import { useHistory } from "react-router-dom";
import "styles/views/Homepage.scss";
import TabooLogo from "./TabooLogo.png";
import Button_Click from "./sounds/Button_Click.mp3";
import Button from "@mui/material/Button";

const Homepage = () => {
  const history = useHistory();

  const playSound = (soundFile) => {
    const audio = new Audio(soundFile);
    audio.play();
  };

  const doCreate = () => {
      playSound(Button_Click);
      history.push(`/admin-login`);
  };

  const doJoin = () => {
      playSound(Button_Click);
      history.push(`/user-login`);
  };

  const doRules = () => {
      playSound(Button_Click);
      history.push(`/rules`);
  };

  return (
    <div className="homePageRoot">
      <img
        className="tabooLogo"
        src={TabooLogo}
        style={{ marginBottom: "-30px" }}
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
