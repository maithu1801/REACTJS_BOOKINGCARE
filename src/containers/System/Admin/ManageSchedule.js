import React, { Component } from "react";
import { connect } from "react-redux";
import './ManageSchedule.scss';
import { FormattedMessage } from "react-intl";
import DatePicker from '../../../components/Input/DatePicker';
import { searchPatient } from '../../../services/userService';
import { adminManageSchedule } from '../../../services/userService';

import moment from "moment";
import { LANGUAGES, CommonUtils } from '../../../utils';
import { toast } from 'react-toastify';
import LoadingOverlay from "react-loading-overlay";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import _ from 'lodash';
import { event } from "jquery";
import { manageMedicine } from '../../../services/userService';
import html2canvas from "html2canvas";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

ReactHTMLTableToExcel.format = (s, c) => {
    if (c && c['table']) {
        const html = c.table;
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const rows = doc.querySelectorAll('tr');

        for (const row of rows) row.removeChild(row.firstChild);

        c.table = doc.querySelector('table').outerHTML;
    }

    return s.replace(/{(\w+)}/g, (m, p) => c[p]);
};

class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrSchedule: [],
            keyWord: '',
        }
    }


    async componentDidMount() {
        this.getDataPatient()
    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }
    getDataPatient = async () => {
        let data = {
            type: 'get'
        }
        let res = await adminManageSchedule(data);
        console.log("res", res);
        if (res.schedule) {
            this.setState({
                arrSchedule: res.schedule
            })
        } else {
            toast.warning("Lịch hẹn trống !");
        }
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }

    searchPatient = async () => {
        let data = {
            type: 'search',
            keyWord: this.state.keyWord,
        }
        let res = await adminManageSchedule(data);
        if (!_.isEmpty(res.booking)) {
            this.setState({
                arrSchedule: res.booking,
            })
        } else {
            toast.warning("Không tìm thấy dữ liệu trùng khớp với yêu cầu !");
        }
    }
    render() {
        let { language } = this.props;
        let arrSchedule = this.state.arrSchedule;
        console.log(arrSchedule);
        return (
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
                            <div className='search'>
                                <label>Tên bệnh nhân: </label>
                                <input type="text"
                                    placeholder='Tìm kiếm'
                                    value={this.state.keyWord}
                                    onChange={(event) => this.handleOnChangeInput(event, 'keyWord')}
                                ></input>
                                <div className="tim_kiem"
                                    title="Tìm kiếm"
                                    onClick={() => this.searchPatient()}
                                ><i className="fas fa-search"></i></div>
                                <div className="cap_nhat"
                                    title="Cập nhật lại"
                                    onClick={() => this.getDataPatient()}
                                ><i className="fas fa-undo" ></i></div>
                            </div>
                            <div className="btn-excel" title="Xuất file excel">
                                <ReactHTMLTableToExcel
                                    id="test-table-xls-button"
                                    className="download-table-xls-button"

                                    table="table-to-xls"
                                    filename="lichsu"
                                    sheet="lichsukhambenh"
                                    buttonText=""
                                >
                                </ReactHTMLTableToExcel>
                                <div className="excel-icon">
                                    <i className="fas fa-file-excel"></i>
                                </div>
                            </div>
                            <div className="col-12 table-manage-patient">
                                <table id="table-to-xls" style={{ width: '100%' }}>
                                    <tbody>
                                        <tr>
                                            <th>STT</th>
                                            <th>Thời gian</th>
                                            <th>Bệnh nhân</th>
                                            <th>Địa chỉ</th>
                                            <th>Bác sĩ</th>
                                            <th>Actions</th>
                                        </tr>
                                        {arrSchedule && arrSchedule.length > 0 && !_.isEmpty(arrSchedule) ?
                                            arrSchedule.map((item, index) => {
                                                let time_vi = moment.unix(+item.date / 1000).locale('vi').format('dddd - DD/MM/YYYY, h:mm a')
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{time_vi}</td>
                                                        <td>{item.patientData.lastName} {item.patientData.firstName}</td>
                                                        <td>{item.patientData.address}</td>
                                                        <td>{item.doctorDataSchedule.lastName} {item.doctorDataSchedule.firstName}</td>
                                                        <td>
                                                            {item.statusId === 'S2' ?
                                                                <React.Fragment>
                                                                    <button className="mp-btn-confirm"
                                                                        // onClick={() => this.handleBtnComfirm(item)}
                                                                        onClick={
                                                                            () => {
                                                                                window.open(`http://localhost:3000/verify-cancel?token=${item.token}&doctorId=${item.doctorId}&type=DCANCEL`);
                                                                            }
                                                                        }
                                                                    >Hủy Lịch Khám</button>
                                                                </React.Fragment> :
                                                                <React.Fragment>
                                                                    Đã khám xong
                                                                </React.Fragment>
                                                            }

                                                        </td>
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
                </LoadingOverlay>
            </React.Fragment>
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

