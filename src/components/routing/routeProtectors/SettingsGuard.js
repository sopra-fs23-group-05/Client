import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

export const SettingsGuard = props => {
    if (localStorage.getItem("token")) {
        return props.children;
    }
    return <Redirect to="/homepage"/>;
};

SettingsGuard.propTypes = {
    children: PropTypes.node
};
