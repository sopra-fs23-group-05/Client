import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

export const EndscreenGuard = props => {
    if (localStorage.getItem("token")) {
        return props.children;
    }
    return <Redirect to="/homepage"/>;
};

EndscreenGuard.propTypes = {
    children: PropTypes.node
};
