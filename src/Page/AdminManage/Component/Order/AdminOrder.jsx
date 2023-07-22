import Button from "@mui/material/Button";
import PopupOrder from "./PopupOrder.jsx";
import {useEffect, useState} from "react";
import ClickChooseLocation from "../../../Map/ClickChooseLocation.jsx";
import moment from "moment/moment.js";
import service from "../../../../API/Service.js";
import config from "../../../../API/Config.js";
import Stomp from "stompjs";
import notice from "../../../../Utils/Notice.js";
import SockJS from "sockjs-client/dist/sockjs"
import auth from "../../../../API/AuthService.js";

const AdminOrder = () => {
    const [openPopup, setOpenPopup] = useState(false);
    const [openMap, setOpenMap] = useState(false);
    const [lat, setLat] = useState(false);
    const [lon, setLon] = useState(false);
    const [address, setAddress] = useState(false);
    const [user, setUser] = useState([]);
    const [userOptions, setUserOptions] = useState([]);
    const [checkUser, setCheckUser] = useState([]);
    const [delivery, setDelivery] = useState([]);
    const [deliveryCANCELED, setDeliveryCANCELED] = useState([]);
    const [chooseUser, setChooseUser] = useState({});
    const [pageSize, setPageSize] = useState(5);
    const [pageSizeCANCELED, setPageSizeCANCELED] = useState(5);
    const usernameAdmin = auth.getUserInfo()?.username;

    const handleOpenMap = (value) => {
        setOpenMap(value)
    }

    const handleSetClickLocation = (lat, lon, address) => {
        setLat(lat)
        setLon(lon)
        setAddress(address)
    }

    const handleOpenPopup = (value) => {
        setOpenPopup(value)
    }

    const handleInputChange = (value) => {
        setPageSize(5);
        setChooseUser(value)
    }

    const handlePageSize = () => {
        if (delivery.length < pageSize) {
            notice.inf("Đã hết thông tin đế hiển thị thêm");
            return;
        }
        setPageSize(pageSize + 5);
        if (delivery.length < pageSize) {
            notice.inf("Đã hết thông tin đế hiển thị thêm");
        }
    }

    const handlePageSizeCANCELED = () => {
        if (deliveryCANCELED.length < pageSizeCANCELED) {
            notice.inf("Đã hết thông tin đế hiển thị thêm");
            return;
        }
        setPageSizeCANCELED(pageSizeCANCELED + 5);
        if (deliveryCANCELED.length < pageSizeCANCELED) {
            notice.inf("Đã hết thông tin đế hiển thị thêm");
        }
    }

    useEffect(() => {
        const listOption = [{
            value: "",
            label: `None`
        }]
        service.getInfoCar(1, 20).then(data => {
            data.map(data => {
                if (data.status === "INACTIVE") {
                    listOption.push({
                        value: data.username,
                        label: `${data.driver} - ${data.licensePlate} - ${data.rfid}`
                    })
                }
            })
            setUserOptions(listOption);
            setUser(data);
        })


        const socket = new SockJS(config.WS);
        const client = Stomp.over(socket);
        client.connect({}, () => {
            client.subscribe('/checkin/realtime', message => {
                if (message) {
                    const data = JSON.parse(message.body)
                    const listOptionNew = [];
                    notice.inf("User rfid: " + data.rfid + " đã bắt đầu giao hàng");
                    listOption.forEach(data => {
                        if (data.status === "INACTIVE") {
                            listOptionNew.push({
                                value: data.username,
                                label: `${data.driver} - ${data.licensePlate} - ${data.rfid}`
                            })
                        }
                    })
                    setUserOptions(listOptionNew);
                    setCheckUser(data);
                }
            });

        });
    }, [checkUser]);

    useEffect(() => {
        console.log(chooseUser);
        service.getDeliveryByDriverUserName(1, pageSize, usernameAdmin, chooseUser.driverUsername)
            .then(data => {
                setDelivery(data)
                console.log(data);
            }).catch((err) => {
                console.log(err)
        })
    }, [chooseUser, pageSize]);


    useEffect(() => {
        service.getDeliveryCANCELED(1, pageSizeCANCELED)
            .then(data => {
                setDeliveryCANCELED(data)
                console.log(data);
            }).catch((err) => {
            console.log(err)
        })
    }, [pageSizeCANCELED])

    const UserInfo = () => {
        return (
            <>
                {user.map((data, index) => (
                    <button onClick={() => handleInputChange(data)}
                            key={index}
                            className={data.status === 'ACTIVE' ? 'car-user-info' : 'car-user-info-disable'}>
                        <div className="rfid">
                            <div>{data.rfid}</div>
                        </div>
                        <div className="license-plate">
                            <div>{data.licensePlate}</div>
                        </div>
                        <div className="driver-name">
                            <div>{data.driver}</div>
                        </div>
                        <div className="driving-license">
                            <div>{data.drivingLicense}</div>
                        </div>
                    </button>
                ))}
            </>
        )
    }

    const DeliveryInfo = () => {
        return (
            <>
                {delivery.map((data, index) => {
                    return (
                        <button key={index} className="car-user-info-disable">
                            <div className="rfid">
                                <div>{data.id}</div>
                            </div>
                            <div className="license-plate">
                                <div>{data.fullNameReceiver}</div>
                            </div>
                            <div className="driver-name">
                                <div>{data.toAddress}</div>
                            </div>
                            <div className="driving-license">
                                <div>{data.deliveryStatus}</div>
                            </div>
                        </button>
                    )
                })}
            </>
        )
    }

    const DeliveryCANCELEDInfo = () => {
        return (
            <>
                {deliveryCANCELED.map((data, index) => {
                    return (
                        <button key={index} className="car-user-info-disable">
                            <div className="rfid">
                                <div>{data.id}</div>
                            </div>
                            <div className="license-plate">
                                <div>{data.fullNameReceiver}</div>
                            </div>
                            <div className="driver-name">
                                <div>{data.toAddress}</div>
                            </div>
                            <div className="driving-license">
                                <div>{data.deliveryStatus}</div>
                            </div>
                        </button>
                    )
                })}
            </>
        )
    }

    return (
        <>
            <div>
                <Button style={{width:"100%", color:"#990000"}} onClick={() => handleOpenPopup(true)}>
                    Thêm đơn
                </Button>

            </div>
            <div>
                <div className="info-v1">Thông tin xe</div>
                <div className="main-car-info">
                    <div className="car-info">
                        <div className="rfid">
                            <div>RFID</div>
                        </div>
                        <div className="license-plate">
                            <div>Biển số</div>
                        </div>
                        <div className="driver-name">
                            <div>Tài xế</div>
                        </div>
                        <div className="driving-license">
                            <div>Giấy phép</div>
                        </div>
                    </div>
                    <UserInfo/>
                </div>
            </div>
            <div>
                <div className="info-v1">Theo dõi đơn hàng của xe: {chooseUser.licensePlate}</div>
                <div className="main-car-info">
                    <div className="car-info">
                        <div className="rfid">
                            <div>Mã vận đơn</div>
                        </div>
                        <div className="license-plate">
                            <div>Họ tên người nhận</div>
                        </div>
                        <div className="driver-name">
                            <div>Địa chỉ người nhận</div>
                        </div>
                        <div className="driving-license">
                            <div>Trạng thái đơn hàng</div>
                        </div>
                    </div>
                    <DeliveryInfo/>
                    <Button style={{width:"100%", color:"#990000"}} onClick={handlePageSize}>
                        Xem thêm
                    </Button>
                </div>
            </div>
            <div>
                <div className="info-v1">Các đơn hàng bị huỷ</div>
                <div className="main-car-info">
                    <div className="car-info">
                        <div className="rfid">
                            <div>Mã vận đơn</div>
                        </div>
                        <div className="license-plate">
                            <div>Họ tên người nhận</div>
                        </div>
                        <div className="driver-name">
                            <div>Địa chỉ người nhận</div>
                        </div>
                        <div className="driving-license">
                            <div>Trạng thái đơn hàng</div>
                        </div>
                    </div>
                    <DeliveryCANCELEDInfo/>
                    <Button style={{width:"100%", color:"#990000"}} onClick={handlePageSizeCANCELED}>
                        Xem thêm
                    </Button>
                </div>
            </div>
            <div className={openPopup ? "login-click" : "none-click-login"}>
                <PopupOrder valueClickLocation={{
                    lat: lat,
                    lon: lon,
                    address: address
                }}
                            handleOpenPopup={handleOpenPopup}
                            handleOpenMap={handleOpenMap}
                            userOptionsProps={userOptions}
                />
            </div>
            <div className={openMap ? "login-click" : "none-click-login"}>
                <div style={{width: "100%", height: "100%"}}>
                    <ClickChooseLocation handleClickLocation={handleSetClickLocation} openMap={handleOpenMap}/>
                </div>
            </div>
        </>
    )

}

export default AdminOrder;