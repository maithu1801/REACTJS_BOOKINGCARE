import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import { toast } from 'react-toastify';
import * as actions from "../../store/actions";
import './Login.scss';
import LoadingOverlay from "react-loading-overlay";
import { handleLoginApi, postSendEmail } from '../../services/userService';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowPassword: false,
            errMessage: '',
            changepassword: false,
            dataModal: {},
        }
    }

    handleOnChangeUsername = (event) => {
        this.setState({
            username: event.target.value
        })
    }

    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    handleLogin = async () => {
        this.setState({
            errMessage: ''
        })

        try {
            let data = await handleLoginApi(this.state.username, this.state.password);
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                })
            }
            if (data && data.errCode === 0) {
                this.props.userLoginSuccess(data.user);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })
                }
            }
        }
    }

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            this.handleLogin();
        }
    }
    changepassword = async () => {
        this.setState({
            changepassword: true,
        })
    }
    sendEmail = async () => {
        let data = {
            email: this.state.email,
        }
        this.setState({
            isShowLoading: true
        })
        let res = await postSendEmail(data);
       
        if (res && res.errCode === 0) {
            this.setState({
                isShowLoading: false
            })
            toast.success('Gửi email thành công ! ');
        } else {
            this.setState({
                isShowLoading: false
            })
            toast.error('Gửi mail thất bại');
        }

    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        });
    }
    render() {

        return (
            <React.Fragment>
                {this.state.changepassword === true ?
                    <React.Fragment>
                        {/* <LoadingOverlay
                            active={this.state.isShowLoading}
                            spinner
                            text='Loading...'
                        > */}
                        <div className="login-backgroup">
                            <div className="login-container">
                                <div className="login-content row">
                                    <div className="col-12 text-login">Change password</div>
                                    <div className="col-12 form-group login-input">
                                        <label>Email: </label>
                                        <input type="text"
                                            className="form-control"
                                            placeholder='Enter your email'
                                            value={this.state.email}
                                            onChange={(event) => { this.handleOnChangeInput(event, "email") }}

                                        />
                                    </div>
                                    <div className="col-12">
                                        <button className='btn-login' onClick={() => { this.sendEmail() }}>OK</button>

                                    </div>

                                </div>
                            </div>
                        </div>
                        {/* </LoadingOverlay> */}
                    </React.Fragment> :
                    <React.Fragment>
                        <div className="login-backgroup">
                            <div className="login-container">
                                <div className="login-content row">
                                    <div className="col-12 text-login">Login</div>
                                    <div className="col-12 form-group login-input">
                                        <label>User Name: </label>
                                        <input type="text"
                                            className="form-control"
                                            placeholder='Enter your username'
                                            value={this.state.username}
                                            onChange={(event) => this.handleOnChangeUsername(event)}
                                        />
                                    </div>
                                    <div className="col-12 form-group login-input">
                                        <label>Password: </label>
                                        <div className='custom-input-password'>
                                            <input className="form-control"
                                                type={this.state.isShowPassword ? 'text' : 'password'}
                                                placeholder="Enter your password"
                                                onChange={(event) => { this.handleOnChangePassword(event) }}
                                                // value={this.state.password}
                                                onKeyDown={(event) => this.handleKeyDown(event)}
                                            />
                                            <span
                                                onClick={() => { this.handleShowHidePassword() }}
                                            ><i className={this.state.isShowPassword ? 'far fa-eye' : 'far fa-eye-slash'}></i></span>
                                        </div>

                                    </div>
                                    <div className='col-12' style={{ color: 'red' }}>
                                        {this.state.errMessage}
                                    </div>
                                    <div className="col-12">
                                        <button className='btn-login' onClick={() => { this.handleLogin() }}>Login</button>
                                    </div>
                                    <div className="col-12 ">
                                        <span className='forgot-password' onClick={() => { this.changepassword() }}>Forgot your passwoed?</span>
                                    </div>
                                    {/* <div className="col-12 text-center mt-3">
         <span className="text-order-login">Or login with: </span>
     </div>
     <div className="col-12 social-login">
         <i className="fab fa-google-plus-g google"></i>
         <i className="fab fa-facebook-f facebook"></i>
     </div> */}


                                </div>
                            </div>
                        </div>
                    </React.Fragment>

                }

            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginSuccess: (userInfor) => dispatch(actions.userLoginSuccess(userInfor))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
