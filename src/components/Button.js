import React from "react";
import "./components.css"
import PropTypes from "prop-types";
import cancelIcon from "../assets/cancel.svg"
class Button extends React.Component {
    
    render() {
        //const className = "button";
        return (
                <button className={"line-button"} onClick={this.props.clickHandler}> 
                <img width={17} src={cancelIcon} alt=""/>
                </button>
        );
    }
};

Button.propTypes = {
    name: PropTypes.string,
    //clickHandler: PropTypes.func,
};
export default Button;