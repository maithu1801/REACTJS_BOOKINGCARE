import React, { Component } from 'react';
import { connect } from "react-redux";
import './ClinicAll.scss';
import _ from 'lodash';
import HomeHeader from '../../HomePage/HomeHeader';
import { toast } from "react-toastify";
import { getAllClinic } from '../../../services/userService';

class ClinicAll extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataClinic: {},
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params) {
            let res = await getAllClinic();
            if (res && res.errCode === 0) {
                this.setState({
                    Allclinic: true,
                    dataClinic: res.data ? res.data : []
                })
            } else {
                toast.error("Đã xảy ra lỗi !!!");
            }
        }

    }
    handleViewDetailClinic = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${item.id}`)
        }
    }

    render() {
        let { dataClinic } = this.state;
        console.log('dataClinic render:', this.state.dataClinic);
        return (
            <div className='clinic-container'>
                <HomeHeader />
                <div className='clinic-body'>
                    <div className='description-clinic'>
                        {dataClinic && dataClinic.length > 0 &&
                            dataClinic.map((item, index) => {
                                return (
                                    <div className='content-clinic' key={index}>
                                        <div className='description-clinic'
                                            dangerouslySetInnerHTML={{ __html: item.descriptionHTML }}>
                                        </div>
                                        <div className='header-clinic' >
                                            <div className='left-clinic'>
                                                <div className='image-clinic'
                                                    style={{ backgroundImage: `url(${item.image})` }}
                                                ></div>
                                            </div>
                                            <div className='right-clinic'>
                                                <div className='book-clinic'>
                                                    <button
                                                        onClick={() => this.handleViewDetailClinic(item)}
                                                    ><i class="fas fa-hand-point-right"></i> Đặt lịch khám</button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                )
                            }
                            )
                        }
                    </div>

                </div>
            </div>

        )
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

export default connect(mapStateToProps, mapDispatchToProps)(ClinicAll);
