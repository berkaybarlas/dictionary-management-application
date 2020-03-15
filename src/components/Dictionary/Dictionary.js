import React, { Component } from 'react';
import './Dictionary.css';
import "./../components.css"
import Button from "../Button"
class Dictionary extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleRemoveClick = this.handleRemoveClick.bind(this);
    }

    handleClick = () => {
        this.props.change(this.props.item.id);
    }
    
    handleRemoveClick = () => {
        this.props.remove(this.props.item.id);
    };

    render() {

        return (
            <div className="Dictionary">
                <button
                    className="dictionary-button"
                    onClick={this.handleClick}>
                    {this.props.item.name}
                </button>
                <Button className="line-button" 
                    clickHandler={this.handleRemoveClick}>                    
                </Button>
            </div>
        );
    }
}

export default Dictionary;
