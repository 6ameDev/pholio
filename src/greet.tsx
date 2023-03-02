import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "./greet.scss";
import { sayHello } from "./hello";


function Greet() {
  return <div className="greetingContainer">{sayHello("foo")}</div>;
}

ReactDOM.render(<Greet />, document.getElementById('greeting'));
