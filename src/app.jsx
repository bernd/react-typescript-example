'use strict';

var React = require('react');
var Bootstrap = require('react-bootstrap');
var Foo = require('./main').Foo;

var Button = Bootstrap.Button;

var C = React.createClass({
  handleClick(e) {
    e.preventDefault();

    var f = new Foo('Test');

    console.log(f);
  },
  render() {
    return (
      <div className="container">
        <p>
          <Button bsStyle="success" onClick={this.handleClick}>
            Hello world!
          </Button>
        </p>
      </div>
    );
  }
});

React.render(<C />, document.getElementById('test'));
