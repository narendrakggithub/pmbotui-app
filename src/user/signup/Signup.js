import React, { Component } from 'react';
import { signup, checkUserNameAvailability, checkEmailAvailability, checkManagerEmailAvailability } from '../../util/APIUtils';
import './Signup.css';
import { Link } from 'react-router-dom';
import {   
    USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH,
    ANYNAME_MIN_LENGTH, ANYNAME_MAX_LENGTH,
    MANAGEREMAIL_MAX_LENGTH, 
    EMAIL_MAX_LENGTH,
    PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH, APP_NAME
} from '../../constants';

import { Form, Input, Button, notification } from 'antd';
const FormItem = Form.Item;

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
            userName: {
                value: ''
            },
            fullName: {
                value: ''
            },
            email: {
                value: ''
            },
            managerEmail: {
                value: ''
            },
            password: {
                value: ''
            }
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateUserNameAvailability = this.validateUserNameAvailability.bind(this);
        this.validateEmailAvailability = this.validateEmailAvailability.bind(this);
        this.validateManagerEmailAvailability = this.validateManagerEmailAvailability.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    handleInputChange(event, validationFun) {
        const target = event.target;
        const inputName = target.name;        
        const inputValue = target.value;

        this.setState({
            [inputName] : {
                value: inputValue,
                ...validationFun(inputValue)
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
    
        const signupRequest = {
            fullName: this.state.fullName.value,
            userName: this.state.userName.value,
            email: this.state.email.value,
            managerEmail: this.state.managerEmail.value,
            password: this.state.password.value
        };
        signup(signupRequest)
        .then(response => {
            notification.success({
                message: APP_NAME,
                description: "Thank you! You're successfully registered. Please Login to continue!",
            });          
            this.props.history.push("/login");
        }).catch(error => {
            notification.error({
                message: APP_NAME,
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        });
    }

    isFormInvalid() {
        return !(
            this.state.fullName.validateStatus === 'success' &&
            this.state.userName.validateStatus === 'success' &&
            this.state.email.validateStatus === 'success' &&
            this.state.managerEmail.validateStatus === 'success' &&
            this.state.password.validateStatus === 'success'
        );
    }

    render() {
        return (
            <div className="signup-container">
                <h1 className="page-title">Sign Up</h1>
                <div className="signup-content">
                    <Form onSubmit={this.handleSubmit} className="signup-form">
                        <FormItem label="Fullname"
                            hasFeedback
                            validateStatus={this.state.fullName.validateStatus}
                            help={this.state.fullName.errorMsg}>
                            <Input 
                                size="large"
                                name="fullName" 
                                autoComplete="off"
                                placeholder="Full name"
                                value={this.state.fullName.value} 
                                onChange={(event) => this.handleInputChange(event, this.validateFullName)} />    
                        </FormItem>
                        <FormItem label="Username"
                            hasFeedback
                            validateStatus={this.state.userName.validateStatus}
                            help={this.state.userName.errorMsg}>
                            <Input 
                                size="large"
                                name="userName" 
                                autoComplete="off"
                                placeholder="A unique username"
                                value={this.state.userName.value} 
                                onBlur={this.validateUserNameAvailability}
                                onChange={(event) => this.handleInputChange(event, this.validateUserName)} />    
                        </FormItem>
                        <FormItem 
                            label="Email"
                            hasFeedback
                            validateStatus={this.state.email.validateStatus}
                            help={this.state.email.errorMsg}>
                            <Input 
                                size="large"
                                name="email" 
                                type="email" 
                                autoComplete="off"
                                placeholder="Your email"
                                value={this.state.email.value} 
                                onBlur={this.validateEmailAvailability}
                                onChange={(event) => this.handleInputChange(event, this.validateEmail)} />    
                        </FormItem>
                        <FormItem 
                            label="Manager Email"
                            hasFeedback
                            validateStatus={this.state.managerEmail.validateStatus}
                            help={this.state.managerEmail.errorMsg}>
                            <Input 
                                size="large"
                                name="managerEmail"
                                type="email" 
                                autoComplete="off"
                                placeholder="Manager email"
                                value={this.state.managerEmail.value} 
                                onBlur={this.validateManagerEmailAvailability}
                                onChange={(event) => this.handleInputChange(event, this.validateManagerEmail)} />    
                        </FormItem>
                        <FormItem 
                            label="Password"
                            validateStatus={this.state.password.validateStatus}
                            help={this.state.password.errorMsg}>
                            <Input 
                                size="large"
                                name="password" 
                                type="password"
                                autoComplete="off"
                                placeholder="A password between 6 to 20 characters" 
                                value={this.state.password.value} 
                                onChange={(event) => this.handleInputChange(event, this.validatePassword)} />    
                        </FormItem>
                        <FormItem>
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                className="signup-form-button"
                                disabled={this.isFormInvalid()}>Sign up</Button>
                            Already registed? <Link to="/login">Login now!</Link>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }

    // Validation Functions

    validateEmail = (email) => {
        if(!email) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email may not be empty'                
            }
        }

        const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
        if(!EMAIL_REGEX.test(email)) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email not valid'
            }
        }

        if(email.length > EMAIL_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed)`
            }
        }

        return {
            validateStatus: null,
            errorMsg: null
        }
    }

    validateManagerEmail = (managerEmail) => {
        if(!managerEmail) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email may not be empty'                
            }
        }

        const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
        if(!EMAIL_REGEX.test(managerEmail)) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email not valid'
            }
        }

        if(managerEmail.length > MANAGEREMAIL_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Email is too long (Maximum ${MANAGEREMAIL_MAX_LENGTH} characters allowed)`
            }
        }

        return {
            validateStatus: null,
            errorMsg: null
        }
    }

    validateFullName = (fullName) => {
        if(fullName.length < ANYNAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Full name is too short (Minimum ${ANYNAME_MIN_LENGTH} characters needed.)`
            }
        } else if (fullName.length > ANYNAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Full name is too long (Maximum ${ANYNAME_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    validateUserName = (username) => {
        if(username.length < USERNAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Username is too short (Minimum ${USERNAME_MIN_LENGTH} characters needed.)`
            }
        } else if (username.length > USERNAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Username is too long (Maximum ${USERNAME_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: null,
                errorMsg: null
            }
        }
    }

    validateUserNameAvailability() {
        // First check for client side errors in username
        const userNameValue = this.state.userName.value;
        const userNameValidation = this.validateUserName(userNameValue);

        if(userNameValidation.validateStatus === 'error') {
            this.setState({
                userName: {
                    value: userNameValue,
                    ...userNameValidation
                }
            });
            return;
        }

        this.setState({
            userName: {
                value: userNameValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkUserNameAvailability(userNameValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    userName: {
                        value: userNameValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    userName: {
                        value: userNameValue,
                        validateStatus: 'error',
                        errorMsg: 'This username is already taken'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                userName: {
                    value: userNameValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    validateEmailAvailability() {
        // First check for client side errors in email
        const emailValue = this.state.email.value;
        const emailValidation = this.validateEmail(emailValue);

        if(emailValidation.validateStatus === 'error') {
            this.setState({
                email: {
                    value: emailValue,
                    ...emailValidation
                }
            });    
            return;
        }

        this.setState({
            email: {
                value: emailValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkEmailAvailability(emailValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    email: {
                        value: emailValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    email: {
                        value: emailValue,
                        validateStatus: 'error',
                        errorMsg: 'This Email is already registered'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                email: {
                    value: emailValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    validateManagerEmailAvailability() {
        // First check for client side errors in email
        const managerEmailValue = this.state.managerEmail.value;
        const managerEmailValidation = this.validateManagerEmail(managerEmailValue);

        if(managerEmailValidation.validateStatus === 'error') {
            this.setState({
                managerEmail: {
                    value: managerEmailValue,
                    ...managerEmailValidation
                }
            });    
            return;
        }

        this.setState({
            managerEmail: {
                value: managerEmailValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkManagerEmailAvailability(managerEmailValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    managerEmail: {
                        value: managerEmailValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    managerEmail: {
                        value: managerEmailValue,
                        validateStatus: 'error',
                        errorMsg: 'Manager email does not exist'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                managerEmail: {
                    value: managerEmailValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    validatePassword = (password) => {
        if(password.length < PASSWORD_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`
            }
        } else if (password.length > PASSWORD_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };            
        }
    }

}

export default Signup;