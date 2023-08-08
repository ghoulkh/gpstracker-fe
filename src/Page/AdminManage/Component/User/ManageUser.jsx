import {useEffect, useState} from "react";
import service from "../../../../API/Service.js";
import {useRecoilState} from "recoil";
import "../../../../CSS/user-info.css"
import {adminState, driverState, pageIndexState, pageSizeState, usernameState, userState} from "./recoil.js";
import {Button, Container} from "@mui/material";
import Register from "../../../Register.jsx";
import notice from "../../../../Utils/Notice.js";

const ManageUser = () => {
    const [username, setUsername] = useRecoilState(usernameState);
    const [pageIndex, setPageIndex] = useRecoilState(pageIndexState);
    const [pageSize, setPageSize] = useRecoilState(pageSizeState);
    const [user, setUser] = useRecoilState(userState);
    const [driver, setDriver] = useRecoilState(driverState);
    const [admin, setAdmin] = useRecoilState(adminState);
    const [type, setType] = useState("")
    const [id, setIndex] = useState("")
    const [openPopup, setOpenPopup] = useState(false)


    const onClickRegister = () => {
        setOpenPopup(false)
    }

    const permisstionAdmin = (value) => {
        service.permissionAdmin({
            role: "ROLE_ADMIN",
            username: value
        }).then(() => {
            setIndex(value)
            notice.success("Kích hoạt quyền quản lý thành công username:" + value)
        })
    }

    useEffect(() => {
        service.getUserInfo(username, pageIndex, pageSize).then(data => {
            let listUser = [];
            let listDriver = [];
            let listAdmin = [];

            data.forEach(dataSearch => {
                const role = dataSearch.authorities;
                if (role && role.length > 0) {
                    let isAdmin = false;
                    let isDriver = false;
                    role.forEach(dataRole => {
                        if (dataRole.role === "ROLE_ADMIN") {
                            listAdmin.push(dataSearch);
                            isAdmin = true;
                        } else if (dataRole.role === "ROLE_DRIVER") {
                            listDriver.push(dataSearch);
                            isDriver = true;
                        }
                    });

                    if (!isAdmin && !isDriver) {
                        listUser.push(dataSearch);
                    }
                }
            });

            setUser(listUser);
            setAdmin(listAdmin);
            setDriver(listDriver);
        });
    }, [pageSize, id]);

    const User = () => {
        return (
            user.length > 0 && user.map((data, index) => {
                return (
                    <div
                        className="user-info-manage-div" key={index}>
                        <div>
                            <strong>Họ và tên:</strong> {data.fullName}
                        </div>
                        <div>
                            <strong>Tên đăng nhập:</strong> {data.username}
                        </div>
                        <div>
                            <strong>Quyền hạn:</strong> [{data.authorities.map(r => r.role).join(', ')}]
                        </div>
                        <div style={{width: "100%", marginTop: "1rem", display: "flex"}}>
                            <button className="btn-custom" onClick={() => {
                                setIndex(data.username)
                                setOpenPopup(true)
                            }}>
                                Kích hoạt làm tài xế
                            </button>
                            <button className="btn-custom" onClick={() => permisstionAdmin(data.username)}>Kích hoạt làm
                                quản lý
                            </button>
                        </div>
                    </div>
                )
            })
        )
    }

    const Driver = () => {
        return (
            driver.length > 0 && driver.map((data, index) => {
                return (
                    <div className="user-info-manage-div" key={index}>
                        <div>
                            <strong>Họ và tên:</strong> {data.fullName}
                        </div>
                        <div>
                            <strong>Tên đăng nhập:</strong> {data.username}
                        </div>
                        <div>
                            <strong>Quyền hạn:</strong> [{data.authorities.map(r => r.role).join(', ')}]
                        </div>
                        <div>
                            <strong>Ngày tạo:</strong> {data.createdDate}
                        </div>
                        {data?.carInfo?.rfid &&
                            <div><strong>Thông tin xe:</strong>
                                <ul>
                                    <li>RFID: {data?.carInfo?.rfid}</li>
                                    <li>Biển số xe: {data?.carInfo?.licensePlate}</li>
                                    <li>Giấy phép: {data?.carInfo?.drivingLicense}</li>
                                    <li>RFID: {data?.carInfo?.rfid}</li>
                                    <li>Khu vực chạy: {data?.carInfo?.activeAreas.map(r => r).join(', ')}</li>
                                </ul>
                            </div>
                        }
                        {!data?.carInfo?.rfid &&
                            <div style={{width: "100%", marginTop: "1rem", display: "flex", justifyContent: "center", alignItems: "end", height: "100%"}}>
                                <button className="btn-custom" onClick={() => {
                                    setIndex(data.username)
                                    setOpenPopup(true)
                                }}>
                                    Kích hoạt làm tài xế
                                </button>
                            </div>
                        }
                    </div>
                )
            })
        )
    }

    const Admin = () => {
        return (
            admin.length > 0 && admin.map((data, index) => {
                return (
                    <div className="user-info-manage-div" key={index}>
                        <div>
                            <strong>Họ và tên:</strong> {data.fullName}
                        </div>
                        <div>
                            <strong>Tên đăng nhập:</strong> {data.username}
                        </div>
                        <div>
                            <strong>Quyền hạn:</strong> [{data.authorities.map(r => r.role).join(', ')}]
                        </div>
                    </div>
                )
            })
        )
    }

    return (
        <>
            <div style={{display: "flex", width: "100%", justifyContent: "start"}}>
                <Button onClick={() => setType("USER")}
                        style={{
                            color: type === "USER" ? "#990000" : "#282828"
                        }}>
                    Tài khoản chưa được kích hoạt
                </Button>
                <Button onClick={() => setType("DRIVER")}
                        style={{
                            color: type === "DRIVER" ? "#990000" : "#282828"
                        }}>
                    Tài xế
                </Button>
                <Button onClick={() => setType("ADMIN")}
                        style={{
                            color: type === "ADMIN" ? "#990000" : "#282828"
                        }}>
                    Quản lý
                </Button>
            </div>
            <div className="grid-container">
                {type === "USER" &&
                    <User/>
                }
                {type === "DRIVER" &&
                    <Driver/>
                }
                {type === "ADMIN" &&
                    <Admin/>
                }
            </div>
            <div className={openPopup ? "login-click" : "none-click-login"}>
                <Register clickRegisterProp={onClickRegister}
                          isAdminClick={true}
                          username={id}
                          setId={setIndex}
                />
            </div>
        </>
    )
}

export default ManageUser
