import {useEffect, useState} from "react";
import service from "../../API/Service.js";
import Button from "@mui/material/Button";
import notice from "../../Utils/Notice.js";
import config from "../../API/Config.js";
import Stomp from "stompjs";
import SockJS from "sockjs-client/dist/sockjs"
import {format} from "date-fns";
import {driverDeliveryTypeState} from "../recoil.js";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {popupState} from "../AdminManage/Component/User/recoil.js";

const DriverManage = ({setLocation, setMarkerStart, isPopupNavigation}) => {
    const [deliveryNEW, setDeliveryNEW] = useState([]);
    const [deliveryINPROGRESS, setDeliveryINPROGRESS] = useState([]);
    const [deliveryCOMPLETED, setDeliveryCOMPLETED] = useState([]);
    const [deliveryCANCELED, setDeliveryCANCELED] = useState([]);
    const [pageSizeNEW, setPageSizeNEW] = useState(5);
    const [pageSizeINPROGRESS, setPageSizeINPROGRESS] = useState(5);
    const [pageSizeCOMPLETED, setPageSizeCOMPLETED] = useState(5);
    const [pageSizeCANCELED, setPageSizeCANCELED] = useState(5);
    const [isAllowAction, setIsAllowAction] = useState(false);
    const [showInfoNEW, setShowInfoNEW] = useState(false);
    const [showInfoINPROGRESS, setShowInfoINPROGRESS] = useState(false);
    const [showInfoCOMPLETED, setShowInfoCOMPLETED] = useState(false);
    const [showInfoCANCELED, setShowInfoCANCELED] = useState(false);
    const [confirmId, setConfirmId] = useState("");
    const [completeId, setCompleteId] = useState("");
    const [cancelId, setCancelId] = useState("");
    const [carInfo, setCarInfo] = useState({});
    const setPopup = useSetRecoilState(popupState);
    const typeNagaDelivery = useRecoilValue(driverDeliveryTypeState)

    useEffect(() => {
        service.driverGetDeliveryByStatus(1, pageSizeNEW, "NEW").then(data => {
            setDeliveryNEW(data);
        })
        service.driverGetDeliveryByStatus(1, pageSizeINPROGRESS, "IN_PROGRESS").then(data => {
            setDeliveryINPROGRESS(data);
        })
        service.driverGetDeliveryByStatus(1, pageSizeCOMPLETED, "COMPLETED").then(data => {
            setDeliveryCOMPLETED(data);
        })
        service.driverGetDeliveryByStatus(1, pageSizeCANCELED, "CANCELED").then(data => {
            setDeliveryCANCELED(data);
        })
    }, []);

    const execute = () => {
        service.driverGetDeliveryByStatus(1, pageSizeINPROGRESS, "IN_PROGRESS").then(dataINPROGRESS => {
            setDeliveryINPROGRESS(dataINPROGRESS);
            service.driverGetDeliveryByStatus(1, pageSizeNEW, "NEW").then(dataNEW => {
                if (dataNEW.length === 0) {
                    if (dataINPROGRESS.length > 0) {
                        setIsAllowAction(true);
                        service.getMyCarInfo().then(dataRFID => {
                            if (dataRFID.length > 0) {
                                setCarInfo(dataRFID[0]);
                                service.getPositionHistoryByRfid(dataRFID[0]?.rfid, 1, 1)
                                    .then(dataRfid => {
                                        let listLocation = [{
                                            lat: dataINPROGRESS[0].fromLat,
                                            lon: dataINPROGRESS[0].fromLon
                                        }]
                                        if (dataRfid.length > 0) {
                                            listLocation = [{
                                                lat: dataRfid[0].lat,
                                                lon: dataRfid[0].lon
                                            }]
                                        }
                                        dataINPROGRESS.map(point => {
                                            listLocation.push({
                                                lat: point.toLat,
                                                lon: point.toLon
                                            })
                                        })
                                        setMarkerStart([...dataRfid, ...dataINPROGRESS]);
                                        setLocation(listLocation);
                                    })
                            }
                        })
                    } else {
                        setMarkerStart([]);
                        setLocation([]);
                    }
                }
            })
        })
    }

    useEffect(() => {
        const socket = new SockJS(config.WS);
        const client = Stomp.over(socket);
        client.connect({}, () => {
            console.log('WebSocket connection opened');
            service.getMyCarInfo().then(data => {
                if (data.length === 0) {
                    notice.inf('Bạn không phải tài xế');
                    setInterval(() => {
                        localStorage.clear();
                        window.location.reload();
                    }, 2000)
                    return;
                }
                client.subscribe('/driver/' + data[0].username, message => {
                    const deliveryNew = JSON.parse(message.body)
                    if (deliveryNew.type === "WARNING_MESSAGE") {
                        setPopup(true)
                    } else {
                        notice.inf("Bạn có đơn hàng mới")
                        setDeliveryNEW(prevState => [deliveryNew.data, ...prevState])
                    }
                });

            });
        })

        return () => {
            client.disconnect();
            console.log('WebSocket connection closed');
        };
    }, [])

    useEffect(() => {
        service.driverGetDeliveryByStatus(1, pageSizeNEW, "NEW").then(data => {
            setDeliveryNEW(data);
        })
    }, [pageSizeNEW, confirmId, cancelId]);

    useEffect(() => {
        execute()
    }, [pageSizeINPROGRESS, confirmId, completeId, cancelId]);

    useEffect(() => {
        service.driverGetDeliveryByStatus(1, pageSizeCOMPLETED, "COMPLETED").then(data => {
            setDeliveryCOMPLETED(data);
        })
    }, [pageSizeCOMPLETED, completeId, cancelId]);

    useEffect(() => {
        service.driverGetDeliveryByStatus(1, pageSizeCANCELED, "CANCELED").then(data => {
            setDeliveryCANCELED(data);
        })
    }, [pageSizeCANCELED, cancelId]);

    const handlePageSizeNEW = () => {
        if (deliveryNEW.length < pageSizeNEW) {
            notice.inf("Đã hết thông tin đế hiển thị thêm");
            return;
        }
        setPageSizeNEW(pageSizeNEW + 5);
        if (deliveryNEW.length < pageSizeNEW) {
            notice.inf("Đã hết thông tin đế hiển thị thêm");
        }
    }

    const handlePageSizeINPROGRESS = () => {
        if (deliveryINPROGRESS.length < pageSizeINPROGRESS) {
            notice.inf("Đã hết thông tin đế hiển thị thêm");
            return;
        }
        setPageSizeINPROGRESS(pageSizeINPROGRESS + 5);
        if (deliveryINPROGRESS.length < pageSizeINPROGRESS) {
            notice.inf("Đã hết thông tin đế hiển thị thêm");
        }
    }

    const handlePageSizeCOMPLETED = () => {
        if (deliveryCOMPLETED.length < pageSizeCOMPLETED) {
            notice.inf("Đã hết thông tin đế hiển thị thêm");
            return;
        }
        setPageSizeCOMPLETED(pageSizeCOMPLETED + 5);
        if (deliveryCOMPLETED.length < pageSizeCOMPLETED) {
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

    const clickConfirmDelivery = (id) => {
        service.confirmDelivery(id)
            .then(data => {
                setConfirmId(id);
                console.log(data);
                notice.success("Đã nhận đơn hàng: " + id)
            }).catch(err => {
            console.log(err)
        })
    }

    const clickCompleteDelivery = (id) => {
        if (!isAllowAction) {
            notice.warn("Vui lòng xác nhận hết các đơn hàng mới");
            return;
        }
        service.completeDelivery(id)
            .then(data => {
                setCompleteId(id);
                console.log(data);
                notice.success("Đã nhận hoàn thành đơn hàng: " + id)
            }).catch(err => {
            console.log(err)
        })
    }

    const clickCancelDelivery = (id) => {
        service.cancelDelivery(id)
            .then(data => {
                setCancelId(id);
                console.log(data);
                notice.success("Đã huỷ đơn hàng: " + id)
            }).catch(err => {
            console.log(err)
        })
    }

    const Information = ({data}) => {
        let date = data.createdAt
        if (data?.statusHistories.length > 1) {
            const statusHistory = data?.statusHistories;
            const lastItem = statusHistory[statusHistory.length - 1];
            date = lastItem.createdAt;
        }
        const dateObj = new Date(date);
        const formattedTime = format(dateObj.getTime(), 'yyyy-MM-dd\' | \'HH:mm:ss');
        console.log(data)
        return (
            <>
                <div className="rfid">
                    {formattedTime}
                </div>
                <div className="license-plate">
                    <div>{data.fullNameReceiver}</div>
                    <div>{data.phoneNumberReceiver}</div>
                </div>
                <div className="driver-name">
                    <div>{data.toAddress}</div>
                </div>
            </>
        )
    }

    const DeliveryNEW = () => {
        return (
            <>
                {deliveryNEW.map((data, index) => {
                    return (
                        <button key={index} className="car-user-info-disable">
                            <Information data={data}/>
                            <div className="action-delivery">
                                <Button style={{color: "#990000"}} onClick={() => clickConfirmDelivery(data.id)}>XÁC
                                    NHẬN</Button>
                                <Button style={{color: "#990000"}}
                                        onClick={() => clickCancelDelivery(data.id)}>HUỶ</Button>
                            </div>
                        </button>
                    )
                })}
            </>
        )
    }

    const DeliveryINPROGRESS = () => {
        return (
            <>
                {deliveryINPROGRESS.map((data, index) => {
                    return (
                        <button key={index} className="car-user-info-disable">
                            <Information data={data}/>
                            <div className="action-delivery">
                                <Button style={{color: "#990000"}} onClick={() => clickCompleteDelivery(data.id)}>ĐÃ
                                    GIAO</Button>
                                <Button style={{color: "#990000"}}
                                        onClick={() => clickCancelDelivery(data.id)}>HUỶ</Button>
                            </div>
                        </button>
                    )
                })}
            </>
        )
    }

    const DeliveryCOMPLETED = () => {
        return (
            <>
                {deliveryCOMPLETED.map((data, index) => {
                    return (
                        <button key={index} className="car-user-info-disable">
                            <Information data={data}/>
                            <div className="driving-license">
                                <div>{data.deliveryStatus}</div>
                            </div>
                        </button>
                    )
                })}
            </>
        )
    }

    const DeliveryCANCELED = () => {
        return (
            <>
                {deliveryCANCELED.map((data, index) => {
                    return (
                        <button key={index} className="car-user-info-disable">
                            <Information data={data}/>
                            <div className="driving-license">
                                <div>{data.deliveryStatus}</div>
                            </div>
                        </button>
                    )
                })}
            </>
        )
    }

    const Title = () => {
        return (
            <div className="car-info">
                <div className="rfid">
                    <div>Thời gian</div>
                </div>
                <div className="license-plate">
                    <div>Liên hệ</div>
                </div>
                <div className="driver-name">
                    <div>Địa chỉ người nhận</div>
                </div>
                <div className="driving-license">
                    <div>Trạng thái</div>
                </div>
            </div>
        )
    }

    useEffect(() => {
        const socket = new SockJS(config.WS);
        const client = Stomp.over(socket);
        if (carInfo?.rfid) {
            client.connect({}, () => {
                console.log('WebSocket connection opened');
                client.subscribe('/rfid/' + carInfo?.rfid, message => {
                    console.log('Received message:', message.body);
                    const result = JSON.parse(message.body)
                    setMarkerStart(prevState => {
                        return ([result, ...prevState.slice(1)])
                    });
                    setLocation(prevState => {
                        return ([{lat: result.lat, lon: result.lon}, ...prevState.slice(1)])
                    });
                });
            });
        }
        return () => {
            client.disconnect();
            console.log('WebSocket connection closed');
        };
    }, [carInfo?.rfid]);

    return (
        <>
            {isPopupNavigation ?
                <>
                    {typeNagaDelivery === "NEW" &&
                        <div className="main-car-info">
                            <Title/>
                            <DeliveryNEW/>
                            {deliveryNEW.length === 5 &&
                                <Button style={{width: "100%", color: "#990000"}} onClick={handlePageSizeNEW}>
                                    Xem thêm
                                </Button>
                            }
                        </div>
                    }
                    {typeNagaDelivery === "INPROGRESS" &&
                        <div className="main-car-info">
                            <Title/>
                            <DeliveryINPROGRESS/>
                            {deliveryINPROGRESS.length === 5 &&
                                <Button style={{width: "100%", color: "#990000"}}
                                        onClick={handlePageSizeINPROGRESS}>
                                    Xem thêm
                                </Button>
                            }
                        </div>
                    }
                    {typeNagaDelivery === "COMPLETED" &&
                        <div className="main-car-info">
                            <Title/>
                            <DeliveryCOMPLETED/>
                            {deliveryCOMPLETED.length === 5 &&
                                <Button style={{width: "100%", color: "#990000"}}
                                        onClick={handlePageSizeCOMPLETED}>
                                    Xem thêm
                                </Button>
                            }
                        </div>
                    }
                    {typeNagaDelivery === "CANCELED" &&
                        <div className="main-car-info">
                            <Title/>
                            <DeliveryCANCELED/>
                            {deliveryCANCELED.length === 5 &&
                                <Button style={{width: "100%", color: "#990000"}}
                                        onClick={handlePageSizeCANCELED}>
                                    Xem thêm
                                </Button>
                            }
                        </div>
                    }
                </>
                :
                <>
                    <div>
                        <div className="info-v1">
                            <div style={{display: "flex", justifyContent: "start", alignItems: "center"}}>
                                <div>
                                    Các đơn hàng mới:
                                </div>
                                {!showInfoNEW &&
                                    <Button style={{color: "#990000", fontSize: "12px"}}
                                            onClick={() => setShowInfoNEW(true)}>
                                        Xem chi tiết
                                    </Button>
                                }
                                {showInfoNEW &&
                                    <Button style={{color: "#990000", fontSize: "12px"}}
                                            onClick={() => setShowInfoNEW(false)}>
                                        Ẩn
                                    </Button>
                                }
                            </div>
                        </div>
                        {showInfoNEW &&
                            <div className="main-car-info">
                                <Title/>
                                <DeliveryNEW/>
                                {deliveryNEW.length === 5 &&
                                    <Button style={{width: "100%", color: "#990000"}} onClick={handlePageSizeNEW}>
                                        Xem thêm
                                    </Button>
                                }
                            </div>
                        }
                    </div>

                    <>
                        <div>
                            <div className="info-v1">
                                <div style={{display: "flex", justifyContent: "start", alignItems: "center"}}>
                                    <div>
                                        Các đơn hàng đang trong quá trình vận chuyển:
                                    </div>
                                    {!showInfoINPROGRESS &&
                                        <Button style={{color: "#990000", fontSize: "12px"}}
                                                onClick={() => setShowInfoINPROGRESS(true)}>
                                            Xem chi tiết
                                        </Button>
                                    }
                                    {showInfoINPROGRESS &&
                                        <Button style={{color: "#990000", fontSize: "12px"}}
                                                onClick={() => setShowInfoINPROGRESS(false)}>
                                            Ẩn
                                        </Button>
                                    }
                                </div>
                            </div>
                            {showInfoINPROGRESS &&
                                <div className="main-car-info">
                                    <Title/>
                                    <DeliveryINPROGRESS/>
                                    {deliveryINPROGRESS.length === 5 &&
                                        <Button style={{width: "100%", color: "#990000"}}
                                                onClick={handlePageSizeINPROGRESS}>
                                            Xem thêm
                                        </Button>
                                    }
                                </div>
                            }
                        </div>
                        <div>
                            <div className="info-v1">
                                <div style={{display: "flex", justifyContent: "start", alignItems: "center"}}>
                                    <div>
                                        Các đơn hàng đã hoàn thành:
                                    </div>
                                    {!showInfoCOMPLETED &&
                                        <Button style={{color: "#990000", fontSize: "12px"}}
                                                onClick={() => setShowInfoCOMPLETED(true)}>
                                            Xem chi tiết
                                        </Button>
                                    }
                                    {showInfoCOMPLETED &&
                                        <Button style={{color: "#990000", fontSize: "12px"}}
                                                onClick={() => setShowInfoCOMPLETED(false)}>
                                            Ẩn
                                        </Button>
                                    }
                                </div>
                            </div>
                            {showInfoCOMPLETED &&
                                <div className="main-car-info">
                                    <Title/>
                                    <DeliveryCOMPLETED/>
                                    {deliveryCOMPLETED.length === 5 &&
                                        <Button style={{width: "100%", color: "#990000"}}
                                                onClick={handlePageSizeCOMPLETED}>
                                            Xem thêm
                                        </Button>
                                    }
                                </div>
                            }
                        </div>
                        <div>
                            <div className="info-v1">
                                <div className="info-v1">
                                    <div style={{display: "flex", justifyContent: "start", alignItems: "center"}}>
                                        <div>
                                            Các đơn hàng đã bị huỷ:
                                        </div>
                                        {!showInfoCANCELED &&
                                            <Button style={{color: "#990000", fontSize: "12px"}}
                                                    onClick={() => setShowInfoCANCELED(true)}>
                                                Xem chi tiết
                                            </Button>
                                        }
                                        {showInfoCANCELED &&
                                            <Button style={{color: "#990000", fontSize: "12px"}}
                                                    onClick={() => setShowInfoCANCELED(false)}>
                                                Ẩn
                                            </Button>
                                        }
                                    </div>
                                </div>
                            </div>
                            {showInfoCANCELED &&
                                <div className="main-car-info">
                                    <Title/>
                                    <DeliveryCANCELED/>
                                    {deliveryCANCELED.length === 5 &&
                                        <Button style={{width: "100%", color: "#990000"}}
                                                onClick={handlePageSizeCANCELED}>
                                            Xem thêm
                                        </Button>
                                    }
                                </div>
                            }
                        </div>
                    </>
                </>
            }
        </>
    )
}
export default DriverManage
