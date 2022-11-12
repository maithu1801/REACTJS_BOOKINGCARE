import React, { Component } from "react";
import { connect } from "react-redux";
import './ManagePatient.scss';
import { FormattedMessage } from "react-intl";
import DatePicker from '../../../components/Input/DatePicker';




class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: new Date(),

        }
    }

    async componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }




    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        })
    }

    render() {

        return (
            <div className='manage-patient-container'>
                <div className='m-p-title'>
                    Quan ly benh nhan kham benh
                </div>
                <div className='manage-patient-body row'>
                    <div className='col-4 from-group'>
                        <label>Chon ngay kham</label>
                        <DatePicker
                            onChange={this.handleOnChangeDatePicker}
                            className="from-control"
                            value={this.state.currentDate}
                        />
                    </div>
                    <div className="col-12 table-manage-patient">
                        <table style={{ width: '100%' }}>
                            <tr>
                                <th>Name</th>
                                <th colSpan="2">Telephone</th>
                            </tr>
                            <tr>
                                <td>Bill Gates</td>
                                <td>555777999</td>
                                <td>555443333</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);

