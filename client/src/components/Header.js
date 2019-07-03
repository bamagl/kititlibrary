
import PropTypes from "prop-types";
import React, { Component } from "react";

export default class Header extends Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired
  };

  render() {
    const { authenticated } = this.props;
    return (
      <div className="menu">
     
      {authenticated ? (
        <button className="loginBtn loginBtn--google" onClick={this._handleLogoutClick}>Logout</button>
      ) : (
        <button className="loginBtn loginBtn--google" onClick={this._handleSignInClick}>Login with Google</button>
      )}
    </div>
    );
  }

  _handleSignInClick = () => {
    // Authenticate using via passport api in the backend
    // Open Twitter login page
    // Upon successful login, a cookie session will be stored in the client
    window.open("http://localhost:8080/auth/google", "_self");
  };

  _handleLogoutClick = () => {
    // Logout using Twitter passport api
    // Set authenticated state to false in the HomePage
    window.open("http://localhost:8080/logout", "_self");
    this.props.handleNotAuthenticated();
  };
}