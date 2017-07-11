var React = require('react');
var ReactDOM = require('react-dom');
var ReactFulcrumAuth = require('react-fulcrum-auth');

var App = React.createClass({
	render () {
		return (
			<div>
				<ReactFulcrumAuth />
			</div>
		);
	}
});

ReactDOM.render(<App />, document.getElementById('app'));
