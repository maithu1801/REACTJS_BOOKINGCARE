import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import './ManageSpecialty.scss';
import MarkdownIt from "markdown-it";
import MdEditor from 'react-markdown-editor-lite';
import { CommonUtils } from '../../../utils';
import { createNewSpecialty, listManage } from '../../../services/userService';
import { toast } from "react-toastify";
import ReactHTMLTableToExcel from "react-html-table-to-excel";


const mdParser = new MarkdownIt();

class ManageSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
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

    handleSaveNewSpecialty = async () => {
        let res = await createNewSpecialty(this.state);
        if (res && res.errCode === 0) {
            toast.success('Add new specialty succeeds!');
            this.setState({
                name: '',
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: '',
                id: 'new',
                edit: false
            })
            await this.getList();
        } else {
            toast.error('Somthing wrongs...')
        }
    }
    getList = async () => {
        let data = {
            table: 'specialty',
            type: 'get'
        }
        let res = await listManage(data);
        if (res.info) {
            console.log(res);
            this.setState({
                listInfo: res.info
            })
        }
    }
    searchList = async () => {
        let data = {
            table: 'specialty',
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
            table: 'specialty',
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
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            edit: true,
            id: 'new'
        })
    }
    render() {

        return (
            <div className="manage-specialty-container">
                <div className="ms-title"> Quản lý chuyên khoa</div>
                {this.state.edit === true &&
                    <div className='close-btn'>
                        <i className="fas fa-times"
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
                                placeholder="Tìm kiếm chuyên khoa"
                                value={this.state.keyWord}
                                onChange={(event) => this.handleOnChangeInput(event, 'keyWord')}
                            >
                            </input>
                            <div className='search-list-btn'
                                onClick={() => this.searchList()}
                            >
                                <i className="fas fa-search"></i>
                            </div>
                            <div className='search-list-btn'
                                onClick={() => this.getList()}
                            >
                                <i className="fas fa-undo"></i>
                            </div>
                            <div className='search-list-btn'
                                onClick={() => this.newInfo()}
                            >
                                <i className="fas fa-plus"></i>
                            </div>
                            <div className="btn-excel">
                                <ReactHTMLTableToExcel
                                    id="test-table-xls-button"
                                    className="download-table-xls-button"
                                    table="table-excel"
                                    filename="chuyenkhoa"
                                    sheet="tatcachuyenkhoa"
                                    buttonText=""
                                >
                                </ReactHTMLTableToExcel>
                                <div className="excel-icon">
                                    <i className="fas fa-file-excel"></i>
                                </div>
                            </div>
                        </div>
                        <div className='table-list-specialty'>
                            <table id="table-specialty">
                                <tbody>
                                    <tr>
                                        <th className='title center'>STT</th>
                                        <th className='title'>Ảnh</th>
                                        <th className='title'>Tên</th>
                                        <th className='title center'>Tool</th>
                                    </tr>
                                    {this.state.listInfo && this.state.listInfo.length > 0 ?
                                        <React.Fragment>
                                            {this.state.listInfo.map((item, index) => {
                                                let imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                                                item.imageBase64 = imageBase64;
                                                return (
                                                    <tr key={index}>
                                                        <td className='center'>{index}</td>
                                                        <td ><img className='img-sp' src={imageBase64} /></td>
                                                        <td >{item.name}</td>
                                                        <td className='center'>
                                                            <button className='btn-edit'>
                                                                <i className="fas fa-pencil-alt"
                                                                    onClick={() => this.editInfo(item)}
                                                                ></i>
                                                            </button>
                                                            <button className="btn-delete">
                                                                <i className="fas fa-trash-alt"
                                                                    onClick={() => this.deleteInfo(item)}
                                                                ></i>
                                                            </button>
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
                            {/* bang này xuất file excel */}
                            <table id="table-excel">
                                <tbody>
                                    <tr>
                                        <td className='title center'>STT</td>
                                        <td className='title'>Tên</td>

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
                                <label>Tên chuyên khoa</label>
                                <input
                                    className="form-control" type='text' value={this.state.name}
                                    onChange={(event) => this.handleOnChangeInput(event, 'name')}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>Ảnh chuyên khoa</label>
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
                                    onClick={() => this.handleSaveNewSpecialty()}
                                >Save</button>
                            </div>
                        </div>
                    </React.Fragment>
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
