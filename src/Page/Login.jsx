import PropTypes from 'prop-types';
import {actLogin, actSaveInfo} from "../ActionService/Action.js";
import {connect} from "react-redux";
import {useEffect, useState} from "react";
import service from "../API/Service.js";

function Login(props) {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

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

    const login = () => { //login with page
        if (username && password) {
            service.login({
                username: username,
                password: password,
            }).then(data => {
                console.log(data);
                props.onLogin({
                    accessToken: data.token
                });
                service.currentUser()
                    .then(data => {
                        console.log(data)
                        const {username, avatar, fullName, email, active} = data;
                        onLoginComplete({username, avatar, fullName, email, active});
                        window.location.reload();
                    }).catch(data => {
                    console.log(data)
                })
            }).catch(data => {
                console.log(data)
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
                               placeholder="Mật khẩu..."/>
                    </div>
                    <div className="div-btn-login">
                        <button onClick={login}
                                className="btn-login">
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
