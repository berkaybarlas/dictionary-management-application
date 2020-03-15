import React from 'react';
import './Dictionary.css';
import Dictionary from './Dictionary'
import addIcon from "../../assets/add.svg"

const Dictionaries = (props) => {
    return (
        <div>
            <header className="table-header">
                Dictionaries
            </header>
            <div className="Dictionaries">
                <div className="dictionary-list">
                    {props.dictionaries.map((item, i) => (
                        <Dictionary
                            className="dictionary-item"
                            key={item.id}
                            item={item}
                            change={props.onDictionaryClick}
                            remove={props.removeDictionary} />
                    ))}
                </div>
                <form
                    className="Dictionary"
                    onSubmit={props.onDictionarySubmit}>
                    <input
                        className="dictionary-input"
                        onChange={props.onDictionaryInput}
                        value={props.dictionary} />
                    <button className="line-button">
                        <img width={17} src={addIcon} alt="" />
                    </button>
                </form>
            </div>
        </div>
    );  
}
export default Dictionaries;
