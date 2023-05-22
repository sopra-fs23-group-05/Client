import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";
import {api} from "../../../helpers/api";

export const LobbyGuard =  props => {
    const accessCode = localStorage.getItem('lobbyAccessCode');

    const url = window.location.href;
    const urlSplit = url.split("/");

    if (urlSplit[3] === "lobbies" && urlSplit[4] === accessCode) {
        return props.children;
    }

    return <Redirect to="/homepage"/>;
};

LobbyGuard.propTypes = {
    children: PropTypes.node
};
