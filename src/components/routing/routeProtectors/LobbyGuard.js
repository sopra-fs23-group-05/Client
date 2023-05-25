import {useEffect, useState} from "react";
import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

export const LobbyGuard = (props) => {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        const checkAuthorization = async () => {
            const accessCode = localStorage.getItem("lobbyAccessCode");
            const url = window.location.href;
            const urlSplit = url.split("/");
            console.log(urlSplit[3]);
            if (urlSplit[4] === accessCode) {
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
    return isAuthorized ? props.children : <Redirect to="/homepage"/>;
};

LobbyGuard.propTypes = {
    children: PropTypes.node,
};