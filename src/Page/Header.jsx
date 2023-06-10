import "../CSS/header.css";
import "../CSS/login.css";
import Login from "./Login.jsx";
import {useState} from "react";
function Header() {
    const [clickLogin, setClickLogin] = useState(false);

    const onClickLogin = (value) => {
        setClickLogin(value)
    }

    console.log(clickLogin)

    return (
        <>
            <div className="main-header">
                <div className="logo-header">
                    <div className="logo-header-1">
                        <div className="HUST-header">
                            HUST
                        </div>
                        <div className="tracking-header">
                            TRACKING
                        </div>
                    </div>
                    <div className="logo-header-2">
                        Đồng hành trên mọi nẻo đường
                    </div>
                </div>
                <div className="title-header">
                    <div className="title-info-header">
                        <div className="li-title-header">
                            Tính năng
                        </div>
                        <div className="li-title-header">
                            Đối tượng sử
                        </div>
                        <div className="li-title-header">
                            Giới thiệu
                        </div>
                    </div>
                    <div className="div-login-header">
                        <button onClick={() => onClickLogin(true)}
                                className="btn-login-header">
                            Đăng nhập
                        </button>
                    </div>
                </div>
            </div>
            <div className={clickLogin ? "login-click" : "none-click-login"}>
                <Login clickLoginProp={onClickLogin}/>
            </div>
        </>
    )
}

export default Header;