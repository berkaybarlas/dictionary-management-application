import React, { Component } from 'react';
import './Dictionary.css';
import Dictionary from './Dictionary'
import addIcon from "../../assets/add.svg"

class Dictionaries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dictionaries: [],
            items: [],
            dictionary: '',
            history: { dictionaries: [] },
            lastDictId: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.saveToStorage = this.saveToStorage.bind(this);
        this.updateTable = this.updateTable.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.remove = this.remove.bind(this);
    }

    handleChange(e) {
        this.setState({ dictionary: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        if (!this.state.dictionary.length) {
            return;
        }
        let newItems = [];
        if (this.state.lastDictId === '') {
            newItems = this.props.items;
        }
        const newItem = {
            id: Date.now(),
            name: this.state.dictionary,
            items: newItems,
        }

        this.setState(state => ({
            dictionaries: state.dictionaries.concat(newItem),
            dictionary: '',
            lastDictId: newItem.id,
        }), () => {
            this.handleClick(newItem.id);
            this.saveToStorage();
        });
    }

    handleClick = (dictId) => {
        const dictionaries = this.state.dictionaries;
        const index = dictionaries.findIndex((e) => e.id === dictId);

        if (index === -1) {
            return;
        }

        this.setState(state => ({
            lastDictId: dictId,
        }), () => this.props.change(this.state.dictionaries[index].items, this.state.dictionaries[index].name));
    }

    updateTable = (dictId, items) => {
        const dictionaries = this.state.dictionaries;
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


    remove = (itemId) => {
        this.setState(state => ({
            dictionaries: state.dictionaries.filter(item => item.id !== itemId)
        }));
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if ((nextProps !== undefined) & nextProps.items !== this.state.items & nextProps.items !== []) {
            this.setState({ items: nextProps.items });
            this.updateTable(this.state.lastDictId, nextProps.items);
        }
    }

    render() {
        return (
            <div>
                <header className="table-header">
                    Dictionaries
            </header>
                <div className="Dictionaries">
                    <div className="dictionary-list">
                        {this.state.dictionaries.map(item => (
                            <Dictionary
                                className="dictionary-item"
                                key={item.id}
                                item={item}
                                change={this.handleClick}
                                remove={this.remove} />
                        ))}
                    </div>
                    <form
                        className="Dictionary"
                        onSubmit={this.handleSubmit}>
                        <input
                            className="dictionary-input"
                            onChange={this.handleChange}
                            value={this.state.dictionary} />
                        <button className="line-button">
                            <img width={17} src={addIcon} alt="" />
                        </button>

                    </form>

                </div>
            </div>
        );
    }

    saveToStorage() {
        let data = this.state.history;
        data.dictionaries = this.state.dictionaries;
        localStorage.setItem('dictionaries', JSON.stringify(data));
    }

    componentDidMount() {
        this.recover();
    }

    recover() {
        //error catch
        let data = JSON.parse(localStorage.getItem('dictionaries'));
        if (!data) {
            return;
        }

        this.setState({
            history: data,
            dictionaries: data.dictionaries,
        });
    }
}
export default Dictionaries;
