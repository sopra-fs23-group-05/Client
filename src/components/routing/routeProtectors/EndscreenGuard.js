import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

export const EndscreenGuard = props => {
    const accessCode = localStorage.getItem('lobbyAccessCode');

    const url = window.location.href;
    const urlSplit = url.split("/");

    if (urlSplit[3] === "games" && urlSplit[4] === accessCode) {
        return props.children;
    }
    return <Redirect to="/homepage"/>;
};

EndscreenGuard.propTypes = {
    children: PropTypes.node
};
