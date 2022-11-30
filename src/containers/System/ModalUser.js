import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../utils";
import { emitter } from "../../utils/emitter";
import * as action from "../../store/actions";

class ModalUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgURL: '',
            isOpen: false,

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
        }
        this.listenToEmitter();
    }

    listenToEmitter() {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address: '',
            })
        })
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''
            })
        }

        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux;
            this.setState({
                roleArr: arrRoles,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : ''
            })
        }
        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux;
            this.setState({
                positionArr: arrPositions,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : ''
            })
        }

        if (prevProps.listUsers !== this.props.listUsers) {
            let arrGenders = this.props.genderRedux;
            let arrRoles = this.props.roleRedux;
            let arrPositions = this.props.positionRedux;

            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phonenumber: '',
                address: '',
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '',
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : '',
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : '',
                avatar: '',
                action: CRUD_ACTIONS.CREATE,
                previewImgURL: ''
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
        let arrCheck = ['email', 'password', 'firstName', 'lastName',
            'phonenumber', 'address']
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert('this input is required: ' + arrCheck[i])
                break;
            }
        }
        return isValid;
    }
    handleAddNewUser = () => {
        let isValid = this.checkValidateInput();
        if (isValid === true) {
            this.props.createNewUser(this.state, 'abc');
        }
    }

    onChangeInput = (event, id) => {
        let copyState = { ...this.state }
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
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
        if (!this.state.previewImgURL) return;
        this.setState({
            isOpen: true
        })
    }
    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if (isValid === false) return;

        let { action } = this.state;
        if (action === CRUD_ACTIONS.CREATE) {
            //fire redux action
            this.props.createNewUser({
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
        }
        if (action === CRUD_ACTIONS.EDIT) {
            //fire redux action
            this.props.editUserRedux({
                id: this.state.userEditId,
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
        }
    }

    render() {
        let genders = this.state.genderArr;
        let roles = this.state.roleArr;
        let positions = this.state.positionArr;
        let language = this.props.language;
        let isGetGenders = this.props.isLoadingGender;
        let { email, password, firstName, lastName,
            phonenumber, address, role, gender, position } = this.state;

        return (
            <Modal isOpen={this.props.isOpen}
                toggle={() => { this.toggle() }}
                className={'modal-user-container'}
                size="lg"
            >
                <ModalHeader toggle={() => { this.toggle() }}><FormattedMessage id="manage-user.manage" /><i className="closes"></i></ModalHeader>
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
                                    style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
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
                                onChange={(event) => this.onChangeInput(event, 'email')}
                                disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                            />
                        </div>
                        <div className='col-3'>
                            <label><FormattedMessage id="manage-user.password" /></label>
                            <input className='form-control' type="password"
                                value={password}
                                onChange={(event) => { this.onChangeInput(event, 'password') }}
                                disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                            />
                        </div>
                        <div className='col-3'>
                            <label><FormattedMessage id="manage-user.first-name" /></label>
                            <input className='form-control' type="text"
                                value={firstName}
                                onChange={(event) => { this.onChangeInput(event, 'firstName') }}
                            />
                        </div>
                        <div className='col-3'>
                            <label><FormattedMessage id="manage-user.last-name" /></label>
                            <input className='form-control' type="text"
                                value={lastName}
                                onChange={(event) => { this.onChangeInput(event, 'lastName') }}
                            />
                        </div>
                        <div className='col-3'>
                            <label><FormattedMessage id="manage-user.phone-number" /></label>
                            <input className='form-control' type="text"
                                value={phonenumber}
                                onChange={(event) => { this.onChangeInput(event, 'phonenumber') }}
                            />
                        </div>
                        <div className='col-9'>
                            <label><FormattedMessage id="manage-user.address" /></label>
                            <input className='form-control' type="text"
                                value={address}
                                onChange={(event) => { this.onChangeInput(event, 'address') }}
                            />
                        </div>
                        <div className='col-3'>
                            <label><FormattedMessage id="manage-user.gender" /></label>
                            <select className='form-control'
                                onChange={(event) => { this.onChangeInput(event, 'gender') }}
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
                                onChange={(event) => { this.onChangeInput(event, 'position') }}
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
                                onChange={(event) => { this.onChangeInput(event, 'role') }}

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

                <div className='col-12 my-3'>
                    <button
                        className={this.state.action === CRUD_ACTIONS.EDIT ? "btn btn-warning " : "btn btn-warning save"}
                        onClick={() => this.handleSaveUser()}
                    >
                        {this.state.action === CRUD_ACTIONS.EDIT ?
                            <FormattedMessage id="manage-user.edit" />
                            :
                            <FormattedMessage id="manage-user.save" />
                        }
                    </button>
                    <button
                        color="secondary"
                        className="px-6"
                        onClick={() => { this.toggle() }}
                    >Close</button>
                </div>



            </Modal>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        roleRedux: state.admin.roles,
        positionRedux: state.admin.positions,
        isLoadingGender: state.admin.isLoadingGender,
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(action.fetchGenderStart()),
        getPositionStart: () => dispatch(action.fetchPositionStart()),
        getRoleStart: () => dispatch(action.fetchRoleStart()),
        createNewUser: (data) => dispatch(action.createNewUser(data)),
        fetchUserRedux: () => dispatch(action.fetchAllUsersStart()),
        editUserRedux: (data) => dispatch(action.editUser(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
