import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';

export default class UserMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    // Initialize metisMenu
    $('#side-menu').metisMenu();
  }

  toggle(e) {
    e.stopPropagation();
    this.setState({
      open: !this.state.open,
    });
  }


  renderLoggedIn() {
    const { open } = this.state;
    const { user, logout } = this.props;
    const email = user.emails[0].address;
    const emailLocalPart = email.substring(0, email.indexOf('@'));

    return (
      <nav className="navbar-default navbar-static-side" role="navigation">
        <div className="sidebar-collapse">

          <a className="close-canvas-menu"><i className="fa fa-times"></i></a>

          <ul className="nav" id="side-menu">
            <li className="nav-header">
              <div className="dropdown profile-element">
                <a data-toggle="dropdown" className="dropdown-toggle" href="#">
                  <span className="clear">
                    <span className="block m-t-xs">
                      <strong className="font-bold">Example user</strong>
                    </span>
                    <span className="text-muted text-xs block">
                      user <b className="caret"></b>
                    </span>
                  </span>
                </a>
                <ul className="dropdown-menu animated fadeInRight m-t-xs">
                  <li><a href="#">Item</a></li>
                  <li><a href="#">Item</a></li>
                  <li className="divider"></li>
                  <li><a href="#">Item</a></li>
                </ul>
              </div>
              <div className="logo-element">
                IN+
              </div>
            </li>
            <li className="{{isActiveRoute regex='pageOne'}}">
              <a href="{{pathFor route='pageOne'}}">
                <i className="fa fa-dashboard"></i>
                <span className="nav-label">Page one</span>
              </a>
            </li>
            <li className="{{isActiveRoute regex='pageTwo'}}">
              <a href="{{pathFor route='pageTwo'}}">
                <i className="fa fa-diamond"></i>
                <span className="nav-label">Page two</span>
              </a>
            </li>
          </ul>

        </div>
    </nav>
    );
  }

  renderLoggedOut() {
    return (
      <div className="user-menu">
        <Link to="/signin" className="btn-secondary">Sign In</Link>
        <Link to="/join" className="btn-secondary">Join</Link>
      </div>
    );
  }

  render() {
    return this.props.user
      ? this.renderLoggedIn()
      : this.renderLoggedOut();
  }
}

UserMenu.propTypes = {
  user: React.PropTypes.object,
  logout: React.PropTypes.func,
};
