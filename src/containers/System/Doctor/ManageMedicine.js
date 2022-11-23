import React, { Component } from "react";
import { connect } from "react-redux";
import './ManageMedicine.scss';
import { toast } from "react-toastify";
import _ from "lodash";
import { manageMedicine } from '../../../services/userService';
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

class ManageSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            medicineList: {},
            nameMedicine: '',
            edit: false,
            id: '',
        }
    }

    async componentDidMount() {
        await this.getMedicine();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {


    }

    getMedicine = async () => {
        let data = {
            type: 'get',
            doctorId: this.props.user.id,
        }
        console.log("data", data);
        let res = await manageMedicine(data);
        if (res.list) {
            this.setState({
                medicineList: res.list,
            })
        } else {
            toast.error("Đã xảy ra lỗi !!!");
        }
    }
    deleteMedicine = async (id) => {
        let data = {
            type: 'delete',
            id: id,
        }
        console.log("data", data);
        let res = await manageMedicine(data);
        console.log(res.list);
        if (!res.err) {
            toast.success('Xóa thành công!');
            this.getMedicine();
        } else {
            toast.error("Đã xảy ra lỗi");
        }
    }

    editMedicine = async (item) => {
        this.setState({
            nameMedicine: item.nameMedicine,
            edit: true,
            id: item.id
        });
    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }

    saveMedicine = async () => {
        if (this.state.edit === true) {
            let data = {
                type: 'update',
                nameMedicine: this.state.nameMedicine,
                id: this.state.id,
            };
            let res = await manageMedicine(data);
            if (!res.err) {
                toast.success('Cập nhật thành công!');
                this.getMedicine();
                this.setState({
                    nameMedicine: '',
                    edit: false,
                });
            } else {
                toast.error("Đã xảy ra lỗi");
            }
        } else {
            if (this.state.nameMedicine !== '') {
                let data = {
                    type: 'new',
                    nameMedicine: this.state.nameMedicine,
                    doctorId: this.props.user.id,
                };
                let res = await manageMedicine(data);
                if (!res.err) {
                    toast.success('Thêm mới thành công!');
                    this.getMedicine();
                    this.setState({
                        nameMedicine: '',
                        edit: false,
                    });
                } else {
                    toast.error("Đã xảy ra lỗi");
                }
            } else {
                toast.warning("Nhập tên thuốc trước khi thêm !!!");
            }

        }
    }
    searchMedicine = async () => {
        if (this.state.nameMedicine === '') {
            toast.warning('Bạn chưa nhập tên thuốc!');
        } else {
            let data = {
                type: 'search',
                doctorId: this.props.user.id,
                nameMedicine: this.state.nameMedicine,
            }
            let res = await manageMedicine(data);
            if (res.err) {
                toast.warning('Tên thuốc không tồn tại!')
            } else {
                this.setState({
                    medicineList: res.list
                })
            }
        }

    }

    render() {
        let list = this.state.medicineList;
        return (

            <div className='manage-schedule-container'>
                <div className='m-s-title'>
                    Quản Lý Kho Thuốc
                </div>
                <div className='medicine-manage'>
                    <div className="manage-container">
                        <div className="medicine-input">
                            <div className="input">
                                <input placeholder="Nhập tên thuốc"
                                    value={this.state.nameMedicine}
                                    onChange={(event) => this.handleOnChangeInput(event, 'nameMedicine')}
                                >
                                </input>
                            </div>
                            {this.state.edit === true ?
                                <React.Fragment>
                                    <div className="btn-new"
                                        onClick={() => this.saveMedicine()}
                                    >
                                        <i className="fas fa-sync"></i> Cập nhật
                                    </div>
                                    <div className="btn-undo"
                                        onClick={() => this.setState({
                                            nameMedicine: '',
                                            edit: false,
                                            id: '',
                                        })}
                                    >
                                        <i className="fas fa-undo"></i>
                                    </div>
                                </React.Fragment> :
                                <React.Fragment>
                                    <div className="btn-new"
                                        onClick={() => this.saveMedicine()}
                                    >
                                        <i className="fas fa-plus"></i> Thêm Mới
                                    </div>
                                    <div className="btn-search"
                                        onClick={() => this.searchMedicine()}
                                    >
                                        <i className="fas fa-search"></i>
                                    </div>
                                    <div className="btn-undo"
                                        onClick={() => {
                                            this.setState({
                                                nameMedicine: '',
                                                edit: false,
                                                id: '',
                                            });
                                            this.getMedicine();
                                        }}
                                    >
                                        <i className="fas fa-undo"></i>
                                    </div>
                                </React.Fragment>
                            }
                            <div className="btn-excel">
                                <ReactHTMLTableToExcel
                                    id="test-table-xls-button"
                                    className="download-table-xls-button"
                                    table="table-to-xls"
                                    filename="khothuoc"
                                    sheet="quanlythuoc"
                                    buttonText=""
                                >
                                </ReactHTMLTableToExcel>
                                <div className="excel-icon">
                                    <i class="fas fa-file-excel"></i>
                                </div>
                            </div>



                        </div>

                        <table id="table">
                            <tbody>
                                <tr>
                                    <td className="title">Ngày thêm</td>
                                    <td className="title">Lần chỉnh sửa cuối</td>
                                    <td className="title">Tên thuốc</td>
                                    <td className="title center">Thao tác</td>
                                </tr>
                                {list && list.length > 0 ?
                                    list.map((item, index) => {
                                        let cdate = new Date(item.createdAt);
                                        let cdd = cdate.getDate();
                                        let cmm = cdate.getMonth() + 1;
                                        let cyy = cdate.getFullYear();
                                        let ch = cdate.getHours();
                                        let cm = cdate.getMinutes();
                                        let ctime_vi = `${ch}:${cm} ${cdd}-${cmm}-${cyy}`;
                                        let ctime_en = `${ch}:${cm} ${cdd}-${cmm}-${cyy}`;

                                        let udate = new Date(item.updatedAt);
                                        let udd = udate.getDate();
                                        let umm = udate.getMonth() + 1;
                                        let uyy = udate.getFullYear();
                                        let uh = udate.getHours();
                                        let um = udate.getMinutes();
                                        let utime_vi = `${uh}:${um} ${udd}-${umm}-${uyy}`;
                                        let utime_en = `${uh}:${um} ${udd}-${umm}-${uyy}`;

                                        return (
                                            <tr key={index}>
                                                <td>{ctime_vi}</td>
                                                <td>{utime_vi}</td>
                                                <td>{item.nameMedicine}</td>
                                                <td className="center">
                                                    <i className="fas fa-pencil-alt"
                                                        onClick={() => this.editMedicine(item)}
                                                    ></i>
                                                    <i className="fas fa-trash"
                                                        onClick={() => this.deleteMedicine(item.id)}
                                                    ></i>
                                                </td>
                                            </tr>
                                        )
                                    }) :
                                    <React.Fragment>
                                        <tr>
                                            <td colSpan='4' className="center">Không có dữ liệu</td>
                                        </tr>
                                    </React.Fragment>
                                }
                            </tbody>
                        </table>
                        <table id="table-to-xls">
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td className="title">Ngày thêm</td>
                                    <td className="title">Lần chỉnh sửa cuối</td>
                                    <td className="title">Tên thuốc</td>

                                </tr>
                                {list && list.length > 0 ?
                                    list.map((item, index) => {
                                        let cdate = new Date(item.createdAt);
                                        let cdd = cdate.getDate();
                                        let cmm = cdate.getMonth() + 1;
                                        let cyy = cdate.getFullYear();
                                        let ch = cdate.getHours();
                                        let cm = cdate.getMinutes();
                                        let ctime_vi = `${ch}:${cm} ${cdd}-${cmm}-${cyy}`;
                                        let ctime_en = `${ch}:${cm} ${cdd}-${cmm}-${cyy}`;

                                        let udate = new Date(item.updatedAt);
                                        let udd = udate.getDate();
                                        let umm = udate.getMonth() + 1;
                                        let uyy = udate.getFullYear();
                                        let uh = udate.getHours();
                                        let um = udate.getMinutes();
                                        let utime_vi = `${uh}:${um} ${udd}-${umm}-${uyy}`;
                                        let utime_en = `${uh}:${um} ${udd}-${umm}-${uyy}`;

                                        return (
                                            <tr key={index}>
                                                <td></td>
                                                <td>{ctime_vi}</td>
                                                <td>{utime_vi}</td>
                                                <td>{item.nameMedicine}</td>
                                            </tr>
                                        )
                                    }) :
                                    <React.Fragment>
                                        <tr>
                                            <td colSpan='4' className="center">Không có dữ liệu</td>
                                        </tr>
                                    </React.Fragment>
                                }
                            </tbody>
                        </table>
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
        user: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);

