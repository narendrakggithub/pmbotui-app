import React, { Component } from 'react';
import LoadingIndicator  from '../common/LoadingIndicator';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import './home.css';
import { Form, Input, Button, notification, DatePicker } from 'antd';
const FormItem = Form.Item;


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
            // Reset State
            this.setState({
                isLoading: false
            });    
        }
    }

    

    render() {
        

        return (
            <div>
                
            <div className="home-container">
                {
                    !this.state.isLoading  ? (
                        <div className="no-polls-found">
                            <span>This is home page xxx</span>
                        </div>    
                        
                    ): null
                }  
                       
                {
                    this.state.isLoading ? 
                    <LoadingIndicator />: null                     
                }
            </div>
            </div>
        );
    }
}

export default withRouter(Home);