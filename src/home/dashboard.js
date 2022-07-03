import React, { Component } from 'react';
import './home.css';
import ApproveNewUser from '../dashboard/approvenewuser';
import EDLAccountLink from '../dashboard/edlaccountlink';
import { Role } from '../common/role';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
        this.hasRole = this.hasRole.bind(this);
    }
    componentDidMount() {      
    }

    componentDidUpdate(nextProps) {
    }

    hasRole(role) {
        let roles = this.props.currentUser.authorities;
        let result = false;
        for (var i = 0; i < roles.length; i++) {
          var item = roles[i];
          if(role===item.authority) {
            result = true;
            break;
          }
        }
        return result;
      }

    render() {
        let approveNewUser;
        let accountEDLLink;
  
        approveNewUser = <ApproveNewUser/>
        
        if(this.hasRole(Role.PDL)) {
            accountEDLLink = <EDLAccountLink/>
        }

        return (
            <div className="dashboard">
                {approveNewUser}
                {accountEDLLink}
            </div> 
        );
    }
}

export default Dashboard;