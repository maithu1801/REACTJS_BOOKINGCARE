import React, { Component } from 'react';
import { connect } from "react-redux";
import { postVerifyBookAppointment } from "../../services/userService";
import HomeHeader from '../HomePage/HomeHeader';
import './VerifyCancel.scss';

class VerifyCancel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            statusVerify: false,
            errCode: 0
        }
    }

    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search);
            let token = urlParams.get('token');
            let doctorId = urlParams.get('doctorId');
            let type = urlParams.get('type');
            let res = await postVerifyBookAppointment({
                token: token,
                doctorId: doctorId,
                type: type
            })

            if (res && res.errCode === 0) {
                this.setState({
                    statusVerify: true,
                    errCode: res.errCode
                })
            } else {
                this.setState({
                    statusVerify: true,
                    errCode: res && res.errCode ? res.errCode : -1
                })
            }
        }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }

    render() {
        let { statusVerify, errCode } = this.state;
        console.log('errCode:', errCode);
        return (
            <>
                <HomeHeader />
                <div className='verify-container'>
                    {statusVerify === false ?
                        <div className='loading'>
                            Loading data...
                        </div>
                        :
                        <div>
                            {+errCode === 0 ?
                                <>
                                    <div className='infor-booking-sucess'>Hủy lịch hẹn thành công!
                                        <div className='btn-close'
                                            onClick={() => window.close()}
                                        >OK</div>
                                    </div>

                                </>
                                :
                                <>
                                    <div className='infor-booking-fail'>Lịch hẹn không tồn tại hoặc đã được xác nhận!
                                        <div className='btn-close'
                                            onClick={() => window.close()}
                                        >OK</div>
                                    </div>

                                </>
                            }
                        </div>
                    }
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(VerifyCancel);
