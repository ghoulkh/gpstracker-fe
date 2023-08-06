import PropTypes from 'prop-types';
import {actLogin, actLogout, actSaveInfo} from "../ActionService/Action.js";
import {connect} from "react-redux";
import {useEffect, useState} from "react";
import service from "../API/Service.js";
import Register from "./Register.jsx";
import notice from "../Utils/Notice.js";
import ChangePassword from "./ChangePassword.jsx";

function Login(props) {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [register, setRegister] = useState(false);
    const [clickLogin, setClickLogin] = useState(false);

    Login.propTypes = {
        clickLoginProp: PropTypes.func,
        onSaveInfo: PropTypes.func,
        loginProp: PropTypes.func,
        onLogin: PropTypes.func,
    };
    const onClickExit = () => {
        props.clickLoginProp(false)
    }

    useEffect(() => {
    }, []);

    const onClickRegister = (value) => {
        setRegister(value)
    }

    const onClickLogin = (value) => {
        setClickLogin(value)
    }

    const login = () => { //login with page
        if (username && password) {
            notice.inf("Loading...")
            service.login({
                username: username,
                password: password,
            }).then(data => {
                props.onLogin({
                    accessToken: data.token
                });
                service.currentUser()
                    .then(data => {
                        let isAllowLogin = false;
                        data.authorities.length > 0 && data.authorities.map(checkRole => {
                            if (checkRole.role === "ROLE_DRIVER" || checkRole.role === "ROLE_ADMIN") {
                                isAllowLogin = true;
                                console.log("HERE" + isAllowLogin)

                            }
                        })
                        if (!isAllowLogin) {
                            notice.inf("Bạn không có phải tài xế, vui lòng liện hệ admin để cập nhật");
                            actLogout();
                            localStorage.clear();
                            return;
                        }
                        onLoginComplete(data);
                        notice.success("Đăng nhập thành công")
                        window.location.reload();
                    }).catch(data => {
                    console.log(data)
                    notice.err("Có lỗi xảy ra")
                })
            }).catch(data => {
                console.log(data)
                if (data.code === 'APP-22') {
                    notice.err("Sai tên đăng nhập hoặc mật khẩu")
                }
            })
        }
    }

    const onLoginComplete = (user) => {
        props.onSaveInfo(user);
        props.loginProp({username: user})
    }

    const handleInputUsername = (event) => {
        setUsername(event.target.value);
    }

    const handleInputPassword = (event) => {
        setPassword(event.target.value);
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
                        <input onChange={handleInputUsername}
                               className="input-login"
                               placeholder="Tên đăng nhập..."/>
                        <input onChange={handleInputPassword}
                               className="input-login"
                               maxLength={32}
                               minLength={8}
                               type="password"
                               placeholder="Mật khẩu..."/>
                    </div>
                    <div className="div-btn-login">
                        <button onClick={login}
                                className="btn-login">
                            ĐĂNG NHẬP
                        </button>
                    </div>
                    <div className="div-btn-login">
                        <button onClick={() => onClickRegister(true)}
                                className="btn-register">
                            ĐĂNG KÝ
                        </button>
                    </div>
                </div>
                <div className="body-login-2" onClick={() => {
                    props.setForgotPass(true)
                    onClickExit()
                }}>
                    Quên mật khẩu?
                </div>
            </div>
            <div className={register ? "login-click" : "none-click-login"}>
                <Register loginProp={props.loginProp}
                          clickRegisterProp={onClickRegister}
                          clickLoginProp={onClickLogin}/>
            </div>
        </>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (data) => {
            dispatch(actLogin(data))
        }, onSaveInfo: (data) => {
            dispatch(actSaveInfo(data))
        },
    }
}

export default connect(null, mapDispatchToProps)(Login)
