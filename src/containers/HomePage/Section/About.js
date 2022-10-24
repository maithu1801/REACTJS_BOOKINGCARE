import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';


class About extends Component {

    render() {

        return (
            <div className="section-share section-about">
                <div className='section-about-header'>
                    Truuyền thông nói về Health
                </div>
                <div className='section-about-content'>
                    <div className='content-left'>
                        <iframe width="100%" height="400px"
                            src="https://www.youtube.com/embed/hsTwcUlCvOA"
                            title="3 Loại Rau Càng Ăn Càng Sống Lâu, Thần Dược Bổ Gấp Nhiều Nhân Sâm"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen>
                        </iframe>
                    </div>
                    <diV className='content-right'>
                        <p>
                            <h2>Chia sẻ về việc Ăn uống cách chọn thực phẩm để bảo vệ sức khỏe</h2> Làm sao để có giấc ngủ ngon thông qua các phương thuốc tự nhiên, cách điều trị và liệu pháp được truyền lại từ xa xưa và theo kinh nghiệm của cha ông chúng ta
                            trong đó có bí quyết Sống khỏe mạnh, sống trường thọ tránh bị yểu mệnh do thực phẩm bẩn, những điều kiêng kỵ, thói quen không tốt cho sức khỏe, thực phẩm gây bệnh tật, thói quen tốt cho sức khỏe  để mọi người phòng tránh, tóm lại làm sao để có cuộc sống khỏe mạnh và hạnh phúc phòng tránh được bệnh tật, đau ốm
                        </p>
                    </diV>

                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(About);