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
        let page;

        if (this.props.isAuthenticated) {
            page = <Dashboard isAuthenticated={this.props.isAuthenticated} 
            currentUser={this.props.currentUser}/>; 
          } else {
            page = <GeneralPage/>;
          }

        return (
            <div >
                {
                    !this.state.isLoading  ? (
                        <div >
                            {page}
                        </div>    
                        
                    ): <LoadingIndicator />
                }     
               
            </div>
        );
    }
}

export default withRouter(Home);