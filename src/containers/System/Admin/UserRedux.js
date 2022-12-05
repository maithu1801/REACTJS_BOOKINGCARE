import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as action from "../../../store/actions";
import './UserRedux.scss';
import 'react-image-lightbox/style.css';
import ModalUser from '../ModalUser';
import ModalEditUser from "../ModalEditUser";
import { editUserService, getAllUsers, saveDetailDoctorService } from '../../../services/userService';
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { toast } from 'react-toastify';

class UserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersRedux: [],
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgURL: '',
            isOpen: false,

            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phonenumber: '',
            address: '',
            position: '',
            role: '',
            avatar: '',
            action: '',
            userEditId: '',
            isOpenModalEditUser: false,

        }
    }
    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
        this.props.fetchUserRedux();
        await this.getAllUsersFromReact();
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
                previewImgURL: '',
                usersRedux: this.props.listUsers
            })
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
    onChangeInput = (event, id) => {
        let copyState = { ...this.state }
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }
    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser,
        })
    }
    toggleUserEditModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser,
        })
    }
    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true
        })
    }
    handleEditUser = (user) => {
        let imageBase64 = '';
        if (user.image) {
            imageBase64 = new Buffer(user.image, 'base64').toString('binary');
        }
        this.setState({
            email: user.email,
            password: 'HARDCODE',
            firstName: user.firstName,
            lastName: user.lastName,
            phonenumber: user.phonenumber,
            address: user.address,
            gender: user.gender,
            role: user.roleId,
            position: user.positionId,
            avatar: user.image,
            previewImgURL: imageBase64,
            action: CRUD_ACTIONS.EDIT,
            userEditId: user.id,
            isOpenModalEditUser: true,
            userEdit: user
        })
    }
    doEditUser = async (user) => {
        try {
            let res = await editUserService(user)
            if (res && res.errCode === 0) {
                this.setState({
                    isOpenModalEditUser: false
                })
                await this.getAllUsersFromReact()
            } else {
                alert(res.errCode)
            }
        } catch (e) {
            console.log(e)
        }
    }
    getAllUsersFromReact = async () => {
        let response = await getAllUsers('ALL');
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users
            })
        }
    }
    getAllUsersPatient = async () => {
        let response = await getAllUsers('PATIENT');
        console.log('response', response);
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users
            })
        }
    }
    getAllUsersDoctor = async () => {
        let response = await getAllUsers('DOCTOR');
        console.log('response', response);
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users
            })
        }
    }
    handleDeleteUser = (user) => {
        this.props.deleteUserRedux(user.id);
    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }
    searchDoctor = async () => {
        let data = {
            type: 'search-user',
            keyWord: this.state.keyWord
        }
        let res = await saveDetailDoctorService(data);
        if (res.err) {
            toast.error("Đã xảy ra lỗi !");
        } else if (res.doctor) {
            this.setState({
                arrUsers: res.doctor
            })
        }
    }
    selectAllDoctor = async () => {
        let response = await getAllUsers('ALL');
        this.setState({
            arrUsers: response.users
        })
    }
    render() {
        // let arrUsers = this.props.listUsers;
        let arrUsers = this.state.arrUsers;

        console.log('arrUsers', arrUsers);
        return (
            <div className='user-redux-container'>
                <ModalUser
                    isOpen={this.state.isOpenModalUser}
                    toggleFromPrarent={this.toggleUserModal}
                    createNewUser={this.createNewUser}

                />
                {
                    this.state.isOpenModalEditUser &&
                    <ModalEditUser
                        isOpen={this.state.isOpenModalEditUser}
                        toggleFromPrarent={this.toggleUserEditModal}
                        currentUser={this.state.userEdit}
                        editUser={this.doEditUser}
                        genderArr={this.state.genderArr}
                        positionArr={this.state.positionArr}
                        roleArr={this.state.roleArr}
                        previewImgURL={this.state.previewImgURL}
                    />
                }
                <div className='title'>
                    <FormattedMessage id="manage-user.manage" />
                </div>
                <div className="mx-1">
                    <button className="btn btn-primary px-3"
                        onClick={() => this.handleAddNewUser()}
                    ><i className="fas fa-plus"></i> <FormattedMessage id="manage-user.add-new-user" /></button>

                    <button className="btn btn-primary px-3"
                        onClick={() => this.getAllUsersFromReact()}
                    ><FormattedMessage id="manage-user.list-user" /></button>

                    <button className="btn btn-primary px-3"
                        onClick={() => this.getAllUsersPatient()}
                    ><FormattedMessage id="manage-user.list-patient" /></button>

                    <button className="btn btn-primary px-3"
                        onClick={() => this.getAllUsersDoctor()}
                    ><FormattedMessage id="manage-user.list-doctor" /></button>
                    <div className='search-user'>
                        <input
                            placeholder="Tìm kiếm tất cả người dùng"
                            value={this.state.keyWord}
                            onChange={(event) => this.handleOnChangeInput(event, 'keyWord')}
                        >
                        </input>

                        <div className='search-doctor-btn'
                            onClick={() => this.searchDoctor()}
                        ><i class="fas fa-search"></i>
                        </div>

                        <div className='search-doctor-btn'
                            onClick={() => this.selectAllDoctor()}
                        ><i class="fas fa-undo"></i>
                        </div>
                        <div className="btn-excel">
                            <ReactHTMLTableToExcel
                                id="test-table-xls-button"
                                className="download-table-xls-button"
                                table="table-excel"
                                filename="nguoidung"
                                sheet="tatcanguoidung"
                                buttonText=""
                            >
                            </ReactHTMLTableToExcel>
                            <div className="excel-icon">
                                <i className="fas fa-file-excel"></i>
                            </div>
                        </div>
                    </div>

                </div>

                <div className='user-redux-body'>
                    <table id="TableManageUser">
                        <tbody>
                            <tr>
                                <th>Ảnh đại diện</th>
                                <th>Email</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Address</th>
                                <th>Vai trò</th>
                                <th>Actions</th>
                            </tr>
                            {arrUsers && arrUsers.length > 0 &&
                                arrUsers.map((item, index) => {
                                    let imageBase64 = '';
                                    if (item.image) {
                                        imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                                    }
                                    return (
                                        <tr key={index} >
                                            {imageBase64 === '' ?
                                                <td style={{ textAlign: 'center' }}>Bệnh nhân - không có hình ảnh</td> :
                                                <td style={{ textAlign: 'center' }}><img className='img-avt' src={imageBase64} /></td>
                                            }
                                            <td>{item.email}</td>
                                            <td>{item.firstName}</td>
                                            <td>{item.lastName}</td>
                                            <td>{item.address}</td>
                                            {item.roleId === 'R1' &&
                                                <td>Quản trị viên</td>
                                            }
                                            {item.roleId === 'R2' &&
                                                <td>Bác sĩ</td>
                                            }
                                            {item.roleId === 'R3' &&
                                                <td>Bệnh nhân</td>
                                            }
                                            <td>
                                                <button
                                                    onClick={() => this.handleEditUser(item)}
                                                    className='btn-edit'><i className='fas fa-pencil-alt'></i></button>
                                                <button
                                                    onClick={() => this.handleDeleteUser(item)}
                                                    className="btn-delete"><i className='fas fa-trash'></i>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    <table id="table-excel">
                        <tbody>
                            <tr>
                                <th>Ảnh đại diện</th>
                                <th>Email</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Address</th>
                                <th>Vai trò</th>
                            </tr>
                            {arrUsers && arrUsers.length > 0 &&
                                arrUsers.map((item, index) => {
                                    let imageBase64 = '';
                                    if (item.image) {
                                        imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                                    }
                                    return (
                                        <tr key={index} >
                                            <td style={{ textAlign: 'center' }}>
                                                <img className='img-avt' src={imageBase64} /></td>
                                            <td>{item.email}</td>
                                            <td>{item.firstName}</td>
                                            <td>{item.lastName}</td>
                                            <td>{item.address}</td>
                                            {item.roleId === 'R1' &&
                                                <td>Quản trị viên</td>
                                            }
                                            {item.roleId === 'R2' &&
                                                <td>Bác sĩ</td>
                                            }
                                            {item.roleId === 'R3' &&
                                                <td>Bệnh nhân</td>
                                            }
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
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
}

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(action.fetchGenderStart()),
        getPositionStart: () => dispatch(action.fetchPositionStart()),
        getRoleStart: () => dispatch(action.fetchRoleStart()),
        createNewUser: (data) => dispatch(action.createNewUser(data)),
        fetchUserRedux: () => dispatch(action.fetchAllUsersStart()),
        editUserRedux: (data) => dispatch(action.editUser(data)),
        deleteUserRedux: (id) => dispatch(action.deleteUser(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);