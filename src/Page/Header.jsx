import "../CSS/header.css";
import "../CSS/login.css";
import Login from "./Login.jsx";
import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {Menu, MenuItem} from "@mui/material";
import {DownOutlined} from "@ant-design/icons";
import service from "../API/Service.js";
import iconAccount from "../Image/icon-account.png";
import Register from "./Register.jsx";
import auth from "../API/AuthService.js";

function Header(props) {
    const [clickLogin, setClickLogin] = useState(false);
    const [register, setRegister] = useState(false);
    const [anchorProfile, setAnchorProfile] = useState();
    const [title, setTile] = useState("");
    const [isAdmin] = useState(auth.checkAdmin());

    Header.propTypes = {
        loginProp: PropTypes.func,
        loggedInUserObj: PropTypes.func,
    };

    useEffect(() => {
        switch (isAdmin) {
            case 'admin':
                setTile('Chào mừng quản lý đến với hệ thống');
                break;
            case 'user':
                setTile('Chào mừng tài xế đến với hệ thống');
                break;
            default: break;
        }
    }, [isAdmin]);

    const onClickLogin = (value) => {
        setClickLogin(value)
    }

    const onClickRegister = (value) => {
        setRegister(value)
    }

    const handleHoverProfile = (event) => {
        if (anchorProfile !== event.currentTarget) {
            setAnchorProfile(event.currentTarget)
        }
    }

    const handleCloseProfile = () => {
        setAnchorProfile(null)
    }

    const handleClickItem = (url) => {
        window.location.href = url
    }

    const handleLogout = () => {
        service.logoutApi().then(r => console.log(r));
        localStorage.clear()
        window.location.href = "/";
    }

    const scrollToDiv = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const onClickRedirect = (url) => {
        window.location.href = url
    }

    return (
        <>
            <div className="main-header">
                <div onClick={() => onClickRedirect("/")}
                     className="logo-header">
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
                    {isAdmin === 'admin' && <div className="title-header-text">{title}</div>}
                    {isAdmin === 'anonymous' &&
                        <div className="title-info-header">
                            <div onClick={() => scrollToDiv('uses-body')}
                                 className="li-title-header">
                                Tính năng
                            </div>
                            <div className="li-title-header">
                                Đối tượng sử dụng
                            </div>
                            <div className="li-title-header">
                                Giới thiệu
                            </div>
                        </div>
                    }
                    {props.loggedInUserObj.username === undefined &&
                        <div className="div-login-header">
                            <button onClick={() => onClickLogin(true)}
                                    className="btn-login-header">
                                Đăng nhập
                            </button>
                        </div>
                    }
                    {isAdmin === 'admin' && props.loggedInUserObj.username !== undefined && <div style={{
                        "display": "flex", "justifyContent": "center", "alignItems": "center"
                    }}
                    >
                        <button
                            className="home-2"
                            style={{display: "flex"}}
                            onClick={(e) => handleHoverProfile(e)}
                        >
                            <div
                                className="user-profile"
                            >
                                <img style={{marginRight:"0.5rem"}}
                                     src={props.loggedInUserObj.username.avatar !== undefined ?
                                    props.loggedInUserObj.username.avatar : iconAccount
                                }
                                     alt=""></img>
                                <div
                                    className="text-name"
                                    color="inherit">{props.loggedInUserObj.username.fullName}</div>
                                <DownOutlined style={{marginLeft: "0.5rem", marginTop: "2px"}}/>
                            </div>
                        </button>
                        <Menu
                            id="user-profile-menu"
                            className="user-profile-menu"
                            anchorEl={anchorProfile}
                            open={Boolean(anchorProfile)}
                            onClose={() => handleCloseProfile()}
                            MenuListProps={{onMouseLeave: () => handleCloseProfile()}}
                        >
                            <div className="items-app-bar2">
                                <MenuItem className="item-app-bar3"
                                          onClick={() => onClickRegister(true)}>
                                    Kích hoạt tài khoản</MenuItem>
                                <MenuItem className="item-app-bar3"
                                          onClick={() => window.location.href = '/admin/manager'}>
                                    Quản lý và vận hành</MenuItem>
                                <MenuItem className="item-app-bar3"
                                          onClick={() => handleClickItem("/change-password")}>
                                    Đổi mật khẩu</MenuItem>
                                <MenuItem className="item-app-bar3" onClick={() => handleLogout()}>
                                    Đăng xuất</MenuItem>
                            </div>
                        </Menu>
                    </div>}
                    {isAdmin === 'user' && props.loggedInUserObj.username !== undefined && <div style={{
                        "display": "flex", "justifyContent": "center", "alignItems": "center"
                    }}
                    >
                        <button
                            className="home-2"
                            style={{display: "flex"}}
                            onClick={(e) => handleHoverProfile(e)}
                        >
                            <div
                                className="user-profile"
                            >
                                <img style={{marginRight:"0.5rem"}}
                                     src={props.loggedInUserObj.username.avatar !== undefined ?
                                         props.loggedInUserObj.username.avatar : iconAccount
                                     }
                                     alt=""></img>
                                <div
                                    className="text-name"
                                    color="inherit">{props.loggedInUserObj.username.fullName}</div>
                                <DownOutlined style={{marginLeft: "0.5rem", marginTop: "2px"}}/>
                            </div>
                        </button>
                        <Menu
                            id="user-profile-menu"
                            className="user-profile-menu"
                            anchorEl={anchorProfile}
                            open={Boolean(anchorProfile)}
                            onClose={() => handleCloseProfile()}
                            MenuListProps={{onMouseLeave: () => handleCloseProfile()}}
                        >
                            <div className="items-app-bar2">
                                <MenuItem className="item-app-bar3"
                                          onClick={() => handleClickItem("/change-password")}>
                                    Đổi mật khẩu</MenuItem>
                                <MenuItem className="item-app-bar3" onClick={() => handleLogout()}>
                                    Đăng xuất</MenuItem>
                            </div>
                        </Menu>
                    </div>}
                </div>
            </div>
            <div className={clickLogin ? "login-click" : "none-click-login"}>
                <Login loginProp={props.loginProp}
                       clickLoginProp={onClickLogin}/>
            </div>
            <div className={register ? "login-click" : "none-click-login"}>
                <Register loginProp={props.loginProp}
                          clickRegisterProp={onClickRegister}
                          clickLoginProp={onClickLogin}
                          isAdminClick={register}
                />
            </div>
        </>
    )
}

export default Header;