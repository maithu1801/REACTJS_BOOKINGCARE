import React, { Component } from "react";
import { connect } from "react-redux";
import './ManagePatient.scss';
import { FormattedMessage } from "react-intl";
import DatePicker from '../../../components/Input/DatePicker';
import { getAllPatientDoctor, postSendRemedy, getListHistory } from '../../../services/userService';
import moment from "moment";
import { LANGUAGES } from '../../../utils';
import RemedyModal from './RemedyModal';
import { toast } from 'react-toastify';
import LoadingOverlay from "react-loading-overlay";

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
            patient: ''
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
        let res = await getAllPatientDoctor({
            doctorId: user.id,
            date: formatedDate,

        })

        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data
            })
        }

    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }
    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
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
            patientName: item.patientData.firstName
        }
        this.setState({
            isOpenRemedyModal: true,
            dataModal: data
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
                                            <td className="table-title">Mô tả</td>
                                            <td className="table-title">File</td>
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
                                            console.log('imgae:', imageBase64);
                                            return (
                                                <React.Fragment>
                                                    <tr key={index}>
                                                        <td >{time_vi}</td>
                                                        <td > {item.dataDoctor.lastName} {item.dataDoctor.firstName}</td>
                                                        <td >{item.description}</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            <img className='img-avt' src={imageBase64} /></td>
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
                                            {dataPatient && dataPatient.length > 0 ?
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
                                                            <td className="btn-show-table-info"><i class="fas fa-ellipsis-h"
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
                            dataModal={dataModal}
                            closeRemedyModal={this.closeRemedyModal}
                            sendRemedy={this.sendRemedy}
                        />
                    </LoadingOverlay>
                </React.Fragment>
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

