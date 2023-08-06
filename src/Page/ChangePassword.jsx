import {Select} from "antd";
import {useEffect, useState} from "react";
import auth from "../API/AuthService.js";
import service from "../API/Service.js";
import notice from "../Utils/Notice.js";

const ChangePassword = ({clickRegisterProp, clickLoginProp, actContinueProp, codeProp, usernameProp}) => {
    const [username, setUsername] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [code, setCode] = useState("");
    const [actContinue, setActContinue] = useState(false);

    useEffect(() => {
        if (auth.getUserInfo()?.username) {
            setUsername(auth.getUserInfo()?.username)
        } else {
            setUsername(usernameProp)
        }
        setActContinue(actContinueProp)
        setCode(codeProp)

    }, [actContinueProp, codeProp, usernameProp]);

    const handleChangePassword = () => {
        if (!oldPassword) {
            notice.warn("Vui lòng nhập mật khẩu cũ")
            return;
        }
        if (!newPassword) {
            notice.warn("Vui lòng nhập mật khẩu mới")
            return;
        }
        if (!confirmPassword) {
            notice.warn("Vui lòng nhập lại mật khẩu mới");
            return;
        }
        if (newPassword !== confirmPassword) {
            notice.warn("Mật khẩu không khớp nhau")
            return;
        }
        service.changePass({
            username: username,
            oldPassword: oldPassword,
            newPassword: newPassword
        }).then(() => {
            notice.success("Đặt lại mật khẩu thành công")
            setInterval(() => {
                window.location.href = "/"
            }, 2000)
        }).catch(err => {
            console.log(err)
            if (err.code === 'APP-22' || err.code === 'APP-31') {
                notice.err("Mật khẩu cũ không hợp lệ")
            } else if (err.code === "CD-11") {
                notice.err("Thông tin tài khoản không được tìm thấy")
            } else {
                notice.err("Có lỗi xảy ra, vui long thử lại sau")
            }
        })
    }

    const handleResetPassword = () => {
        if (!newPassword) {
            notice.warn("Vui lòng nhập mật khẩu mới")
            return;
        }
        if (!confirmPassword) {
            notice.warn("Vui lòng nhập lại mật khẩu mới");
            return;
        }
        if (newPassword !== confirmPassword) {
            notice.warn("Mật khẩu không khớp nhau")
            return;
        }
        service.resetPass({
            username: username,
            code: code,
            newPassword: newPassword
        }).then(() => {
            notice.success("Đôi mật khẩu thành công")
            setInterval(() => {
                window.location.href = "/"
            }, 2000)
        }).catch(err => {
            if (err.code === 'APP-32' || err.code === 'APP-31') {
                notice.err("Mã xác nhận không đúng hoặc đã hết hạn")
            } else if (err.code === "CD-11") {
                notice.err("Thông tin tài khoản không được tìm thấy")
            } else {
                notice.err("Có lỗi xảy ra, vui long thử lại sau")
            }
        })

    }
    const handleSendMail = () => {
        service.sendMail(username)
            .then(() => {
                notice.success("Vui lòng kiểm tra mail để lấy link đặt lại mật khẩu")
            })
            .catch(err => {
                if (err.code === 'CD-11') {
                    notice.inf("Tên đăng nhập không tồn tại trên hệ thống")
                } else {
                    notice.inf("Có lỗi xảy ra, vui lòng thử lại sau")
                }
            })
    }


    return (
        <>
            {auth.getUserInfo()?.username ?
                <>
                    <div className="main-login">
                        <div className="body-login-1">
                            <div className="title-login">
                                <div className="title-login-1">Đổi mật khẩu</div>
                                <div onClick={() => {
                                    clickRegisterProp(false)
                                    clickLoginProp(true)
                                }} className="title-login-2">+
                                </div>
                            </div>
                            <div className="div-input-login">
                                <input onChange={(event) => setUsername(event.target.value)}
                                       disabled={auth.getUserInfo()?.username}
                                       value={username}
                                       className="input-login"
                                       placeholder="Tên đăng nhập..."/>
                                <input onChange={(event) => setOldPassword(event.target.value)}
                                       value={oldPassword}
                                       className="input-login"
                                       maxLength={32}
                                       minLength={8}
                                       type="password"
                                       placeholder="Mật khẩu cũ..."/>
                                <input onChange={(event) => setNewPassword(event.target.value)}
                                       value={newPassword}
                                       className="input-login"
                                       maxLength={32}
                                       minLength={8}
                                       type="password"
                                       placeholder="Mật khẩu mới..."/>
                                <input onChange={(event) => setConfirmPassword(event.target.value)}
                                       value={confirmPassword}
                                       className="input-login"
                                       maxLength={32}
                                       minLength={8}
                                       type="password"
                                       placeholder="Nhập lại mẩu khẩu..."/>
                            </div>
                            <div className="div-btn-login">
                                <button onClick={handleChangePassword}
                                        className="btn-login">
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </div>
                </> :
                <>
                    <div className="main-login">
                        <div className="body-login-1">
                            <div className="title-login">
                                <div className="title-login-1">Đặt lại mật khẩu</div>
                                {actContinue ?
                                    <div onClick={() => {
                                        window.location.href = "/"
                                    }} className="title-login-2">+</div> :
                                    <div onClick={() => {
                                        clickRegisterProp(false)
                                        clickLoginProp(true)
                                    }} className="title-login-2">+</div>
                                }
                            </div>
                            <div className="div-input-login">
                                {!actContinue &&
                                    <input onChange={(event) => setUsername(event.target.value)}
                                           disabled={auth.getUserInfo()?.username}
                                           value={username}
                                           className="input-login"
                                           placeholder="Tên đăng nhập..."/>
                                }
                                {actContinue &&
                                    <>
                                        <input onChange={(event) => setNewPassword(event.target.value)}
                                               value={newPassword}
                                               className="input-login"
                                               maxLength={32}
                                               minLength={8}
                                               type="password"
                                               placeholder="Mật khẩu mới..."/>
                                        <input onChange={(event) => setConfirmPassword(event.target.value)}
                                               value={confirmPassword}
                                               className="input-login"
                                               maxLength={32}
                                               minLength={8}
                                               type="password"
                                               placeholder="Nhập lại mẩu khẩu..."/>
                                    </>
                                }
                            </div>
                            <div className="div-btn-login">
                                {actContinue ?
                                    <button onClick={handleResetPassword}
                                            className="btn-login">
                                        Xác nhận
                                    </button> :
                                    <button onClick={handleSendMail}
                                            className="btn-login">
                                        Gửi mail xác nhận
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </>
            }

        </>
    )

}

export default ChangePassword
