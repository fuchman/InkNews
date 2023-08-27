import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Weather from './weather.js'

class Page extends React.Component {
  render() {
    return (
      <div>
        <Weather />
      </div>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Page />);