import React from "react";
import "./components.css"
import Button from "./Button"
import warningRedIcon from "../assets/warning-red.svg"
import warningYellowIcon from "../assets/warning-yellow.svg"

class LineItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleRemoveClick = this.handleRemoveClick.bind(this);
        this.handleDomainChange = this.handleDomainChange.bind(this);
        this.handleRangeChange = this.handleRangeChange.bind(this);
        this.warning = this.warning.bind(this);
    }
    handleRemoveClick = () => {
        this.props.remove(this.props.item.id);
    };

    handleDomainChange(e) {
        this.props.edit(this.props.item.id,e.target.value,'domain' );
    }
    handleRangeChange(e) {
        this.props.edit(this.props.item.id,e.target.value,'range' );
    }

    warning = (props) => {
        if(props===2){
            return <img className="line-warning" width={20} src={warningRedIcon} alt=""/> ;
        }
        if(props===1){
            return <img className="line-warning" width={20} src={warningYellowIcon} alt=""/> ;
        }
    }

    render() {
        return (
            <div className="line-item">
                <form >
                    <input className="line-left" 
                    value={this.props.item.domain}
                    onChange={this.handleDomainChange}/>
                </form>
                <form className="line-info" >
                    <input className="line-right" 
                    value={this.props.item.range}
                    onChange={this.handleRangeChange}/>
                    {this.warning(this.props.item.problemLevel)}
                    <Button className="line-button" clickHandler={this.handleRemoveClick}> </Button>
                </form>
                
                
            </div>
        )
    }

}

export default LineItem;