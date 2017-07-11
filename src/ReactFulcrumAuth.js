import React, {Component, PropTypes} from 'react';
import { ControlLabel, FormGroup, FormControl, Modal, Button, Navbar } from 'react-bootstrap';
var Fulcrum = require('fulcrum-app');

class ReactFulcrumAuth extends React.Component {

  static propTypes() {
    return {
      appName: PropTypes.string,
      callback: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      contexts: [],
      credsPickerStyle: {display: "block"},
      modalTitle: "Please Log In",
      orgName: sessionStorage.getItem("orgName"),
      orgPickerStyle: {display: "block"},
      showLogout: {display: "none"},
      showModal: true,
      token: sessionStorage.getItem("fulcrum_query_token"),
      username: undefined
    };
  }

  componentDidMount() {
    this.setState({showModal: false});
    this.checkLogin();
  }

  componentWillUnmount() {
    //
  }

  checkLogin() {
    if (!this.state.token) {
      this.setState({
        orgPickerStyle: {display: "none"},
        showLogout: {display: "none"},
        showModal: true
      });
    } else {
      this.props.callback(new Fulcrum({api_key: this.state.token}), this.state.orgName);
      this.setState({
        credsPickerStyle: {display: "none"},
        showLogout: {display: "block"},
        showModal: false,
        username: JSON.parse(sessionStorage.getItem("current_user")).email
      });
    }
  }

  login() {
    var email = this.email;
    var password = this.password;

    fetch("https://api.fulcrumapp.com/api/v2/users.json", {
      method: "GET",
      headers: {
        'Accept': "application/json",
        'Content-Type': "application/json",
        "Authorization": "Basic " + btoa(email.value + ":" + password.value)
      }
    }).then(function(res){
      if (res.status === 401) throw res;
      return res.json();
    }).then(function(data){
      email.setAttribute("disabled", "disabled");
      password.setAttribute("disabled", "disabled");
      this.refs.loginForm.querySelector("button").setAttribute("disabled", "disabled");

      var contexts = data.user.contexts.sort(function(a,b){
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
      });

      this.setState({
        contexts: contexts,
        orgPickerStyle: {display: "block"},
        username: data.user.email
      });
      sessionStorage.setItem("current_user", JSON.stringify(data.user));
    }.bind(this)).catch(function(err){
      email.value = "";
      password.value = "";
      return window.alert(err.status + ": " + err.statusText);
    });
  }

  changeOrg() {
    if (this.state.contexts.length === 0){
      var contexts = JSON.parse(sessionStorage.getItem("current_user")).contexts.sort(function(a,b){
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
      });
      this.setState({contexts: contexts});
    }
    this.setState({
      modalTitle: "Select an Organization",
      orgPickerStyle: {display: "block"},
      showModal: true
    });
  }

  setOrg() {
    var orgName = this.state.contexts.find(function(d){ return d.api_token === this.fulcrum_key.value }.bind(this)).name;
    sessionStorage.setItem("fulcrum_query_token", this.fulcrum_key.value);
    sessionStorage.setItem("orgName", orgName);
    this.setState({
      orgName: orgName,
      showModal: false,
      token: this.fulcrum_key.value
    }, this.checkLogin);
  }

  logout() {
    sessionStorage.removeItem("current_user");
    sessionStorage.removeItem("orgName");
    sessionStorage.removeItem("fulcrum_query_token");
    window.location.reload();
  }

  render() {
    return (
      <div>
      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Navbar.Link href="#">{this.props.appName || "Fulcrum App"}</Navbar.Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Navbar.Text style={this.state.showLogout}>Logged in as {this.state.username}</Navbar.Text>
          <Navbar.Text style={this.state.showLogout} pullRight>
            <Navbar.Link href="#" onClick={this.logout}>Logout</Navbar.Link>
          </Navbar.Text>
          <Navbar.Text style={this.state.showLogout} pullRight>
            <Navbar.Link href="#" onClick={this.changeOrg.bind(this)}>Change Org</Navbar.Link>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
      <Modal show={this.state.showModal} >
        <Modal.Header>
          <Modal.Title>{this.state.modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form ref="loginForm" style={this.state.credsPickerStyle} onSubmit={(evt) => { evt.preventDefault(); this.login() }}>
            <FormGroup>
              <ControlLabel>Email</ControlLabel>
              <FormControl type="email" inputRef={node => this.email = node}></FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Password</ControlLabel>
              <FormControl type="password" inputRef={node => this.password = node}></FormControl>
            </FormGroup>
            <FormGroup>
              <Button type="submit" bsStyle="primary">Sign In</Button>
            </FormGroup>
          </form>
          <form ref="orgForm" style={this.state.orgPickerStyle} onSubmit={(evt) => { evt.preventDefault(); this.setOrg() }}>
            <FormGroup>
              <ControlLabel>Organization</ControlLabel>
              <FormControl componentClass="select" inputRef={node => this.fulcrum_key = node}>
                <option value="">{'-- pick an org --'}</option>
                {this.state.contexts.map(function(d){
                  return <option value={d.api_token} key={d.id} >{d.name}</option>
                })}
              </FormControl>
            </FormGroup>
            <FormGroup>
              <Button type="submit" bsStyle="primary">Go!</Button>
            </FormGroup>
          </form>
        </Modal.Body>
      </Modal>
      </div>
    )
  }
};

export default ReactFulcrumAuth;
