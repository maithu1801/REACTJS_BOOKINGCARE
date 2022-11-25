import React, { Component } from 'react';
import { connect } from "react-redux";
import { postVerifyChangeLogin } from "../../services/userService";
import './VerifyChangeLogin.scss';
import { toast } from 'react-toastify';
import { editUserPassword } from '../../services/userService';

class VerifyChangeLogin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isValid: false,
            errCode: 0,
            password: '',
            email: '',
            token: "",
        }
    }

    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search);
            let token = urlParams.get('token');
            let email = urlParams.get('email');
            this.setState({
                token: token,
                email: email,
            })
            let res = await postVerifyChangeLogin({
                token: token,
                email: email
            })
            console.log('resssssss', res);
            if (res && res.errCode === 0) {
                this.setState({
                    errCode: res.errCode
                })
            } else {
                this.setState({
                    errCode: res && res.errCode ? res.errCode : -1
                })
            }
        }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

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


    handleSavePassword = async () => {
        let data = {
            password: this.state.password,
            token: this.state.token,
            email: this.state.email
        };
        console.log("ok", data);
        let res = await editUserPassword(data);
        console.log('resss', res);
        if (!res.err) {
            toast.success('Cập nhật thành công!');
            window.location = "/login"
        } else {
            toast.error("Đã xảy ra lỗi");
        }

    }
    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }


    render() {
        let { errCode, password } = this.state;
        return (
            <>
                <React.Fragment>
                    <div className="login-backgroup">
                        {+errCode === 0 &&
                            <div className="login-container">
                                <div className="login-content row">
                                    <div className="col-12 text-login">Change password</div>
                                    <div className="col-12 form-group login-input">
                                        <label>New password: </label>
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
                                    <div className="col-12 form-group login-input">
                                        <label>Enter a new password again: </label>
                                        <div className='custom-input-password'>
                                            <input className="form-control"
                                                type={this.state.isShowPassword ? 'text' : 'password'}
                                                placeholder="Enter your password again"
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
                                        <button className='btn-login' onClick={() => { this.handleSavePassword() }}>OK</button>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </React.Fragment>
            </>

        );

    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,

    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyChangeLogin);
