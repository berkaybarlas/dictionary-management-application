import React, { Component } from 'react';
import './App.css';
import Table from './components/Table'

class App extends Component {
  
  render() {

    return (
      <div className="App">
        <div className="App-header">
          <div className="App-body">
            <Table  />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
