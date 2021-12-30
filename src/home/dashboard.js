import React, { Component } from 'react';
import './home.css';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
    }
    componentDidMount() {      
    }

    componentDidUpdate(nextProps) {
  
    }

    render() {
       
        return (
            <div className="home-container">
                <div className="no-polls-found">
                    <span>This is Dashboard</span>
                </div> 
            </div>
        );
    }
}

export default Dashboard;