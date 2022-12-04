import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import './ManageClinic.scss';
import MarkdownIt from "markdown-it";
import MdEditor from 'react-markdown-editor-lite';
import { CommonUtils } from '../../../utils';
import { createNewClinic, listManage } from '../../../services/userService';
import { toast } from "react-toastify";
import ReactHTMLTableToExcel from "react-html-table-to-excel";


const mdParser = new MarkdownIt();

class ManageClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            edit: false,
            listInfo: [],
            keyWord: '',
            id: 'new'
        }
    }
    async componentDidMount() {
        await this.getList();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }

    handleOnChangeInput = (event, id) => {
        let stateCopy = { ...this.state }
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
        })
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64
            })

        }
    }

    handleSaveNewClinic = async () => {
        let res = await createNewClinic(this.state);
        if (res && res.errCode === 0) {
            toast.success('Succeeds!');
            this.setState({
                name: '',
                address: '',
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: '',
                id: 'new',
                edit: false,
            })
            await this.getList();
        } else {
            toast.error('Somthing wrongs...')
            console.log('check res: ', res)
        }
    }
    getList = async () => {
        let data = {
            table: 'clinic',
            type: 'get'
        }
        let res = await listManage(data);
        if (res.info) {
            this.setState({
                listInfo: res.info
            })
        }
    }
    searchList = async () => {
        let data = {
            table: 'clinic',
            type: 'search',
            keyWord: this.state.keyWord
        }
        let res = await listManage(data);
        if (res.err) {
            toast.error("Đã xảy ra lỗi !");
        } else if (res.info) {
            console.log("res", res);
            this.setState({
                listInfo: res.info
            })
        }
    }
    editInfo = async (item) => {
        this.setState({
            edit: true,
            id: item.id,
            name: item.name,
            address: item.address,
            imageBase64: item.imageBase64,
            descriptionHTML: item.descriptionHTML,
            descriptionMarkdown: item.descriptionMarkdown,
        })
    }
    deleteInfo = async (item) => {
        let data = {
            table: 'clinic',
            type: 'delete',
            id: item.id
        }
        let res = await listManage(data);
        if (res.ok === 'OK') {
            toast.success("Xóa thành công !!!");
            await this.getList();
        } else {
            toast.error("Đã xảy ra lỗi !!!");
        }
    }
    newInfo = () => {
        this.setState({
            edit: true,
            name: '',
            address: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            id: 'new'
        })
    }
    render() {

        return (

            <React.Fragment>
                <div className="manage-specialty-container">
                    <div className="ms-title"> Quản lý phòng khám</div>
                    {this.state.edit === true &&
                        <div className='close-btn'>
                            <i class="fas fa-times"
                                onClick={() => {
                                    this.setState({
                                        edit: false
                                    })
                                }}></i>
                        </div>
                    }
                    {this.state.edit === false ?
                        <React.Fragment>
                            <div className='search-list'>
                                <input
                                    placeholder="Tìm kiếm phòng khám"
                                    value={this.state.keyWord}
                                    onChange={(event) => this.handleOnChangeInput(event, 'keyWord')}
                                >
                                </input>
                                <div className='search-list-btn'
                                    onClick={() => this.searchList()}
                                >
                                    <i class="fas fa-search"></i>
                                </div>
                                <div className='search-list-btn'
                                    onClick={() => this.getList()}
                                >
                                    <i class="fas fa-undo"></i>
                                </div>
                                <div className='search-list-btn'
                                    onClick={() => this.newInfo()}
                                >
                                    <i class="fas fa-plus"></i>
                                </div>
                                <div className="btn-excel">
                                    <ReactHTMLTableToExcel
                                        id="test-table-xls-button"
                                        className="download-table-xls-button"
                                        table="table-excel"
                                        filename="phongkham"
                                        sheet="tatcaphongkham"
                                        buttonText=""
                                    >
                                    </ReactHTMLTableToExcel>
                                    <div className="excel-icon">
                                        <i class="fas fa-file-excel"></i>
                                    </div>
                                </div>
                            </div>
                            <div className='table-list'>
                                <table id="table">
                                    <tbody>
                                        <tr>
                                            <td className='title center'>STT</td>
                                            <td className='title'>Ảnh</td>
                                            <td className='title'>Tên</td>
                                            <td className='title'>Địa chỉ</td>
                                            <td className='title center'>Tool</td>
                                        </tr>
                                        {this.state.listInfo && this.state.listInfo.length > 0 ?
                                            <React.Fragment>
                                                {this.state.listInfo.map((item, index) => {
                                                    let imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                                                    item.imageBase64 = imageBase64;
                                                    return (
                                                        <tr key={index}>
                                                            <td className='center'>{index}</td>
                                                            <td ><img src={imageBase64} /></td>
                                                            <td >{item.name}</td>
                                                            <td >{item.address}</td>
                                                            <td className='center'>
                                                                <i class="fas fa-pencil-alt"
                                                                    onClick={() => this.editInfo(item)}
                                                                ></i>
                                                                <i class="fas fa-trash-alt"
                                                                    onClick={() => this.deleteInfo(item)}
                                                                ></i>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                                }
                                            </React.Fragment> :
                                            <React.Fragment>
                                                <tr>
                                                    <td colSpan={5} className='center'>Không tìm thấy dữ liệu trùng khớp</td>
                                                </tr>
                                            </React.Fragment>
                                        }
                                    </tbody>
                                </table>
                                {/* bang này xuất file excel*/}
                                <table id="table-excel">
                                    <tbody>
                                        <tr>
                                            <td className='title center'>STT</td>
                                            <td className='title'>Tên</td>
                                            <td className='title'>Địa chỉ</td>
                                        </tr>
                                        {this.state.listInfo && this.state.listInfo.length > 0 ?
                                            <React.Fragment>
                                                {this.state.listInfo.map((item, index) => {
                                                    let imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                                                    item.imageBase64 = imageBase64;
                                                    return (
                                                        <tr key={index}>
                                                            <td className='center'>{index}</td>
                                                            <td >{item.name}</td>
                                                            <td >{item.address}</td>

                                                        </tr>
                                                    )
                                                })
                                                }
                                            </React.Fragment> :
                                            <React.Fragment>
                                                <tr>
                                                    <td colSpan={5} className='center'>Không tìm thấy dữ liệu trùng khớp</td>
                                                </tr>
                                            </React.Fragment>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </React.Fragment> :
                        <React.Fragment>
                            <div className="add-new-specialty row">
                                <div className="col-6 form-group">
                                    <label>Tên phòng khám</label>
                                    <input
                                        className="form-control" type='text' value={this.state.name}
                                        onChange={(event) => this.handleOnChangeInput(event, 'name')}
                                    />
                                </div>
                                <div className="col-6 form-group">
                                    <label>Ảnh phòng khám</label>
                                    <input
                                        className="form-control-file" type="file"
                                        onChange={(event) => this.handleOnChangeImage(event)}
                                    />
                                    {this.state.imageBase64 !== '' &&
                                        <img src={this.state.imageBase64}
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                margin: '10px'
                                            }}
                                        />
                                    }
                                </div>
                                <div className="col-6 form-group">
                                    <label>Địa chỉ phòng khám</label>
                                    <input
                                        className="form-control-file" type="text"
                                        value={this.state.address}
                                        onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                    />
                                </div>

                                <div className="col-12">
                                    <MdEditor
                                        style={{ height: '300px' }}
                                        renderHTML={text => mdParser.render(text)}
                                        onChange={(html, text) => this.handleEditorChange(html, text)}
                                        value={this.state.descriptionMarkdown}
                                    />
                                </div>
                                <div className="col-12">
                                    <button className="btn-save-specialty"
                                        onClick={() => this.handleSaveNewClinic()}
                                    >Save</button>
                                </div>
                            </div>
                        </React.Fragment>
                    }
                </div>
            </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
