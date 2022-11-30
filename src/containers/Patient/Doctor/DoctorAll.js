import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorAll.scss';
import _ from 'lodash';
import HomeHeader from '../../HomePage/HomeHeader';
import { toast } from "react-toastify";
import { getDoctor } from '../../../services/userService';



class DoctorAll extends Component {

    constructor(props) {
        super(props);
        this.state = {
            datadoctor: {},
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params) {
            let res = await getDoctor();

            if (res && res.errCode === 0) {
                this.setState({
                    Alldoctor: true,
                    datadoctor: res.data ? res.data : []
                })
            } else {
                toast.error("Đã xảy ra lỗi !!!");
            }
        }
    }
    handleViewDetailDoctor = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${item.id}`)
        }
    }
    render() {
        // bên react chạy đúng bên node nó gửi về bị trùng
        let { datadoctor } = this.state;
        return (
            <div className='doctor-container'>
                <HomeHeader />
                <div className='doctor-body'>
                    <div className='description-doctor'>
                        {datadoctor && datadoctor.length > 0 &&
                            datadoctor.map((item, index) => {
                                let imageBase64 = '';
                                if (item.image) {
                                    imageBase64 = new Buffer(item.image, 'base64').toString('binary');

                                }
                                return (
                                    <div className='content-doctor' key={index}>
                                        <div className='header-doctor' >
                                            <div className='left-doctor'>
                                                <img className='img-avt' src={imageBase64} />
                                            </div>
                                            <div className='right-doctor'>
                                                <div className='content-right-name' >
                                                    {item.lastName} {item.firstName}
                                                </div>
                                                <div className='content-right-markdown'>
                                                    {item.Markdown
                                                        && item.Markdown.description
                                                        &&
                                                        <span>
                                                            {item.Markdown.description}
                                                        </span>
                                                    }
                                                </div>
                                                <div className='book-doctor'>
                                                    <button
                                                        onClick={() => this.handleViewDetailDoctor(item)}
                                                    ><i className="fas fa-hand-point-right"></i> Đặt lịch khám</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorAll);
