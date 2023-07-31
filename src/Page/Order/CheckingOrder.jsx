import {VerticalTimeline, VerticalTimelineElement} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import "../../CSS/search-order.css"
import {format} from 'date-fns';
import PositionLogDeliveryOrder from "./PositionLogDeliveryOrder.jsx";
import {useState} from "react";

const CheckingOrder = ({delivery}) => {
    const [username, setUsername] = useState(null)
    const handleButtonClick = (username) => {
        setUsername(username)
    }

    const handleButtonMobileClick = (username) => {
        setUsername(username)
    }

    const StatusHistories = () => {
        let indexINPROGRESS
        delivery.statusHistories.map((data, index) => {
            if (data.deliveryStatus === "IN_PROGRESS") {
                indexINPROGRESS = index
            }
        })
        console.log(delivery.statusHistories)
        return (
            delivery.statusHistories.map((data, index) => {
                switch (data.deliveryStatus) {
                    case "NEW":
                        return (
                            <VerticalTimelineElement
                                className="vertical-timeline-element"
                                contentStyle={{background: 'cornflowerblue', color: '#fff'}}
                                contentArrowStyle={{borderRight: '7px solid cornflowerblue'}}
                                iconStyle={{background: 'cornflowerblue', color: '#fff'}}
                                icon={<div className="custom-icon">A</div>}
                            >
                                <h3 className="vertical-timeline-element-title">Lên đơn của: {delivery.senderFullName}
                                    <br/> Vào lúc: {format(data.createdAt, 'HH:mm\' \'dd-MM-yyyy')}
                                </h3>
                            </VerticalTimelineElement>
                        )
                    case "IN_PROGRESS":
                        if (index === indexINPROGRESS) {
                            return (
                                <VerticalTimelineElement
                                    className="vertical-timeline-element"
                                    contentStyle={{background: '#FFC542', color: '#fff'}}
                                    contentArrowStyle={{borderRight: '7px solid #FFC542'}}
                                    iconStyle={{background: '#FFC542', color: '#fff'}}
                                    icon={<div className="custom-icon">P</div>}
                                >
                                    <div className="timeline-content">
                                        <h3 className="vertical-timeline-element-title">Vận chuyển bởi
                                            Driver: {data.driverUserName}
                                            <br/> Vào lúc: {format(data.createdAt, 'HH:mm\' \'dd-MM-yyyy')}
                                        </h3>
                                        <button className="driver-in-progress"
                                                onClick={() => handleButtonClick(data.driverUserName)}>Xem vị
                                            trí tài xế
                                        </button>
                                        <button className="driver-in-progress-mobile"
                                                onClick={() => handleButtonMobileClick(data.driverUserName)}>Xem vị
                                            trí tài xế
                                        </button>
                                    </div>
                                </VerticalTimelineElement>
                            )
                        } else {
                            return (
                                <VerticalTimelineElement
                                    className="vertical-timeline-element"
                                    contentStyle={{background: '#FFC542', color: '#fff'}}
                                    contentArrowStyle={{borderRight: '7px solid #FFC542'}}
                                    iconStyle={{background: '#FFC542', color: '#fff'}}
                                    icon={<div className="custom-icon">P</div>}
                                >
                                    <div className="timeline-content">
                                        <h3 className="vertical-timeline-element-title">Vận chuyển bởi
                                            Driver: {data.driverUserName}</h3>
                                    </div>
                                </VerticalTimelineElement>
                            )
                        }
                    case "CANCELED":
                        return (
                            <VerticalTimelineElement
                                className="vertical-timeline-element"
                                contentStyle={{background: 'red', color: '#fff'}}
                                contentArrowStyle={{borderRight: '7px solid red'}}
                                iconStyle={{background: 'red', color: '#fff'}}
                                icon={<div className="custom-icon">C</div>}
                            >
                                <h3 className="vertical-timeline-element-title">Đơn hàng đã được hủy bởi tài
                                    xế: {data.driverUserName}
                                    <br/>Vào lúc: {format(data.createdAt, 'HH:mm\' \'dd-MM-yyyy')}
                                </h3>
                            </VerticalTimelineElement>
                        )
                    case "COMPLETED":
                        return (
                            <VerticalTimelineElement
                                className="vertical-timeline-element"
                                contentStyle={{background: '#4caf50', color: '#fff'}}
                                contentArrowStyle={{borderRight: '7px solid #4caf50'}}
                                iconStyle={{background: '#4caf50', color: '#fff'}}
                                icon={<div className="custom-icon">S</div>}
                            >
                                <h3 className="vertical-timeline-element-title">Giao thành công
                                    đến: {delivery.fullNameReceiver}
                                    <br/>Vào lúc: {format(data.createdAt, 'HH:mm\' \'dd-MM-yyyy')}
                                </h3>
                            </VerticalTimelineElement>
                        )
                    case "NEW_DRIVER":
                        return (
                            <VerticalTimelineElement
                                className="vertical-timeline-element"
                                contentStyle={{background: 'cornflowerblue', color: '#fff'}}
                                contentArrowStyle={{borderRight: '7px solid cornflowerblue'}}
                                iconStyle={{background: 'cornflowerblue', color: '#fff'}}
                                icon={<div className="custom-icon">A</div>}
                            >
                                <h3 className="vertical-timeline-element-title">Chuyển cho tài
                                    xế: {delivery.driverUsername}
                                    <br/> Vào lúc: {format(data.createdAt, 'HH:mm\' \'dd-MM-yyyy')}
                                </h3>
                            </VerticalTimelineElement>
                        )
                }
            })
        )
    }


    return (
        <>
            {delivery.deliveryStatus &&
                <VerticalTimeline>
                    <StatusHistories/>
                </VerticalTimeline>
            }
            <div className={username ? "login-click" : "none-click-login"}>
                <div style={{width:"100%", height: "100%", background: "#FFF"}}>
                    <PositionLogDeliveryOrder username={username} setUsername={setUsername}/>
                </div>
            </div>
        </>
    );
};

export default CheckingOrder;
