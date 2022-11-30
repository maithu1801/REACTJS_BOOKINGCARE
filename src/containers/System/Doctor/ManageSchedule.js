import React, { Component } from "react";
import { connect } from "react-redux";
import './ManageSchedule.scss';
import { FormattedMessage } from "react-intl";
import Select from 'react-select';
import * as actions from "../../../store/actions";
import { LANGUAGES } from "../../../utils";
import DatePicker from '../../../components/Input/DatePicker';
import { toast } from "react-toastify";
import _ from "lodash";
import { saveBulkScheduleDoctor, getScheduleDoctorByDate } from '../../../services/userService';



class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],
            selectedDoctor: {},
            currentDate: '',
            rangeTime: [],
            schedule: [],
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.fetchAllScheduleTime();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            this.setState({
                listDoctors: dataSelect
            })
        }
        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime;
            if (data && data.length > 0) {
                data = data.map(item => ({ ...item, isSelected: false }))
            }
            this.setState({
                rangeTime: data
            })
        }

    }
    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`;
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object)
            })
        }
        return result;
    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({
            selectedDoctor: selectedOption,
        }, async () => {
            await this.getScheduleManage();
        });
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0],
        }, async () => {
            await this.getScheduleManage();
        })
    }
    handleClickBtnTime = (time) => {
        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if (item.id === time.id) item.isSelected = !item.isSelected;
                return item;
            })
            this.setState({
                rangeTime: rangeTime
            })
        }

    }

    handleSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        let result = [];

        if (!currentDate) {
            toast.error("Invail date!");
            return;
        }
        if (selectedDoctor && _.isEmpty(selectedDoctor)) {
            toast.error("Invalid selected doctor! ");
            return;
        }
        // let formatedDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER);
        let formatedDate = new Date(currentDate).getTime();

        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(item => item.isSelected === true);
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map((schedule, index) => {
                    let object = {};
                    object.doctorId = selectedDoctor.value;
                    object.timeType = schedule.keyMap;
                    object.date = formatedDate;
                    result.push(object);

                })
            } else {
                toast.error("Invalid select time! ");
                return;
            }
        }
        let res = await saveBulkScheduleDoctor({
            arrSchedule: result,
            doctorId: selectedDoctor.value,
            formatedDate: formatedDate
        })
        if (res && res.errCode === 0) {
            toast.success("Save Infor succed!");
            this.getScheduleManage();
        } else {
            toast.error("error saveBulkScheduleDoctor");
            console.log('error saveBulkScheduleDoctor >>> res: ', res);
        }
    }

    getScheduleManage = async () => {
        let selectedDoctor = this.state.selectedDoctor;
        let currentDate = this.state.currentDate;
        if (selectedDoctor && currentDate) {
            let date = new Date(currentDate);
            currentDate = date.getTime();
            let res = await getScheduleDoctorByDate(selectedDoctor.value, currentDate);
            if (res.data.length > 0 && res.errCode === 0) {
                this.setState({
                    allAvalableTime: res.data ? res.data : []
                })
                let rangeTime = this.state.rangeTime;
                res.data.map(res => {
                    console.log("res map", res);
                    if (rangeTime && rangeTime.length > 0) {
                        rangeTime = rangeTime.map(item => {
                            if (res.timeType === item.keyMap) {
                                item.isSelected = true;
                            }
                            return item;
                        })
                        this.setState({
                            rangeTime: rangeTime
                        })
                    }
                })
            } else {
                let rangeTime = this.state.rangeTime;
                if (rangeTime && rangeTime.length > 0) {
                    rangeTime = rangeTime.map(item => {
                        item.isSelected = false;
                        return item;
                    })
                    this.setState({
                        rangeTime: rangeTime,
                        allAvalableTime: []
                    })
                }
            }
        }
    }

    render() {
        let { rangeTime } = this.state;
        let { language } = this.props;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        let allAvalableTime = this.state.allAvalableTime;
        let selectedDoctor = this.state.selectedDoctor;
        if (this.props.user.roleId === 'R2') {
            selectedDoctor.label = `${this.props.user.lastName} ${this.props.user.firstName}`;
            selectedDoctor.value = this.props.user.id;
        }
        return (
            <div className='manage-schedule-container'>
                <div className='m-s-title'>
                    <FormattedMessage id="manage-schedule.title" />
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className="col-6 from-group">
                            {this.props.user.roleId === 'R1' ?
                                <React.Fragment>
                                    <label><FormattedMessage id="manage-schedule.choose-doctor" /></label>
                                    <Select
                                        value={this.state.selectedDoctor}
                                        onChange={this.handleChangeSelect}
                                        options={this.state.listDoctors}
                                    />
                                </React.Fragment> :
                                <React.Fragment>
                                    <label><FormattedMessage id="manage-schedule.choose-doctor" /></label>
                                    <Select
                                        value={this.state.selectedDoctor}
                                        disabled
                                    />
                                </React.Fragment>
                            }
                        </div>
                        <div className="col-6 from-group">
                            <div>
                                <label><FormattedMessage id="manage-schedule.choose-date" /></label>
                            </div>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className="from-control"
                                value={this.state.currentDate}
                                minDate={yesterday}
                            />
                        </div>
                        <div className="col-12 pick-hour-container">
                            {rangeTime && rangeTime.length > 0 &&
                                rangeTime.map((item, index) => {
                                    return (
                                        <button className={item.isSelected === true ? "btn btn-schedule active" : "btn btn-schedule"}
                                            key={index}
                                            onClick={() => this.handleClickBtnTime(item)}
                                        >
                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </button>
                                    )

                                })
                            }
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary btn-save-schedule"
                                onClick={() => this.handleSaveSchedule()}
                            >
                                <FormattedMessage id="manage-schedule.save" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="table-schedule">
                    <div className="time-title">
                        KẾ HOẠCH ĐÃ LƯU TRƯỚC ĐÓ
                    </div>
                    <div className='time-content'>
                        {allAvalableTime && allAvalableTime.length > 0 ?
                            <>
                                <div className='time-content-btns'>
                                    {allAvalableTime.map((item, index) => {
                                        let timeDisplay = language === LANGUAGES.VI ?
                                            item.timeTypeData.valueVi : item.timeTypeData.valueEn;
                                        return (
                                            <button key={index}
                                                className={language === LANGUAGES.VI ? 'btn-vie' : 'btn-en'}
                                            >
                                                {timeDisplay}
                                            </button>
                                        )
                                    })
                                    }
                                </div>
                            </>
                            :
                            <div className='no-schedule'>
                                Kế hoạch rỗng !!!
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allScheduleTime: state.admin.allScheduleTime,
        user: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);

