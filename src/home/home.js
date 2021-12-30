import React, { Component } from 'react';
import LoadingIndicator  from '../common/LoadingIndicator';
import { withRouter } from 'react-router-dom';
import GeneralPage from './generalpage';
import Dashboard from './dashboard';
import './home.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
    }
    componentDidMount() {      
    }

    componentDidUpdate(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            this.setState({
                isLoading: false
            });    
        }
    }

    render() {
        let message;
        let page;

        if (this.props.isAuthenticated) {
            message = 'logged in';
            page = <Dashboard/>;
          } else {
            message = 'not logged in';
            page = <GeneralPage/>;
          }

        return (
            <div className="home-container">
                {
                    !this.state.isLoading  ? (
                        <div className="no-polls-found">
                            {page}
                        </div>    
                        
                    ): <LoadingIndicator />
                }     
               
            </div>
        );
    }
}

export default withRouter(Home);