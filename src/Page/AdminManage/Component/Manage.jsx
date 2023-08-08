import {useEffect, useRef, useState} from "react";
import config from "../../../API/Config.js";
import SockJS from "sockjs-client/dist/sockjs"
import Stomp from 'stompjs';
import service from "../../../API/Service.js";
import "../../../CSS/mange.css"
import PropTypes from "prop-types";
import notice from "../../../Utils/Notice.js";
import {format} from "date-fns";
import {useSetRecoilState} from "recoil";
import {positionClickState} from "../../recoil.js";

const UserManagementComponent = (props) => {
    UserManagementComponent.propTypes = {
        setMarker: PropTypes.func,
    };

    const [rfidValue, setRfidValue] = useState([]);
    const [rfid, setRfid] = useState([]);
    const [licensePlate, setLicensePlate] = useState("");
    const [license, setLicense] = useState("");
    const [user, setUser] = useState([])
    const [position, setPosition] = useState([])
    const [popup, setPopup] = useState(false)
    const [checkUser, setCheckUser] = useState(null);
    const [userIndex, setUserIndex] = useState();
    const [carInfoIndex, setCarInfoIndex] = useState();
    const setPositionClick = useSetRecoilState(positionClickState);

    useEffect(() => {
        const socket = new SockJS(config.WS);
        const client = Stomp.over(socket);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const startTime = currentDate.getTime();
        const endTime = startTime + 24 * 60 * 60 * 1000;
        if (rfidValue.length > 0) {
            client.connect({}, () => {
                console.log('WebSocket connection opened');
                rfidValue.forEach(value => {
                    client.subscribe('/rfid/' + value, message => {
                        console.log('Received message:', message.body);
                        if (message) {
                            setTimeout(() => {
                                service.getPositionRfidInOneDay(rfidValue, startTime, endTime)
                                    .then(data => {
                                        if (data) {
                                            const list = [];
                                            data.forEach(i => {
                                                console.log(i);
                                                list.push(i);
                                            });
                                            setPosition(list);
                                            props.setMarker([list[0]]);
                                        }
                                    });
                            }, 2000);
                        }
                    });
                });
            });
        }
        return () => {
            client.disconnect();
            console.log('WebSocket connection closed');
        };
    }, [rfidValue]);

    useEffect(() => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const startTime = currentDate.getTime();
        const endTime = startTime + 24 * 60 * 60 * 1000;
        if (rfidValue.length > 0) {
            service.getPositionRfidInOneDay(rfidValue, startTime, endTime)
                .then(data => {
                    if (data) {
                        const list = [];
                        data.forEach(i => {
                            console.log(i)
                            list.push(i)
                        })
                        setPosition(list);
                        props.setMarker([list[0]])
                    }
                });
        }
    }, [rfidValue]);

    useEffect(() => {
        const socket = new SockJS(config.WS);
        const client = Stomp.over(socket);
        client.connect({}, () => {
            console.log('WebSocket connection opened');

            client.subscribe('/checkin/realtime', message => {
                if (message) {
                    const data = JSON.parse(message.body)
                    notice.inf("User rfid: " + data.rfid + " đã online")
                    setCheckUser(data)
                }
            });

        });
        return () => {
            client.disconnect();
            console.log('WebSocket connection closed');
        };
    }, [])

    useEffect(() => {
        service.getInfoCar(1, 20).then(data => {
            console.log(data)
            setUser(data)
        })
    }, [checkUser])

    const handleInputChange = (data, index) => {
        setUserIndex(index)
        setRfid([data.rfid])
        setLicense(data.licensePlate);
        const button = divRefUser.current.querySelector(`[data-index="${index}"]`);
        button.scrollIntoView({behavior: 'smooth', block: 'nearest'});
        if (data.status === 'INACTIVE') {
            setPopup(true)
        } else {
            setLicensePlate(data.licensePlate);
            setRfidValue([data.rfid]);
        }
    };

    const handleCarInfoChange = (data, index) => {
        setPositionClick({
            lat: data.lat,
            lng: data.lon,
        })
        setCarInfoIndex(index)
        const button = divRefCar.current.querySelector(`[data-index="${index}"]`);
        button.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    };

    const handleConfirm = () => {
        setLicensePlate(license);
        service.getPositionHistoryByRfid(rfid, 1, 1)
            .then(data => {
                if (data) {
                    const list = [];
                    data.forEach(i => {
                        console.log(i)
                        list.push(i)
                    })
                    setPosition(list);
                    props.setMarker([list[0]])
                }
            });
        setPopup(false)
    }

    const handleExit = () => {
        setPopup(false)
    }

    const divRefUser = useRef(null);
    const divRefCar = useRef(null);

    const UserInfo = () => {
        return (
            <>
                {user.map((data, index) => (
                    <button onClick={() => handleInputChange(data, index)}
                            key={index}
                            data-index={index}
                            style={{
                                border: index === userIndex && "1px solid #990000",
                            }}
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

    const CarInfo = () => {
        return (
            <>
                {position.map((data, index) => {
                    const dateObj = new Date(data.date);
                    const formattedTime = format(dateObj.getTime(), 'yyyy-MM-dd\' | \'HH:mm:ss');
                    return (
                        <button
                            key={index}
                            data-index={index}
                            style={{
                                border: index === userIndex && "1px solid #990000",
                            }}
                            onClick={() => {
                                handleCarInfoChange(data,index)
                            }}
                            className="car-user-info-disable">
                            <div className="rfid">
                                <div>{formattedTime}</div>
                            </div>
                            <div className="license-plate">
                                <div>{data.lat}</div>
                            </div>
                            <div className="driver-name">
                                <div>{data.lon}</div>
                            </div>
                            <div className="driving-license">
                                <div>{data.speed}</div>
                            </div>
                        </button>
                    )
                })}
            </>
        )
    }

    return (
        <div>
            <div>
                <div className="info-v1">Thông tin xe</div>
                <div ref={divRefUser} className="main-car-info">
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
                <div className="info-v1">Theo dõi xe: {licensePlate}</div>
                <div ref={divRefCar} className="main-car-info">
                    <div className="car-info">
                        <div className="rfid">
                            <div>Thời gian</div>
                        </div>
                        <div className="license-plate">
                            <div>Kinh độ</div>
                        </div>
                        <div className="driver-name">
                            <div>Vĩ độ</div>
                        </div>
                        <div className="driving-license">
                            <div>Tốc độ</div>
                        </div>
                    </div>
                    <CarInfo/>
                </div>
            </div>
            <div className={popup ? "login-click" : "none-click-login"}>
                <>
                    <div className="main-login">
                        <div className="body-popup-1">
                            <div className="title-popup">
                                <div className="title-popup-1">User này chưa online!</div>
                                <div className="title-popup-1">Bạn có muốn xem vị trí cuối cùng của user đó không?</div>
                            </div>
                            <div className="div-btn-popup">
                                <button onClick={handleConfirm}
                                        className="btn-popup">
                                    XÁC NHẬN
                                </button>
                                <button onClick={handleExit}
                                        className="btn-popup">
                                    HUỶ
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            </div>
        </div>
    );
};

export default UserManagementComponent;
