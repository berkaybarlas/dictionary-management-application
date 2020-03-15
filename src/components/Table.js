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
            dictionaries: [],
            dictionary: '',
            history: { dictionaries: [] },
            lastDictId: '',
        };
        this.handleDomainChange = this.handleDomainChange.bind(this);
        this.handleRangeChange = this.handleRangeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.saveToStorage = this.saveToStorage.bind(this);
        this.recover = this.recover.bind(this);
        this.remove = this.remove.bind(this);
        this.removeDictionary = this.removeDictionary.bind(this);
        this.onDictionaryInput = this.onDictionaryInput.bind(this);
        this.edit = this.edit.bind(this);
        this.validate = this.validate.bind(this);
        this.changeDictionary = this.changeDictionary.bind(this);

        this.onDictionarySubmit = this.onDictionarySubmit.bind(this);
        this.updateTable = this.updateTable.bind(this);
        this.onDictionaryClick = this.onDictionaryClick.bind(this);
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


    recover() {
        //error catch
        let data = JSON.parse(localStorage.getItem('dictionaryHistory'));
        if (!data) {
            return;
        }
        this.setState({
            history: data,
            items: data.items,
            dictionaries: data.dictionaries,
            dictionaryName: data.dictionaryName,
        });
    }

    saveToStorage() {
        let data = this.state.history;
        data.items = this.state.items;
        data.dictionaryName = this.state.dictionaryName;
        data.dictionaries = this.state.dictionaries;
        localStorage.setItem('dictionaryHistory', JSON.stringify(data));
    }

    removeDictionary = (itemId) => {
        this.setState(state => ({
            dictionaries: state.dictionaries.filter(item => item.id !== itemId)
        }));
    }
    onDictionaryInput = (event) => {
        this.setState({ dictionary: event.target.value });
    }
    onDictionarySubmit(event) {
        event.preventDefault();
        if (!this.state.dictionary.length) {
            return;
        }
        let newItems = [];
        if (this.state.lastDictId === '') {
            newItems = this.state.items;
        }
        const newDictionary = {
            id: Date.now(),
            name: this.state.dictionary,
            items: newItems,
        }

        this.setState(state => ({
            dictionaries: state.dictionaries.concat(newDictionary),
            dictionary: '',
            lastDictId: newDictionary.id,
            items: newItems,
        }), () => {
            this.onDictionaryClick(newDictionary.id);
            this.saveToStorage();
        });
    }

    onDictionaryClick = (dictId) => {
        const dictionaries = this.state.dictionaries;
        const index = dictionaries.findIndex((e) => e.id === dictId);

        if (index === -1) {
            return;
        }

        this.setState(state => ({
            lastDictId: dictId,
            items: dictionaries[index].items,
        })); //, () => this.props.change(this.state.dictionaries[index].items, this.state.dictionaries[index].name));
    }

    updateTable = (dictId, items) => {
        const dictionaries = this.props.dictionaries;
        const index = dictionaries.findIndex((e) => e.id === dictId);

        if (index === -1) {
            return;
        } else {
            dictionaries[index].items = items;
        }
        this.setState(state => ({
            dictionaries: dictionaries,
        }), () => { this.saveToStorage() });
    }

    render() {
        return (
            <div className="App-body">
                <Dictionaries
                    items={this.state.items}
                    change={this.changeDictionary}
                    dictionaries={this.state.dictionaries}
                    dictionary={this.state.dictionary}
                    lastDictId = {this.state.lastDictId}
                    onDictionaryInput = {this.onDictionaryInput}
                    onDictionarySubmit = {this.onDictionarySubmit}
                    onDictionaryClick = {this.onDictionaryClick}
                    removeDictionary = {this.removeDictionary}
            />
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