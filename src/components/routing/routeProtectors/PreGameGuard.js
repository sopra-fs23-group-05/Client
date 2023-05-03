import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

export const PreGameGuard = props => {
    if (localStorage.getItem("token")) {
        return props.children;
    }
    return <Redirect to="/homepage"/>;
};

PreGameGuard.propTypes = {
    children: PropTypes.node
};
