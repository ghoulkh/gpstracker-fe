import iconAccount from "../Image/icon-account.png";
import {DownOutlined} from "@ant-design/icons";
import {Menu, MenuItem} from "@mui/material";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import service from "../API/Service.js";
import {useState} from "react";
import auth from "../API/AuthService.js";

const UserLogin = ({loggedInUserObj}) => {
    const [register, setRegister] = useState(false);
    const [anchorProfile, setAnchorProfile] = useState();
    const [isAdmin] = useState(auth.checkAdmin());

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

    return (
        <>
            {isAdmin === 'admin' && loggedInUserObj.username !== undefined && <div style={{
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
                        <img style={{marginRight: "0.5rem"}}
                             src={loggedInUserObj.username.avatar !== undefined ?
                                 loggedInUserObj.username.avatar : iconAccount
                             }
                             alt=""></img>
                        <div
                            className="text-name"
                            color="inherit">{loggedInUserObj.username.fullName}</div>
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
                        {/*<MenuItem className="item-app-bar3"*/}
                        {/*          onClick={() => onClickRegister(true)}>*/}
                        {/*    Kích hoạt tài khoản</MenuItem>*/}
                        <MenuItem className="item-app-bar3"
                                  onClick={() => handleClickItem("/change-password")}>
                            Đổi mật khẩu</MenuItem>
                        <MenuItem className="item-app-bar3" onClick={() => handleLogout()}>
                            Đăng xuất</MenuItem>
                    </div>
                </Menu>
            </div>}
            {isAdmin === 'user' && loggedInUserObj.username !== undefined && <div style={{
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
                        <img style={{marginRight: "0.5rem"}}
                             src={loggedInUserObj.username.avatar !== undefined ?
                                 loggedInUserObj.username.avatar : iconAccount
                             }
                             alt=""></img>
                        <div
                            className="text-name"
                            color="inherit">{loggedInUserObj.username.fullName}</div>
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
        </>
    )
}

export default UserLogin;
