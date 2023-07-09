import {useEffect, useState} from "react";
import config from "../../API/Config.js";
import SockJS from "sockjs-client/dist/sockjs"
import Stomp from 'stompjs';
import service from "../../API/Service.js";
import "../../CSS/mange.css"
import PropTypes from "prop-types";

const UserManagementComponent = (props) => {
    UserManagementComponent.propTypes = {
        setMarker: PropTypes.func,
    };

    const [rfidValue, setRfidValue] = useState([]);
    const [licensePlate, setLicensePlate] = useState("");
    const [user, setUser] = useState([])
    const [position, setPosition] = useState([])

    useEffect(() => {
        const socket = new SockJS(config.WS);
        const client = Stomp.over(socket);
        if (rfidValue.length > 0) {
            client.connect({}, () => {
                console.log('WebSocket connection opened');
                rfidValue.forEach(value => {
                    client.subscribe('/rfid/' + value, message => {
                        console.log('Received message:', message.body);
                        const newPosition = JSON.parse(message.body);
                        setPosition(prevPosition => [...prevPosition, newPosition]);
                        props.setMarker([newPosition])
                    });
                })
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
        const endTime = currentDate.getTime() - 1;
        if (rfidValue.length > 0) {
            service.getPositionRfidInOneDay(rfidValue, startTime, endTime)
                .then(data => {
                    console.log(data)
                });

        }
    }, [rfidValue])

    useEffect(() => {
        service.getInfoCar(1,20).then(data => {
            console.log(data)
            setUser(data)
        })
    }, [])

    const handleInputChange = (data) => {
        setRfidValue([data.rfid]);
        setLicensePlate(data.licensePlate);
    };

    const UserInfo = () => {
        return (
            <>
                {user.map((data, index) => (
                    <button onClick={() => handleInputChange(data)} key={index} className="car-user-info">
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
                {position.reverse().map((data, index) => {
                    const dateObj = new Date(data.date);
                    const vietnamTime = new Date(dateObj.getTime());
                    const hours = vietnamTime.getHours().toString().padStart(2, '0');
                    const minutes = vietnamTime.getMinutes().toString().padStart(2, '0');
                    const seconds = vietnamTime.getSeconds().toString().padStart(2, '0');
                    const formattedTime = `${hours}:${minutes}:${seconds}`;
                    return (
                        <button onClick={() => handleInputChange(data)} key={index} className="car-user-info">
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
                <div className="info-v1">Theo dõi xe: {licensePlate}</div>
                <div className="main-car-info">
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
        </div>
    );
};

export default UserManagementComponent;