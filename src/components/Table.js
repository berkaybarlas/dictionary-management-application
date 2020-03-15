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
            selectedDictId: '',
            selectedDictIndex: -1,
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

    handleDomainChange(event) {
        this.setState({ domain: event.target.value });
    }
    handleRangeChange(event) {
        this.setState({ range: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        const { domain, range, selectedDictIndex, dictionaries, items } = this.state;
        if (!domain.length || !range.length) {
            return;
        }
        if(selectedDictIndex === -1) {
            return;
        }
        const newItem = {
            id: Date.now(),
            domain: domain,
            range: range,
            problemLevel: 0,
        }

        let dictionariesCopy = [...dictionaries];
        dictionariesCopy[selectedDictIndex].items = [...items, newItem];
        console.log(dictionariesCopy)
        //console.log(dictionariesCopy)
        this.setState(state => ({
            dictionaries: dictionariesCopy,
            items: state.items.concat(newItem),
            domain: '',
            range: '',
        }), () => { this.saveToStorage() });

    }
    remove = (itemId) => {
        const { items, dictionaries, selectedDictIndex } = this.state;

        let filteredItems = items.filter(item => item.id !== itemId);
        let dictionariesCopy = [...dictionaries];
        dictionariesCopy[selectedDictIndex].items = filteredItems;

        this.setState(state => ({
            items: filteredItems
        }));
    }
    edit = (itemId, value, type) => {
        const items = this.state.items;
        const index = items.findIndex((event) => event.id === itemId);

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

        this.state.items.map((item) => {
            if (Dictionary[item.range] !== undefined) {
                item.problemLevel = 2;
            } else if (Dictionary[item.domain] === undefined) {
                Dictionary[item.domain] = item.range;
                item.problemLevel = 0;
            } else {
                item.problemLevel = 1;
            }
            return item;
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
        let index = this.state.dictionaries.length;
        if (this.state.selectedDictId === '') {
            newItems = this.state.items;
        }
        const newDictionary = {
            id: Date.now(),
            name: this.state.dictionary,
            items: newItems,
        }
        console.log(this.state)
        this.setState(state => ({
            dictionaries: state.dictionaries.concat(newDictionary),
            dictionary: '',
            selectedDictId: newDictionary.id,
            selectedDictIndex: index,
            items: newItems,
        }), () => {
            this.saveToStorage();
        });
    }

    onDictionaryClick = (dictId) => {
        const { dictionaries } = this.state;
        const index = dictionaries.findIndex((dictionary) => dictionary.id === dictId);

        if (index === -1) {
            return;
        }

        this.setState(state => ({
            selectedDictId: dictId,
            selectedDictIndex: index,
            items: dictionaries[index].items,
        }));
    }

    updateTable = (dictId, items) => {
        const dictionaries = this.props.dictionaries;
        const index = dictionaries.findIndex((event) => event.id === dictId);

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
                    selectedDictId = {this.state.selectedDictId}
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