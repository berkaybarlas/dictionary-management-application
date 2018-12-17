import React from "react";
import "./components.css"
import TableList from "./TableList";
import Dictionaries from './Dictionary/Dictionaries'
import addIcon from "../assets/add.svg"
class Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            number: 0,
            items: [],
            domain: '',
            range: '',
            dictionaryName: '',
            history: { items: [] },
        };
        this.handleDomainChange = this.handleDomainChange.bind(this);
        this.handleRangeChange = this.handleRangeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.saveToStorage = this.saveToStorage.bind(this);
        this.recover = this.recover.bind(this);
        this.remove = this.remove.bind(this);
        this.edit = this.edit.bind(this);
        this.validate = this.validate.bind(this);
        this.changeDictionary = this.changeDictionary.bind(this);
    }

    changeDictionary = (items, name) => {
        this.setState({
            items: items,
            dictionaryName: name
        });
    }

    componentDidMount() {
        this.recover();
    }

    recover() {
        //error catch
        let data = JSON.parse(localStorage.getItem('history'));
        if (!data) {
            return;
        }
        this.setState({
            history: data,
            items: data.items,
            dictionaryName: data.dictionaryName,
        });
    }

    saveToStorage() {
        let data = this.state.history;
        data.items = this.state.items;
        data.dictionaryName = this.state.dictionaryName;
        localStorage.setItem('history', JSON.stringify(data));
    }

    handleDomainChange(e) {
        this.setState({ domain: e.target.value });
    }
    handleRangeChange(e) {
        this.setState({ range: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        if (!this.state.domain.length || !this.state.range.length) {
            return;
        }
        const newItem = {
            id: Date.now(),
            domain: this.state.domain,
            range: this.state.range,
            problemLevel: 0,
        }
        this.setState(state => ({
            items: state.items.concat(newItem),
            domain: '',
            range: '',
        }), () => { this.saveToStorage() });

    }
    remove = (itemId) => {
        this.setState(state => ({
            items: state.items.filter(item => item.id !== itemId)
        }));
    }
    edit = (itemId, value, type) => {
        const items = this.state.items;
        const index = items.findIndex((e) => e.id === itemId);

        if (index === -1) {
            return;
        } else {
            items[index][type] = value;
        }
        this.setState(state => ({
            items: items,
        }), () => { this.saveToStorage() });
    }

    validate = () => {
        var Dictionary = {};

        this.state.items.map((e) => {
            if (Dictionary[e.range] !== undefined) {
                e.problemLevel = 2;
            } else if (Dictionary[e.domain] === undefined) {
                Dictionary[e.domain] = e.range;
                e.problemLevel = 0;
            } else {
                e.problemLevel = 1;
            }
            return e;
        });

        this.forceUpdate()
    }

    render() {
        return (
            <div className="App-body">
                <Dictionaries
                    items={this.state.items}
                    change={this.changeDictionary} />
                <div>
                    <header className="table-header">
                        Dictionary: {this.state.dictionaryName}
                        <button className="validate-button" onClick={this.validate}> Validate</button>
                    </header>
                    <div className="table">
                        <TableList items={this.state.items} remove={this.remove} edit={this.edit} />
                        <div >
                            <form className="table-bottom"
                                onSubmit={this.handleSubmit}>
                                <input
                                    className="table-input"
                                    id="new-table1"
                                    onChange={this.handleDomainChange}
                                    value={this.state.domain} />
                                <input id="new-table2"
                                    className="table-input"
                                    onChange={this.handleRangeChange}
                                    value={this.state.range} />
                                <button className="table-button">
                                    <img width={17} src={addIcon} alt="" />
                                </button>
                            </form>

                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default Table;