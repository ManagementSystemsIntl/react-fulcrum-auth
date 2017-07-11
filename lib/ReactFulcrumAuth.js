'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require('react-bootstrap');

var Fulcrum = require('fulcrum-app');

var ReactFulcrumAuth = (function (_React$Component) {
  _inherits(ReactFulcrumAuth, _React$Component);

  _createClass(ReactFulcrumAuth, null, [{
    key: 'propTypes',
    value: function propTypes() {
      return {
        appName: _react.PropTypes.string,
        callback: _react.PropTypes.func.isRequired
      };
    }
  }]);

  function ReactFulcrumAuth(props) {
    _classCallCheck(this, ReactFulcrumAuth);

    _get(Object.getPrototypeOf(ReactFulcrumAuth.prototype), 'constructor', this).call(this, props);
    this.state = {
      contexts: [],
      credsPickerStyle: { display: "block" },
      modalTitle: "Please Log In",
      orgName: sessionStorage.getItem("orgName"),
      orgPickerStyle: { display: "block" },
      showLogout: { display: "none" },
      showModal: true,
      token: sessionStorage.getItem("fulcrum_query_token"),
      username: undefined
    };
  }

  _createClass(ReactFulcrumAuth, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setState({ showModal: false });
      this.checkLogin();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      //
    }
  }, {
    key: 'checkLogin',
    value: function checkLogin() {
      if (!this.state.token) {
        this.setState({
          orgPickerStyle: { display: "none" },
          showLogout: { display: "none" },
          showModal: true
        });
      } else {
        this.props.callback(new Fulcrum({ api_key: this.state.token }), this.state.orgName);
        this.setState({
          credsPickerStyle: { display: "none" },
          showLogout: { display: "block" },
          showModal: false,
          username: JSON.parse(sessionStorage.getItem("current_user")).email
        });
      }
    }
  }, {
    key: 'login',
    value: function login() {
      var email = this.email;
      var password = this.password;

      fetch("https://api.fulcrumapp.com/api/v2/users.json", {
        method: "GET",
        headers: {
          'Accept': "application/json",
          'Content-Type': "application/json",
          "Authorization": "Basic " + btoa(email.value + ":" + password.value)
        }
      }).then(function (res) {
        if (res.status === 401) throw res;
        return res.json();
      }).then((function (data) {
        email.setAttribute("disabled", "disabled");
        password.setAttribute("disabled", "disabled");
        this.refs.loginForm.querySelector("button").setAttribute("disabled", "disabled");

        var contexts = data.user.contexts.sort(function (a, b) {
          return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
        });

        this.setState({
          contexts: contexts,
          orgPickerStyle: { display: "block" },
          username: data.user.email
        });
        sessionStorage.setItem("current_user", JSON.stringify(data.user));
      }).bind(this))['catch'](function (err) {
        email.value = "";
        password.value = "";
        return window.alert(err.status + ": " + err.statusText);
      });
    }
  }, {
    key: 'changeOrg',
    value: function changeOrg() {
      if (this.state.contexts.length === 0) {
        var contexts = JSON.parse(sessionStorage.getItem("current_user")).contexts.sort(function (a, b) {
          return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
        });
        this.setState({ contexts: contexts });
      }
      this.setState({
        modalTitle: "Select an Organization",
        orgPickerStyle: { display: "block" },
        showModal: true
      });
    }
  }, {
    key: 'setOrg',
    value: function setOrg() {
      var orgName = this.state.contexts.find((function (d) {
        return d.api_token === this.fulcrum_key.value;
      }).bind(this)).name;
      sessionStorage.setItem("fulcrum_query_token", this.fulcrum_key.value);
      sessionStorage.setItem("orgName", orgName);
      this.setState({
        orgName: orgName,
        showModal: false,
        token: this.fulcrum_key.value
      }, this.checkLogin);
    }
  }, {
    key: 'logout',
    value: function logout() {
      sessionStorage.removeItem("current_user");
      sessionStorage.removeItem("orgName");
      sessionStorage.removeItem("fulcrum_query_token");
      window.location.reload();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          _reactBootstrap.Navbar,
          { collapseOnSelect: true },
          _react2['default'].createElement(
            _reactBootstrap.Navbar.Header,
            null,
            _react2['default'].createElement(
              _reactBootstrap.Navbar.Brand,
              null,
              _react2['default'].createElement(
                _reactBootstrap.Navbar.Link,
                { href: '#' },
                this.props.appName || "Fulcrum App"
              )
            ),
            _react2['default'].createElement(_reactBootstrap.Navbar.Toggle, null)
          ),
          _react2['default'].createElement(
            _reactBootstrap.Navbar.Collapse,
            null,
            _react2['default'].createElement(
              _reactBootstrap.Navbar.Text,
              { style: this.state.showLogout },
              'Logged in as ',
              this.state.username
            ),
            _react2['default'].createElement(
              _reactBootstrap.Navbar.Text,
              { style: this.state.showLogout, pullRight: true },
              _react2['default'].createElement(
                _reactBootstrap.Navbar.Link,
                { href: '#', onClick: this.logout },
                'Logout'
              )
            ),
            _react2['default'].createElement(
              _reactBootstrap.Navbar.Text,
              { style: this.state.showLogout, pullRight: true },
              _react2['default'].createElement(
                _reactBootstrap.Navbar.Link,
                { href: '#', onClick: this.changeOrg.bind(this) },
                'Change Org'
              )
            )
          )
        ),
        _react2['default'].createElement(
          _reactBootstrap.Modal,
          { show: this.state.showModal },
          _react2['default'].createElement(
            _reactBootstrap.Modal.Header,
            null,
            _react2['default'].createElement(
              _reactBootstrap.Modal.Title,
              null,
              this.state.modalTitle
            )
          ),
          _react2['default'].createElement(
            _reactBootstrap.Modal.Body,
            null,
            _react2['default'].createElement(
              'form',
              { ref: 'loginForm', style: this.state.credsPickerStyle, onSubmit: function (evt) {
                  evt.preventDefault();_this.login();
                } },
              _react2['default'].createElement(
                _reactBootstrap.FormGroup,
                null,
                _react2['default'].createElement(
                  _reactBootstrap.ControlLabel,
                  null,
                  'Email'
                ),
                _react2['default'].createElement(_reactBootstrap.FormControl, { type: 'email', inputRef: function (node) {
                    return _this.email = node;
                  } })
              ),
              _react2['default'].createElement(
                _reactBootstrap.FormGroup,
                null,
                _react2['default'].createElement(
                  _reactBootstrap.ControlLabel,
                  null,
                  'Password'
                ),
                _react2['default'].createElement(_reactBootstrap.FormControl, { type: 'password', inputRef: function (node) {
                    return _this.password = node;
                  } })
              ),
              _react2['default'].createElement(
                _reactBootstrap.FormGroup,
                null,
                _react2['default'].createElement(
                  _reactBootstrap.Button,
                  { type: 'submit', bsStyle: 'primary' },
                  'Sign In'
                )
              )
            ),
            _react2['default'].createElement(
              'form',
              { ref: 'orgForm', style: this.state.orgPickerStyle, onSubmit: function (evt) {
                  evt.preventDefault();_this.setOrg();
                } },
              _react2['default'].createElement(
                _reactBootstrap.FormGroup,
                null,
                _react2['default'].createElement(
                  _reactBootstrap.ControlLabel,
                  null,
                  'Organization'
                ),
                _react2['default'].createElement(
                  _reactBootstrap.FormControl,
                  { componentClass: 'select', inputRef: function (node) {
                      return _this.fulcrum_key = node;
                    } },
                  _react2['default'].createElement(
                    'option',
                    { value: '' },
                    '-- pick an org --'
                  ),
                  this.state.contexts.map(function (d) {
                    return _react2['default'].createElement(
                      'option',
                      { value: d.api_token, key: d.id },
                      d.name
                    );
                  })
                )
              ),
              _react2['default'].createElement(
                _reactBootstrap.FormGroup,
                null,
                _react2['default'].createElement(
                  _reactBootstrap.Button,
                  { type: 'submit', bsStyle: 'primary' },
                  'Go!'
                )
              )
            )
          )
        )
      );
    }
  }]);

  return ReactFulcrumAuth;
})(_react2['default'].Component);

;

exports['default'] = ReactFulcrumAuth;
module.exports = exports['default'];