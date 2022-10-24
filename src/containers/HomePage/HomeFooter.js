import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';


class HomeFooter extends Component {

    render() {

        return (
            <div className="home-footer">
                <p>&copy; Phan Thị Mai Thư B1809523
                    <a target='_blank' href="https://www.facebook.com/profile.php?id=100025970220158">
                        &#8594; facebook &#8592;
                    </a>

                </p>
            </div>

        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);