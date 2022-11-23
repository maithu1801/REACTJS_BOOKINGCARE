import React, { Component } from 'react';
import { connect } from "react-redux";
import './SpecialtyAll.scss';
import _ from 'lodash';
import HomeHeader from '../../HomePage/HomeHeader';
import { toast } from "react-toastify";
import { getAllSpecialty } from '../../../services/userService';


class SpecialtyAll extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSpecialty: {},
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params) {
            let res = await getAllSpecialty();
            if (res && res.errCode === 0) {
                this.setState({
                    AllSpecialty: true,
                    dataSpecialty: res.data ? res.data : []
                })
            } else {
                toast.error("Đã xảy ra lỗi !!!");
            }
        }

    }
    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`)
        }
    }

    render() {
        let { dataSpecialty } = this.state;
        console.log('dataspecialty render:', this.state.dataSpecialty);
        return (
            <div className='specialty-container'>
                <HomeHeader />
                <div className='specialty-body'>
                    <div className='description-specialty'>
                        {dataSpecialty && dataSpecialty.length > 0 &&
                            dataSpecialty.map((item, index) => {
                                return (
                                    <div className='content-specialty' key={index}>
                                        <div className='description-specialty'
                                            dangerouslySetInnerHTML={{ __html: item.descriptionHTML }}>
                                        </div>
                                        <div className='header-specialty' >
                                            <div className='left-specialty'>
                                                <div className='image-specialty'
                                                    style={{ backgroundImage: `url(${item.image})` }}
                                                ></div>
                                            </div>
                                            <div className='right-specialty'>
                                                <div className='book-specialty'>
                                                    <button
                                                        onClick={() => this.handleViewDetailSpecialty(item)}
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

export default connect(mapStateToProps, mapDispatchToProps)(SpecialtyAll);
