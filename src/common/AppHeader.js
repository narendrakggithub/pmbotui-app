import React, { Component } from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';
import './AppHeader.css';
import pollIcon from '../poll.svg';
import { Layout, Menu, Dropdown, Icon } from 'antd';

const Header = Layout.Header;
    
class AppHeader extends Component {
    constructor(props) {
        super(props);   
        this.handleMenuClick = this.handleMenuClick.bind(this);   
    }

    handleMenuClick({ key }) {
      if(key === "logout") {
        this.props.onLogout();
      }
    }

    render() {
        let menuItems;
        if(this.props.currentUser) {
          menuItems = [
        <Menu.Item key="/">
          <Link to="/">
           <Icon type="home" className="nav-icon" />
          </Link>
        </Menu.Item>,
        <Menu.Item key="/poll/new">
          <Link to="/poll/new">
           <img src={pollIcon} alt="poll" className="poll-icon" />
          </Link>
        </Menu.Item>,
        <Menu.Item key="/project/createProject" className="create-menu">
          <CreateDropdownMenu 
          currentUser={this.props.currentUser} 
          handleMenuClick={this.handleMenuClick}/>
        </Menu.Item>,
        <Menu.Item key="/profile" className="profile-menu">
          <ProfileDropdownMenu 
          currentUser={this.props.currentUser} 
          handleMenuClick={this.handleMenuClick}/>
        </Menu.Item>
          ]; 
        } else {
          menuItems = [
            <Menu.Item key="/login">
              <Link to="/login">Login</Link>
            </Menu.Item>,
            <Menu.Item key="/signup">
              <Link to="/signup">Signup</Link>
            </Menu.Item>                  
          ];
        }

        return (
            <Header className="app-header">
            <div className="container">
              <div className="app-title" >
                <Link to="/">PMBot</Link>
              </div>
              <Menu
                className="app-menu"
                mode="horizontal"
                selectedKeys={[this.props.location.pathname]}
                style={{ lineHeight: '64px' }} >
                  {menuItems}
              </Menu>
            </div>
          </Header>
        );
    }
}

function ProfileDropdownMenu(props) {
  const dropdownMenu = (
    <Menu onClick={props.handleMenuClick} className="profile-dropdown-menu">
      <Menu.Item key="user-info" className="dropdown-item" disabled>
        <div className="user-full-name-info">
          {props.currentUser.userName}
        </div>
        <div className="username-info">
          @{props.currentUser.userName}
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="profile" className="dropdown-item">
        <Link to={`/users/${props.currentUser.username}`}>Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" className="dropdown-item">
        Logout
      </Menu.Item>
    </Menu>
  );

  

  return (
    <Dropdown 
      overlay={dropdownMenu} 
      trigger={['click']}
      getPopupContainer = { () => document.getElementsByClassName('profile-menu')[0]}>
      <a className="ant-dropdown-link">
         <Icon type="user" className="nav-icon" style={{marginRight: 0}} /> <Icon type="down" />
      </a>
    </Dropdown>
  );
}

function CreateDropdownMenu(props) {
  const dropdownMenu = (
    <Menu onClick={props.handleMenuClick} className="create-dropdown-menu">
      <Menu.Item key="project" className="dropdown-item">
        <Link to="/project/createProject">Project</Link>
      </Menu.Item>
      <Menu.Item key="subLob" className="dropdown-item">
        <Link to="/subLob/createSubLob">Sub LOB</Link>
      </Menu.Item>
      <Menu.Item key="customer" className="dropdown-item">
        <Link to="/customer/createCustomer">Customer</Link>
      </Menu.Item>
      <Menu.Item key="lob" className="dropdown-item">
        <Link to="/lob/createLob">LOB</Link>
      </Menu.Item>
      <Menu.Item key="account" className="dropdown-item">
       <Link to="/account/createAccount">Account</Link>
      </Menu.Item>
      <Menu.Item key="sbu" className="dropdown-item">
        <Link to="/sbu/createSbu">SBU</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown 
      overlay={dropdownMenu} 
      trigger={['click']}
      getPopupContainer = { () => document.getElementsByClassName('create-menu')[0]}>
      <a className="ant-dropdown-link">
         <Icon type="plus" className="nav-icon" style={{marginRight: 0}} /> <Icon type="down" />
      </a>
    </Dropdown>
  );
}

export default withRouter(AppHeader);