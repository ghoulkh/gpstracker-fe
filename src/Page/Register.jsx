import PropTypes from 'prop-types';
import {useEffect, useState} from "react";
import service from "../API/Service.js";

function Register(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    Register.propTypes = {
        clickLoginProp: PropTypes.func,
        loginProp: PropTypes.func,
    };
    const onClickExit = () => {
        props.clickLoginProp(false)
    }

    useEffect(() => {
    }, []);

    const register = () => {
        if (!username) {
            alert("Tên đăng nhập không được để trống")
            return;
        }
        if (!password) {
            alert("Mật khẩu không được để trống")
            return;
        }
        if (!rePassword) {
            alert("Nhập lại mật khẩu không được để trống")
            return;
        }
        if (!fullName) {
            alert("Họ và tên không được để trống")
            return;
        }
        if (!email) {
            alert("Email không được để trống")
            return;
        }
        if (!phone) {
            alert("Số điện thoại không được để trống")
            return;
        }
        if (password !== rePassword) {
            alert("Mật khẩu không khớp nhau")
            return;
        }

        service.register({
            username: username,
            password: password,
            fullName: fullName,
            email: email,
            phone: phone
        }).then(data => {
            console.log(data);
            if (data.username) {
                setPhone("")
                setEmail("")
                setUsername("")
                setPassword("")
                setRePassword("")
                setFullName("")
                alert("Đăng ký thành công tài khoản: " + data.username)
            }
        }).catch(data => {
            console.log(data)
            if (data.code === 'APP-20') {
                alert("Tên đăng nhập đã tồn tại")
            }
        })
    }

    const handleInputUsername = (event) => {
        setUsername(event.target.value);
    }

    const handleInputPassword = (event) => {
        setPassword(event.target.value);
    }

    const handleInputRePassword = (event) => {
        setRePassword(event.target.value);
    }

    const handleInputFullName = (event) => {
        setFullName(event.target.value);
    }

    const handleInputEmail = (event) => {
        setEmail(event.target.value);
    }

    const handleInputPhone = (event) => {
        setPhone(event.target.value.replace(/\D/g, ''));
    }

    return (
        <>
            <div className="main-login">
                <div className="body-login-1">
                    <div className="title-login">
                        <div className="title-login-1">Đăng ký</div>
                        <div onClick={onClickExit} className="title-login-2">+</div>
                    </div>
                    <div className="div-input-login">
                        <input onChange={handleInputUsername}
                               value={username}
                               className="input-login"
                               placeholder="Tên đăng nhập..."/>
                        <input onChange={handleInputPassword}
                               value={password}
                               maxLength={32}
                               minLength={8}
                               type="password"
                               className="input-login"
                               placeholder="Mật khẩu..."/>
                        <input onChange={handleInputRePassword}
                               value={rePassword}
                               className="input-login"
                               type="password"
                               placeholder="Nhập lại mật khẩu..."/>
                        <input onChange={handleInputFullName}
                               value={fullName}
                               className="input-login"
                               placeholder="Họ và tên..."/>
                        <input onChange={handleInputEmail}
                               value={email}
                               className="input-login"
                               placeholder="Email..."/>
                        <input onChange={handleInputPhone}
                               value={phone}
                               maxLength="10"
                               className="input-login"
                               placeholder="Số điện thoại..."/>
                    </div>
                    <div className="div-btn-login">
                        <button onClick={register}
                                className="btn-login">
                            ĐĂNG KÝ
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register
