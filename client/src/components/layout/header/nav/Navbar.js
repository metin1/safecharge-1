import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../../../actions/authAction";
import { checkCartItemsStorage } from '../../../../utils/checkCartItemsStorage';
import "./Navbar.css";

class Navbar extends Component {
  state = {
    totalQuantity: 0
  };
  componentDidMount() {
    const items = checkCartItemsStorage();
    this.setState({
      totalQuantity: items.totalQuantity || 0
    });
  }



  componentDidUpdate(prevProps) {
    if (this.props.items !== prevProps.items) {
      this.setState({
        totalQuantity: this.props.items.items.totalQuantity || 0
      });
    }
  }
  handleOnclick = () => {
    this.props.logout();
  };
        // <li>
        //   <Link to="/partone-err">PartOne-2</Link>
        // </li>
  render() {
    const { isAuthenticated, user } = this.props.auth;
    //const { items } = this.props.items
    const { totalQuantity } = this.state;
    const guestLinks = (
      <ul className='guestLinks'>
        <li>
          <Link to="/part1-2">Form</Link>
        </li>
        <li>
          <Link to="/part1-1">Part1-1</Link>
        </li>
        <li>
          <Link to="/part1-3">Part1-2</Link>
        </li>
        <li>
          <Link to="/part2-1">Part2-1</Link>
        </li>
        <li>
          <Link to="/part3-1">Part3-1</Link>
        </li>
        <li>
          <Link to="/part3-2">Part3-2</Link>
        </li>
      </ul>
    );
    const authLinks = (
      <ul className='authLinks'>
        <li>
          {user.role === 'user' ? <Link to="/my-account">My Account</Link> : null}
          {user.role === 'admin' ? <Link to="/dashboard">Dashboard</Link> : null}
        </li>

        <li>
          <Link to="" onClick={this.handleOnclick}>
            Logout{" "}
          </Link>
        </li>
      </ul>
    );
    return (
      <div>
        <nav className="nav-bar nav-two">
          {guestLinks }
        </nav>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth,
  items: state.items
});
export default connect(
  mapStateToProps,
  { logout }
)(Navbar);
