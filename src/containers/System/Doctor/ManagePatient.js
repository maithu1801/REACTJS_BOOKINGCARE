import React, { Component } from "react";
import { connect } from "react-redux";
import './ManagePatient.scss';
import { FormattedMessage } from "react-intl";
import DatePicker from '../../../components/Input/DatePicker';
import { getAllPatientDoctor, postSendRemedy, getListHistory, createHistory, searchPatient } from '../../../services/userService';
import moment from "moment";
import { LANGUAGES, CommonUtils } from '../../../utils';
import RemedyModal from './RemedyModal';
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

            showPlan: false,
            nameMedicine: '',
            medicineList: {},
            id: '',
            timeType: '',
            email: '',
            name: '',
            address: '',
            gender: '',
            doctor: '',
            description: '',
            time: '',
            howtouse: false,
            medicine: [],
            use: [],
            nameUse: '',
            htu: '',

            number: 1,
            mType: '',
            total: 0,
            price: 0,
            rType: [],
            rPrice: [],
            rNumber: [],
            infoDoctor: {}
        }
    }


    async componentDidMount() {
        this.getDataPatient()
        let data = {
            type: 'doctorPrice',
            id: this.props.user.id
        }
        let res = await manageMedicine(data);
        if (res.doctor) {
            console.log(res);
            this.setState({
                infoDoctor: res.doctor
            }, () => {
                console.log("xxx", this.state.infoDoctor.Doctor_Infor.nameClinic)
            })
        }
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
                formatedDate: formatedDate,
                keyWord: '',
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

    sendEmail = async (item) => {

        // t???o image
        if (this.state.description === '') {
            toast.warning("Vui l??ng ho??n th??nh chu???n ??o??n !");
        } else {
            let warning = prompt("B???n c?? ch???c ch???n mu???n g???i ????n thu???c n??y cho b???nh nh??n ? Nh???p YES ????? x??c nh???n ho???c b???m b???t k?? ????? h??y.", "");
            if (warning === "YES") {
                let canvas = await html2canvas(document.querySelector(`#image-medicine`));
                let url = canvas.toDataURL("image/png", 1.0);
                const blob = await fetch(url).then(res => res.blob());
                let base64 = await CommonUtils.getBase64(blob);
                console.log(base64);
                let data = {
                    email: this.state.email,
                    imgBase64: base64,
                    doctorId: this.props.user.id,
                    patientId: this.state.id,
                    timeType: this.state.timeType,
                    language: this.props.language,
                    patientName: this.state.name,
                }
                this.setState({
                    isShowLoading: true
                })
                let res = await postSendRemedy(data);
                if (res && res.errCode === 0) {
                    this.setState({
                        isShowLoading: false
                    })
                    toast.success('G???i ????n thu???c th??nh c??ng ! ');
                    await this.getDataPatient();
                    data = {
                        image: base64,
                        doctorId: this.props.user.id,
                        patientId: this.state.id,
                        description: this.state.description,
                    }
                    res = await createHistory(data);
                    if (res && res.errCode === 0) {
                        toast.success('L??u l???ch s??? b???nh ??n th??nh c??ng !!!');
                        this.setState({
                            showPlan: false,
                        })
                    } else {
                        toast.error('L??u l???ch s??? th???t b???i');
                    }
                } else {
                    this.setState({
                        isShowLoading: false
                    })
                    toast.error('G???i mail th???t b???i');
                }
            }
        }
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

        if (_.isEmpty(res) || res.err) {
            toast.warning("B???nh nh??n ch??a c?? l???ch s??? kh??m b???nh !");
        } else {
            this.setState({
                showTableInfo: true,
                arrInfo: res,
                patient: `${res[0].dataPatient.firstName}`
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
        }, async () => {
            if (id === 'nameMedicine' && event.target.value !== '') {
                await this.searchMedicine();
            } else if (id === 'nameMedicine' && event.target.value === '') {
                this.setState({
                    medicineList: {}
                })
            }
        })
    }
    searchPatient = async () => {
        let data = {
            keyWord: this.state.keyWord,
            doctorId: this.props.user.id,
            date: this.state.formatedDate
        }
        let res = await searchPatient(data);
        if (!_.isEmpty(res.booking)) {
            this.setState({
                dataPatient: res.booking,
            })
        } else {
            toast.warning("Kh??ng t??m th???y d??? li???u tr??ng kh???p v???i y??u c???u !");
        }
    }
    showPlan = (item) => {
        console.log('item', item);
        let date = new Date();
        let dd = date.getDate();
        let mm = date.getMonth();
        let yy = date.getFullYear();
        let h = date.getHours();
        let m = date.getMinutes();
        let time_vi = `${h}:${m} ${dd}-${mm}-${yy}`
        this.setState({
            showPlan: true,
            id: item.patientId,
            timeType: item.timeType,
            email: item.patientData.email,
            name: item.patientData.firstName,
            address: item.patientData.address,
            gender: item.patientData.gender,
            doctor: ` ${this.props.user.lastName} ${this.props.user.firstName}`,
            time: time_vi,
        })
    }
    searchMedicine = async () => {
        let data = {
            type: 'search',
            doctorId: this.props.user.id,
            nameMedicine: this.state.nameMedicine,
        }
        let res = await manageMedicine(data);
        if (res.err) {
            toast.warning('T??n thu???c kh??ng t???n t???i!')
        } else {
            this.setState({
                medicineList: res.list
            })
        }
    }
    saveMedicine = async () => {
        let data = {
            type: 'new',
            nameMedicine: this.state.nameMedicine,
            doctorId: this.props.user.id,
        };
        let res = await manageMedicine(data);
        if (!res.err) {
            toast.success('Th??m m???i th??nh c??ng!');
            this.searchMedicine();
        } else {
            toast.error("???? x???y ra l???i");
        }
    }
    howtouse = (item) => {
        let type = '';
        if (item.type === 'vien') {
            type = 'Vi??n'
        } else if (item.type === 'vi') {
            type = 'Vi??n'
        } else if (item.type === 'hop') {
            type = 'H???p/tu??p'
        } else if (item.type === 'goi') {
            type = 'G??i'
        } else if (item.type === 'khac') {
            type = 'S???n Ph???m'
        }
        this.setState({
            howtouse: true,
            nameUse: item.nameMedicine,
            price: item.price,
            mType: type
        })
    }
    medicineToRight = () => {
        let name = this.state.medicine;
        let use = this.state.use;
        let rType = this.state.rType;
        let rPrice = this.state.rPrice;
        let rNumber = this.state.rNumber;
        let total = +this.state.total;
        if (this.state.htu != '') {
            name.push(this.state.nameUse);
            use.push(this.state.htu);
            rPrice.push(this.state.price);
            rType.push(this.state.mType);
            rNumber.push(this.state.number);
            total = total + +this.state.number * +this.state.price;
            this.setState({
                medicine: name,
                use: use,
                rPrice: rPrice,
                rType: rType,
                rNumber: rNumber,
                total: total,
                htu: '',
                howtouse: false,
                mType: '',
                price: '',
                number: 1,
            })
        } else {
            toast.warning("Vui l??ng nh???p c??ch d??ng thu???c !");
        }
    }
    deleteMedicine = (index) => {
        let name = this.state.medicine;
        let use = this.state.use;
        let rType = this.state.rType;
        let rPrice = this.state.rPrice;
        let rNumber = this.state.rNumber;
        let total = +this.state.total;
        total = +total - +rNumber[index] * +rPrice[index];
        name.splice(index, 1);
        use.splice(index, 1);
        rNumber.splice(index, 1);
        rType.splice(index, 1);
        rPrice.splice(index, 1);

        this.setState({
            medicine: name,
            use: use,
            rPrice: rPrice,
            rType: rType,
            rNumber: rNumber,
            total: total
        })
    }
    render() {
        let { dataPatient, isOpenRemedyModal, dataModal } = this.state;
        console.log('dataPatient', dataPatient);
        let { language } = this.props;
        let arrInfo = this.state.arrInfo;
        let list = this.state.medicineList;
        let name = this.state.medicine;
        let use = this.state.use;
        return (
            <React.Fragment>
                {this.state.howtouse === true &&
                    <React.Fragment>
                        <div className="htu">
                            <div className="htu-box">
                                <div className="htu-header">
                                    <b>Thu???c: {this.state.nameUse}</b>
                                    <i className="fas fa-times"
                                        onClick={() => {
                                            this.setState({
                                                howtouse: false,
                                                htu: '',
                                            })
                                        }}
                                    ></i>
                                </div>
                                <div className="htu-body">
                                    <div className="htu-body-sub-number">
                                        <b>S??? l?????ng:</b>
                                        <div className="number">
                                            <input
                                                value={this.state.number}
                                                onChange={(event) => this.handleOnChangeInput(event, 'number')}
                                            />
                                            <span>{this.state.price} VN??/{this.state.mType}</span>
                                        </div>
                                    </div>
                                    <div className="htu-body-sub">
                                        <b>C??ch d??ng:</b>
                                        <textarea rows='4'
                                            value={this.state.htu}
                                            onChange={(event) => this.handleOnChangeInput(event, 'htu')}
                                        >
                                        </textarea>
                                    </div>
                                </div>
                                <div className="htu-footer">
                                    <div className="htu-btn"
                                        onClick={() => this.medicineToRight()}
                                    >OK</div>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                }
                {this.state.showPlan === true &&
                    <React.Fragment>
                        <div className="medicine-plan-container" >
                            <div className="plan-header">
                                <div className="plan-header-title">
                                    <span>
                                        T???o ????n thu???c
                                    </span>
                                    <i className="fas fa-save"
                                        title="Save and Send Email"
                                        onClick={() => this.sendEmail()}
                                    ></i>
                                </div>
                                <div className="plan-header-btn">
                                    <i className="fas fa-sign-out-alt"
                                        onClick={() => this.setState({
                                            showPlan: false
                                        })}
                                    ></i>
                                </div>
                            </div>
                            <div className="plan-body">
                                <div className="plan-body-left">
                                    <div className='left-container'>
                                        <div className="left-title">Email:</div>
                                        <div className="left-input">
                                            <span>{this.state.email}</span>
                                        </div>
                                    </div>
                                    <div className='left-container'>
                                        <div className="left-title">Chu???n ??o??n:</div>
                                        <div className="left-input">
                                            <textarea rows='5'
                                                value={this.state.description}
                                                onChange={(event) => this.handleOnChangeInput(event, 'description')}
                                            >
                                            </textarea>
                                        </div>
                                    </div>
                                    <div className='left-container'>
                                        <div className="left-title">Cho thu???c:</div>
                                        <div className="left-input">
                                            <input
                                                value={this.state.nameMedicine}
                                                onChange={(event) => this.handleOnChangeInput(event, 'nameMedicine')}
                                            >
                                            </input>
                                        </div>
                                    </div>
                                    <div className='left-container'>
                                        <div className="list-medicine">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td className="title max">T??n thu???c</td>
                                                        <td className="title"></td>
                                                    </tr>
                                                    {list && list.length > 0 ?
                                                        list.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td className="max">{item.nameMedicine}</td>
                                                                    <td className="center min">
                                                                        <i className="fas fa-plus"
                                                                            onClick={() => this.howtouse(item)}
                                                                        ></i>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }) :
                                                        <React.Fragment>
                                                            <tr>
                                                                <td colSpan='4' className="center">Nh???p t??n thu???c ????? ch???n</td>
                                                            </tr>
                                                        </React.Fragment>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="plan-body-right" id='image-medicine'>
                                    <div className="right-title">
                                        <span>????N THU???C</span>
                                    </div>
                                    <div className="right-content">
                                        <b>Ng??y:</b>
                                        <span>{this.state.time}</span>
                                    </div>
                                    <div className="right-content">
                                        <b>B???nh nh??n:</b>
                                        <span>{this.state.name}</span>
                                    </div>
                                    <div className="right-content">
                                        <b>?????a ch???:</b>
                                        <span>{this.state.address}</span>
                                    </div>
                                    <div className="right-content">
                                        <b>B??c s??:</b>
                                        <span>{this.state.doctor}</span>
                                    </div>
                                    {!_.isEmpty(this.state.infoDoctor) &&
                                        <React.Fragment>
                                            <div className="right-content">
                                                <b>Ph??ng kh??m:</b>
                                                <span>{this.state.infoDoctor.Doctor_Infor.nameClinic}</span>
                                            </div>
                                            <div className="right-content">
                                                <b>Chuy??n khoa:</b>
                                                <span>{this.state.infoDoctor.Doctor_Infor.specialtyData.name}</span>
                                            </div>
                                            <div className="right-content">
                                                <b>Gi?? Kh??m:</b>
                                                <span>{this.state.infoDoctor.Doctor_Infor.priceTypeData.valueVi} VN??</span>
                                            </div>
                                        </React.Fragment>
                                    }
                                    <div className="right-content">
                                        <b>Chu???n ??o??n:</b>
                                        <div className="descreption">
                                            {this.state.description}
                                        </div>
                                    </div>
                                    <div className="table-medicine">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td className="title">T??n thu???c</td>
                                                    <td className="title">Gi??</td>
                                                    <td className="title">SL</td>
                                                    <td className="title">Th??nh ti???n</td>
                                                    <td className="title">C??ch d??ng</td>
                                                </tr>
                                                {!_.isEmpty(use) && !_.isEmpty(name) ?
                                                    <React.Fragment>
                                                        {
                                                            name.map((item, index) => {
                                                                return (
                                                                    <tr key={index}
                                                                        title='click to delete'
                                                                        onClick={() => this.deleteMedicine(index)}
                                                                    >
                                                                        <td>{name[index]}</td>
                                                                        <td>{this.state.rPrice[index]}VN??/{this.state.rType[index]}</td>
                                                                        <td>{this.state.rNumber[index]}</td>
                                                                        <td>{+this.state.rNumber[index] * +this.state.rPrice[index]} VN??</td>
                                                                        <td>{use[index]}</td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                        <tr>
                                                            <td colSpan='5' className="right">T???ng ti???n: {
                                                                +this.state.total + +this.state.infoDoctor.Doctor_Infor.priceTypeData.valueVi
                                                            } VN??</td>
                                                        </tr>
                                                    </React.Fragment> :
                                                    < React.Fragment >
                                                        <tr>
                                                            <td colSpan='5' className="center">Ch??a cho thu???c</td>
                                                        </tr>
                                                    </React.Fragment>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                }
                <>  {this.state.showTableInfo === true ?
                    <React.Fragment>
                        <div className="table-info">
                            <div className="table-content">
                                <div className="table-header">
                                    <b>L???CH S??? KH??M B???NH</b>
                                    <div className="btn-excel">
                                        <ReactHTMLTableToExcel
                                            id="test-table-xls-button"
                                            className="download-table-xls-button"
                                            table="excel_history"
                                            filename="lichsubenhan"
                                            sheet="lichsu"
                                            buttonText=""
                                        >
                                        </ReactHTMLTableToExcel>
                                        <div className="excel-icon">
                                            <i className="fas fa-file-excel"></i>
                                        </div>
                                    </div>
                                    <i className="fas fa-sign-out-alt"
                                        onClick={() => this.setState({ showTableInfo: false })}
                                    ></i>

                                </div>

                                <div className="table-tool">
                                    <b>B???nh nh??n: </b> <span>{this.state.patient}</span>
                                </div>
                                <div className="table-body">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td className="table-title">Ng??y</td>
                                                <td className="table-title">B??c s??</td>
                                                <td className="table-title">L???ch s??? b???nh ??n</td>
                                                <td className="table-title center">????n thu???c</td>
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
                                    <table id="excel_history">
                                        <tbody>
                                            <tr>
                                                <td></td>
                                                <td className="table-title">B???nh nh??n</td>
                                                <td className="table-title">Ng??y</td>
                                                <td className="table-title">B??c s??</td>
                                                <td className="table-title">L???ch s??? b???nh ??n</td>

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
                                                            <td></td>
                                                            <td >{item.dataPatient.firstName}</td>
                                                            <td >{time_vi}</td>
                                                            <td > {item.dataDoctor.lastName} {item.dataDoctor.firstName}</td>
                                                            <td >{item.description}</td>
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
                                    Qu???n l?? b???nh nh??n kh??m b???nh
                                </div>
                                <div className='manage-patient-body row'>
                                    <div className='col-4 form-group'>
                                        <label>Ch???n ng??y kh??m</label>
                                        <DatePicker
                                            onChange={this.handleOnChangeDatePicker}
                                            className="form-control"
                                            value={this.state.currentDate}
                                        />
                                    </div>
                                    <div className='search'>
                                        <label>T??n b???nh nh??n: </label>
                                        <input type="text"
                                            placeholder='T??m ki???m'
                                            value={this.state.keyWord}
                                            onChange={(event) => this.handleOnChangeInput(event, 'keyWord')}
                                        ></input>
                                        <div className="tim_kiem"
                                            title="T??m ki???m"
                                            onClick={() => this.searchPatient()}
                                        ><i className="fas fa-search"></i></div>
                                        <div className="cap_nhat"
                                            title="C???p nh???t l???i"
                                            onClick={() => this.getDataPatient()}
                                        ><i className="fas fa-undo" ></i></div>
                                    </div>
                                    <div className="btn-excel" title="Xu???t file excel">
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
                                                    <th>Th???i gian</th>
                                                    <th>H??? v?? t??n</th>
                                                    <th>?????a ch???</th>
                                                    <th>Gi???i t??nh</th>
                                                    <th>Actions</th>
                                                    <th>L???ch s???</th>
                                                </tr>
                                                {dataPatient && dataPatient.length > 0 && !_.isEmpty(dataPatient) ?
                                                    dataPatient.map((item, index) => {
                                                        let time = language === LANGUAGES.VI ?
                                                            item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn;
                                                        let gender = language === LANGUAGES.VI ?
                                                            item.patientData.genderData.valueVi : item.patientData.genderData.valueEn;
                                                        console.log('gender', gender);
                                                        return (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{time}</td>
                                                                <td>{item.patientData.firstName}</td>
                                                                <td>{item.patientData.address}</td>
                                                                <td>{gender}</td>
                                                                <td>
                                                                    {item.statusId === 'S2' ?
                                                                        <React.Fragment>
                                                                            <button className="mp-btn-confirm"
                                                                                // onClick={() => this.handleBtnComfirm(item)}
                                                                                onClick={() => this.showPlan(item)}
                                                                            >X??c nh???n</button>
                                                                            <button className="mp-btn-confirm"
                                                                                // onClick={() => this.handleBtnComfirm(item)}
                                                                                onClick={
                                                                                    () => {
                                                                                        window.open(`http://localhost:3000/verify-booking?token=${item.token}&doctorId=${item.doctorId}&type=DCANCEL`);
                                                                                    }
                                                                                }
                                                                            >H???y L???ch Kh??m</button>
                                                                        </React.Fragment> :
                                                                        <React.Fragment>
                                                                            ???? kh??m xong
                                                                        </React.Fragment>
                                                                    }

                                                                </td>
                                                                <td className="btn-show-table-info" title="Xem"><i className="fas fa-ellipsis-h"
                                                                    onClick={() => this.showInfoTable(item.patientId)}
                                                                ></i></td>
                                                            </tr>
                                                        )
                                                    })
                                                    :
                                                    <tr>
                                                        <td className="note" colSpan="6" style={{ textAlign: "center" }}>Kh??ng c?? b???nh nh??n ?????t l???ch h??m nay</td>
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
            </React.Fragment >


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

