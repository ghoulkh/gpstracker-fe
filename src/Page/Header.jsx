import "../CSS/header.css";
import "../CSS/login.css";
import Login from "./Login.jsx";
import {useState} from "react";
import PropTypes from "prop-types";
import auth from "../API/AuthService.js";
import iconMenu from "../Image/icon-menu.svg";
import {DownOutlined} from "@ant-design/icons";
import {Menu, MenuItem} from "@mui/material";

function Header(props) {
    const [clickLogin, setClickLogin] = useState(false);
    const [isAdmin] = useState(auth.checkAdmin());
    const [anchorProfile, setAnchorProfile] = useState();

    Header.propTypes = {
        loginProp: PropTypes.func,
        loggedInUserObj: PropTypes.func,
    };

    const onClickLogin = (value) => {
        setClickLogin(value)
    }

    const handleHoverProfile = (event) => {
        if (anchorProfile !== event.currentTarget) {
            setAnchorProfile(event.currentTarget)
        }
    }

    const handleCloseProfile = () => {
        setAnchorProfile(null)
    }

    const scrollToDiv = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({behavior: 'smooth'});
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
                    <div className="title-info-header">
                        <div className="li-title-header" onClick={() => window.location.href = '/checking/order'}>
                            Tra cứu - Định vị
                        </div>
                        {isAdmin === 'admin' &&
                            <div className="li-title-header"
                                 onClick={() => window.location.href = '/admin/manager'}>
                                Quản lý và vận hành
                            </div>
                        }
                        {isAdmin === 'anonymous' &&
                            <>
                                <div onClick={() => scrollToDiv('uses-body')}
                                     className="li-title-header">
                                    Tính năng
                                </div>
                                {/* <div onClick={() => scrollToDiv('introduction-body')}
                                     className="li-title-header">
                                    Đối tượng sử dụng
                                </div> */}
                                <div onClick={() => scrollToDiv('introduction-body')}
                                     className="li-title-header">
                                    Giới thiệu
                                </div>
                            </>
                        }
                    </div>
                    {props.loggedInUserObj.username === undefined &&
                        <div className="div-login-header">
                            <button onClick={() => onClickLogin(true)}
                                    className="btn-login-header">
                                Đăng nhập
                            </button>
                        </div>
                    }
                </div>
                <div className={clickLogin ? "login-click" : "none-click-login"}>
                    <Login loginProp={props.loginProp}
                           clickLoginProp={onClickLogin}/>
                </div>
                <div style={{"justifyContent": "center", "alignItems": "center"}}
                     className="title-header-mobile"
                >
                    <button
                        className="home-2"
                        style={{display: "flex"}}
                        onClick={(e) => handleHoverProfile(e)}
                    >
                        <div
                            className="user-profile"
                        >
                            {anchorProfile ?
                                <DownOutlined style={{marginLeft: "0.5rem", marginTop: "2px"}}/>
                                :
                                <div>
                                    <img src={iconMenu} alt="menu"/>
                                </div>
                            }
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
                            <MenuItem className="item-app-bar3">
                                <div className="li-title-header"
                                     onClick={() => window.location.href = '/checking/order'}>
                                    Tra cứu - Định vị
                                </div>
                            </MenuItem>
                            <MenuItem className="item-app-bar3">
                                <div onClick={() => scrollToDiv('uses-body')}
                                     className="li-title-header">
                                    Tính năng
                                </div>
                            </MenuItem>
                            <MenuItem className="item-app-bar3">
                                <div onClick={() => scrollToDiv('introduction-body')}
                                     className="li-title-header">
                                    Giới thiệu
                                </div>
                            </MenuItem>
                            {props.loggedInUserObj.username === undefined &&
                                <MenuItem className="item-app-bar3">
                                    <div className="div-login-header">
                                        <button onClick={() => {
                                            onClickLogin(true)
                                            handleCloseProfile()
                                        }}
                                                className="btn-login-header">
                                            Đăng nhập
                                        </button>
                                    </div>
                                </MenuItem>
                            }
                        </div>
                    </Menu>
                </div>
            </div>
        </>
    )
}

export default Header;