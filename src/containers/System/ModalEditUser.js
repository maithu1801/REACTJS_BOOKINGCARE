import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../utils";
import * as action from "../../store/actions";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';


class ModalEditUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            phonenumber: '',
            position: '',
            role: '',
            avatar: '',
            action: '',
            userEditId: '',
            isOpen: false,
            imagefullscreen: '',
        }
    }

    componentDidMount() {
        let user = this.props.currentUser;
        console.log('nhan user: ', user);
        if (user && !_.isEmpty(user)) {
            this.setState({
                id: user.id,
                email: user.email,
                password: 'harcode',
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address,
                gender: user.gender,
                phonenumber: user.phonenumber,
                position: user.positionId,
                role: user.roleId,
                avatar: user.image,
            })
        }
    }

    toggle = () => {
        this.props.toggleFromPrarent();
    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        });
    }

    checkValidateInput = () => {
        let isValid = true;
        let arrInput = ['email', 'password', 'firstName', 'lastName', 'address', 'phonenumber'];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                alert('Missing parameter: ' + arrInput[i]);
                break;
            }
        }
        return isValid;
    }
    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if (isValid === true) {
            this.props.editUserRedux({
                id: this.state.id,
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phonenumber: this.state.phonenumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar
            })
            this.toggle();
        }
    }
    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                avatar: base64
            })
        }
    }
    openPreviewImage = () => {
        console.log('onclick....');
        if (!this.props.previewImgURL) return;
        this.setState({
            isOpen: true
        })
    }
    // imagefullscreen = (link) => {
    //     this.setState({
    //         imagefullscreen: link,
    //         isOpen: true,
    //     })
    // }
    render() {
        let genders = this.props.genderArr;
        let roles = this.props.roleArr;
        let positions = this.props.positionArr;
        let language = this.props.language;
        let isGetGenders = this.props.isLoadingGender;
        let previewImgURL = this.props.previewImgURL;
        let { email, password, firstName, lastName,
            phonenumber, address, role, gender, position } = this.state;

        return (
            <>
                <Modal isOpen={this.props.isOpen}
                    toggle={() => { this.toggle() }}
                    className={'modal-user-container'}
                    size="lg"
                >
                    <ModalHeader toggle={() => { this.toggle() }}>Edit a new user</ModalHeader>
                    <ModalBody>
                        <div className='modal-user-body'>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.image" /></label>
                                <div className='preview-img-container'>

                                    <input id="previewImg" type="file" hidden
                                        onChange={(event) => this.handleOnChangeImage(event)}
                                    />
                                    <label className='label-upload' htmlFor="previewImg">Tải ảnh<i className='fas fa-upload'></i></label>

                                    <div className='preview-image'
                                        style={{ backgroundImage: `url(${this.props.previewImgURL})` }}
                                        onClick={() => this.openPreviewImage()}
                                    >
                                    </div>
                                </div>
                            </div>
                            <div className='col-12'>{isGetGenders === true ? 'Loading genders' : ''}</div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.email" /></label>
                                <input className='form-control' type="email"
                                    value={email}
                                    onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.password" /></label>
                                <input className='form-control' type="password"
                                    value={password}
                                    onChange={(event) => { this.handleOnChangeInput(event, 'password') }}
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.first-name" /></label>
                                <input className='form-control' type="text"
                                    value={firstName}
                                    onChange={(event) => { this.handleOnChangeInput(event, 'firstName') }}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.last-name" /></label>
                                <input className='form-control' type="text"
                                    value={lastName}
                                    onChange={(event) => { this.handleOnChangeInput(event, 'lastName') }}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.phone-number" /></label>
                                <input className='form-control' type="text"
                                    value={phonenumber}
                                    onChange={(event) => { this.handleOnChangeInput(event, 'phonenumber') }}
                                />
                            </div>
                            <div className='col-9'>
                                <label><FormattedMessage id="manage-user.address" /></label>
                                <input className='form-control' type="text"
                                    value={address}
                                    onChange={(event) => { this.handleOnChangeInput(event, 'address') }}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.gender" /></label>
                                <select className='form-control'
                                    onChange={(event) => { this.handleOnChangeInput(event, 'gender') }}
                                    value={gender}
                                >
                                    {genders && genders.length > 0 &&
                                        genders.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.position" /></label>
                                <select className='form-control'
                                    onChange={(event) => { this.handleOnChangeInput(event, 'position') }}
                                    value={position}
                                >
                                    {positions && positions.length > 0 &&
                                        positions.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.role" /></label>
                                <select className='form-control'
                                    value={role}
                                    onChange={(event) => { this.handleOnChangeInput(event, 'role') }}

                                >
                                    {roles && roles.length > 0 &&
                                        roles.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary"
                            className="px-3"
                            onClick={() => { this.handleSaveUser() }}
                        >Save changes</Button>{' '}
                        <Button
                            color="secondary"
                            className="px-3"
                            onClick={() => { this.toggle() }}
                        >Close</Button>
                    </ModalFooter>

                </Modal>
                {this.state.isOpen === true &&
                    <Lightbox
                        mainSrc={this.state.openPreviewImage}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                }
            </>
        )
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
        editUserRedux: (data) => dispatch(action.editUser(data)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
