import PropTypes from 'prop-types';
function Login(props) {

    Login.propTypes = {
        clickLoginProp: PropTypes.func,
    };
    const onClickExit = () => {
        props.clickLoginProp(false)
    }

    return (
        <>
            <div className="main-login">
                <div className="body-login-1">
                    <div className="title-login">
                        <div className="title-login-1">Đăng nhập</div>
                        <div onClick={onClickExit} className="title-login-2">+</div>
                    </div>
                    <div className="div-input-login">
                        <input className="input-login"
                               placeholder="Tên đăng nhập..."/>
                        <input className="input-login"
                               placeholder="Mật khẩu..."/>
                    </div>
                    <div className="div-btn-login">
                        <button className="btn-login">
                            ĐĂNG NHẬP
                        </button>
                    </div>
                </div>
                <div className="body-login-2">
                    Quên mật khẩu?
                </div>
            </div>
        </>
    )
}

export default Login;