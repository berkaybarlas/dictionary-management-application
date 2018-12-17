import React from "react";
import "./components.css"
import LineItem from "./LineItem";

class TableList extends React.Component {
  render() {
    return (
      <div className="table-list">
        {this.props.items.map(item => (
          <LineItem key={item.id}
            item={item}
            remove={this.props.remove}
            edit={this.props.edit} />
        ))}
      </div>

    );
  }
}

export default TableList;