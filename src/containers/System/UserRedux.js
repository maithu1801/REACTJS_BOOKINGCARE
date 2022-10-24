import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';


class UserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {

        return (
            <div className='user-redux-container'>
                <div className='title'>
                    User Redux maithu
                </div>
                <div className='user-redux-body'>
                    <div>Them moi nguoi dung</div>
                </div>
            </div>


        );
    }
}

const mapStateToProps = state => {
    return {

    };
}

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);