import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

export const InviteGuard = props => {
    if (localStorage.getItem("token")) {
        return props.children;
    }
    return <Redirect to="/homepage"/>;
};

InviteGuard.propTypes = {
    children: PropTypes.node
};
