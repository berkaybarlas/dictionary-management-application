import React from "react";
import "./components.css"
import LineItem from "./LineItem";

const TableList = (props) => {
    if(!props) {
      return;
    }
    return (
      <div className="table-list">
        {props.items.map(item => (
          <LineItem key={item.id}
            item={item}
            remove={props.remove}
            edit={props.edit} />
        ))}
      </div>
    );
}

export default TableList;