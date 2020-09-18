import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        {/* 没有任何定义，可以接纳任何组件 */}
        {this.props.children}
      </div>
    );
  }
}

export default App;
