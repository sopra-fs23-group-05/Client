import {useEffect, useState} from "react";
import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";
import {api} from "../../../helpers/api";

export const SettingsGuard = (props) => {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const accessCode = localStorage.getItem("lobbyAccessCode");
    useEffect(() => {
        const checkAuthorization = async () => {
            const userId = localStorage.getItem("token");
            const userResponse = await api.get(`/users/${userId}`);
            const isLeader = userResponse.data.leader;
            const url = window.location.href;
            const urlSplit = url.split("/");
            console.log(isLeader);
            if (urlSplit[4] === accessCode && isLeader) {
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
    return isAuthorized ? props.children : <Redirect to={`/lobbies/${accessCode}`}/>;
};

SettingsGuard.propTypes = {
    children: PropTypes.node,
};