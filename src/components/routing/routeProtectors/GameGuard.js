import { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { api } from "../../../helpers/api";

export const GameGuard = (props) => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const checkAuthorization = async () => {
      const accessCode = localStorage.getItem("lobbyAccessCode");
      const url = window.location.href;
      const urlSplit = url.split("/");

      if (urlSplit[3] === "games" && urlSplit[4] === accessCode) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    };

    checkAuthorization();
  }, []);

  if (isAuthorized === null) {
    return <p>Loading...</p>;
  }

  return isAuthorized ? props.children : <Redirect to="/homepage" />;
};

GameGuard.propTypes = {
  children: PropTypes.node,
};