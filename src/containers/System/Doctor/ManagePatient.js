import React, { Component } from "react";
import { connect } from "react-redux";
import './ManagePatient.scss';
import { FormattedMessage } from "react-intl";
import DatePicker from '../../../components/Input/DatePicker';
import { getAllPatientDoctor, postSendRemedy, getListHistory, createHistory, searchPatient } from '../../../services/userService';
import moment from "moment";
import { LANGUAGES } from '../../../utils';
import RemedyModal from './RemedyModal';
import { toast } from 'react-toastify';
import LoadingOverlay from "react-loading-overlay";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import _ from 'lodash';

class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            isShowLoading: false,
            dataModal: {},


            showTableInfo: false,
            arrInfo: {},
            patient: '',
            patientId: '',

            imgFullScreen: '',
            isOpen: false,
            keyWord: '',
            formatedDate: '',
        }
    }


    async componentDidMount() {
        this.getDataPatient()


    }

    getDataPatient = async () => {
        let { user } = this.props;
        let { currentDate } = this.state;
        let formatedDate = new Date(currentDate).getTime();
        // this.getDataPatient(user, formatedDate);
        // conf them cai date nua chu, tai luc tim kiem ket hop voi chonj ngay
        let res = await getAllPatientDoctor({
            doctorId: user.id,
            date: formatedDate,
        })

        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data,
                formatedDate: formatedDate
            })
        }

    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }
    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0],
            keyWord: '',
        }, async () => {
            await this.getDataPatient()
        })
    }

    handleBtnComfirm = (item) => {
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.patientData.email,
            timeType: item.timeType,
            patientName: item.patientData.firstName,
        }
        this.setState({
            isOpenRemedyModal: true,
            dataModal: data,
            patientId: item.patientId
        })
        console.log('lay data:', data);
    }

    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            dataModal: {}
        })
    }
    sendRemedy = async (dataChild) => {
        let { dataModal } = this.state;
        this.setState({
            isShowLoading: true
        })
        let res = await postSendRemedy({
            email: dataChild.email,
            imgBase64: dataChild.imgBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            language: this.props.language,
            patientName: dataModal.patientName
        });
        if (res && res.errCode === 0) {
            this.setState({
                isShowLoading: false
            })
            toast.success('Send Remedy succeeds ');
            this.closeRemedyModal();
            await this.getDataPatient();
        } else {
            this.setState({
                isShowLoading: false
            })
            toast.error('Something wrongs....');
            console.log('error send remedy: ', res)
        }
    }
    showInfoTable = async (patientId) => {
        let data = {
            type: 'get',
            patientId: patientId
        }
        let res = await getListHistory(data);
        console.log('Resss: ', res);
        if (!res || res.err) {
            toast.error("Đã xảy ra lỗi !!!")
        } else {
            this.setState({
                showTableInfo: true,
                arrInfo: res,
                patient: `${res[0].dataPatient.lastName} ${res[0].dataPatient.firstName}`
            })
        }
    }
    handleSaveNewHistory = async () => {
        let res = await createHistory(this.state);
        if (res && res.errCode === 0) {
            toast.success('Add new specialty succeeds!');
        } else {
            toast.error('Somthing wrongs...')
            console.log('check res: ', res)
        }
    }
    imgFullScreen = (link) => {
        this.setState({
            imgFullScreen: link,
            isOpen: true,
        })
    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }
    searchPatient = async () => {
        // bên đây gửi dữ liệu, bao gồm keyWord nhập vô, ngày, và id bác sĩ
        // Gửi qua bên node, do nhập là nhập ten bệnh nhân, ma trong bang booking chỉ có id bệnh nhân
        // nên phải tìm ra id bên nhân có tên trùng với nhập vô, do khi nhập tên nó tìm giống, ví dụ le van lam, le ngoc phuc
        //  tim chu le nó sẽ ra 2 cái id nên mình sẽ phải tra từng id bệnh nhân tìn đc vào bảng booking
        // nêu id benh nhan nao co trong bang booking + idbáci + ngay trung khop thi them vo mang ket qua,
        let data = {
            keyWord: this.state.keyWord,
            doctorId: this.props.user.id,
            date: this.state.formatedDate
        }
        let res = await searchPatient(data);
        if (!_.isEmpty(res.booking)) {
            // trả ket qua ve gan lai vo bien dtâPtien giong nhu cai ham dau tien khi chon ngay no gán vào
            this.setState({
                dataPatient: res.booking,
            })
        } else {
            toast.warning("Không tìm thấy dữ liệu trùng khớp với yêu cầu !");
        }
    }
    render() {
        let { dataPatient, isOpenRemedyModal, dataModal } = this.state;
        let { language } = this.props;
        let arrInfo = this.state.arrInfo;
        return (
            <>  {this.state.showTableInfo === true ?
                <React.Fragment>
                    <div className="table-info">
                        <div className="table-content">
                            <div className="table-header">
                                <b>LỊCH SỬ KHÁM BỆNH</b>
                                <i class="fas fa-sign-out-alt"
                                    onClick={() => this.setState({ showTableInfo: false })}
                                ></i>
                            </div>
                            <div className="table-tool">
                                <b>Bệnh nhân: </b> <span>{this.state.patient}</span>
                            </div>
                            <div className="table-body">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className="table-title">Ngày</td>
                                            <td className="table-title">Bác sĩ</td>
                                            <td className="table-title">Lịch sử bệnh án</td>
                                            <td className="table-title">Đơn thuốc</td>
                                        </tr>
                                        {arrInfo && arrInfo.length > 0 && arrInfo.map((item, index) => {
                                            let date = new Date(item.createdAt);
                                            let dd = date.getDate();
                                            let mm = date.getMonth() + 1;
                                            let yy = date.getFullYear();
                                            let time_vi = `${dd}-${mm}-${yy}`;
                                            let time_en = `${mm}-${dd}-${yy}`;
                                            let imageBase64 = '';
                                            if (item.files) {
                                                imageBase64 = new Buffer(item.files, 'base64').toString('binary');
                                            }

                                            return (
                                                <React.Fragment>
                                                    <tr key={index}>
                                                        <td >{time_vi}</td>
                                                        <td > {item.dataDoctor.lastName} {item.dataDoctor.firstName}</td>
                                                        <td >{item.description}</td>
                                                        <td style={{ textAlign: 'center', cursor: 'pointer' }}>
                                                            <img className='img-avt' src={imageBase64}
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => this.imgFullScreen(imageBase64)}
                                                            /></td>
                                                    </tr>
                                                </React.Fragment>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </React.Fragment> :
                <React.Fragment>
                    <LoadingOverlay
                        active={this.state.isShowLoading}
                        spinner
                        text='Loading...'
                    >
                        <div className='manage-patient-container'>
                            <div className='m-p-title'>
                                Quản lý bệnh nhân khám bệnh
                            </div>
                            <div className='manage-patient-body row'>
                                <div className='col-4 form-group'>
                                    <label>Chọn ngày khám</label>
                                    <DatePicker
                                        onChange={this.handleOnChangeDatePicker}
                                        className="form-control"
                                        value={this.state.currentDate}
                                    />
                                </div>
                                <div className='search'>
                                    <label>Tên bệnh nhân: </label>
                                    <input type="text"
                                        placeholder='Tìm kiếm'
                                        value={this.state.keyWord}
                                        onChange={(event) => this.handleOnChangeInput(event, 'keyWord')}
                                    ></input>
                                    <div className="tim_kiem"
                                        onClick={() => this.searchPatient()}
                                    ><i className="fas fa-search"></i></div>
                                    <div className="cap_nhat"
                                        onClick={() => this.getDataPatient()}
                                    ><i className="fas fa-undo" ></i></div>
                                </div>
                                <div className="col-12 table-manage-patient">
                                    <table style={{ width: '100%' }}>
                                        <tbody>
                                            <tr>
                                                <th>STT</th>
                                                <th>Thời gian</th>
                                                <th>Họ và tên</th>
                                                <th>Địa chỉ</th>
                                                <th>Giới tính</th>
                                                <th>Actions</th>
                                                <th>Lịch sử</th>
                                            </tr>
                                            {dataPatient && dataPatient.length > 0 && !_.isEmpty(dataPatient) ?
                                                dataPatient.map((item, index) => {
                                                    let time = language === LANGUAGES.VI ?
                                                        item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn;
                                                    let gender = language === LANGUAGES.VI ?
                                                        item.patientData.genderData.valueVi : item.patientData.genderData.valueEn;
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{time}</td>
                                                            <td>{item.patientData.firstName}</td>
                                                            <td>{item.patientData.address}</td>
                                                            <td>{gender}</td>
                                                            <td>
                                                                <button className="mp-btn-confirm"
                                                                    onClick={() => this.handleBtnComfirm(item)}
                                                                >Xác nhận</button>
                                                            </td>
                                                            <td className="btn-show-table-info"><i className="fas fa-ellipsis-h"
                                                                onClick={() => this.showInfoTable(item.patientId)}
                                                            ></i></td>
                                                        </tr>
                                                    )
                                                })
                                                :
                                                <tr>
                                                    <td className="note" colSpan="6" style={{ textAlign: "center" }}>Không có bệnh nhân đặt lịch hôm nay</td>
                                                </tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <RemedyModal
                            isOpenModal={isOpenRemedyModal}
                            doctorId={this.props.user.id}
                            patientId={this.state.patientId}
                            dataModal={dataModal}
                            closeRemedyModal={this.closeRemedyModal}
                            sendRemedy={this.sendRemedy}
                        />
                    </LoadingOverlay>

                </React.Fragment>
            }
                {this.state.isOpen === true &&
                    <Lightbox
                        mainSrc={this.state.imgFullScreen}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                }
            </>

        );
    }
}


const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);

