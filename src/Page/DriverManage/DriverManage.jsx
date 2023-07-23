import {useEffect, useState} from "react";
import service from "../../API/Service.js";
import Button from "@mui/material/Button";
import notice from "../../Utils/Notice.js";

const DriverManage = () => {
    const [deliveryNEW, setDeliveryNEW] = useState([]);
    const [deliveryINPROGRESS, setDeliveryINPROGRESS] = useState([]);
    const [deliveryCOMPLETED, setDeliveryCOMPLETED] = useState([]);
    const [deliveryCANCELED, setDeliveryCANCELED] = useState([]);
    const [pageSizeNEW, setPageSizeNEW] = useState(5);
    const [pageSizeINPROGRESS, setPageSizeINPROGRESS] = useState(5);
    const [pageSizeCOMPLETED, setPageSizeCOMPLETED] = useState(5);
    const [pageSizeCANCELED, setPageSizeCANCELED] = useState(5);
    const [isAllowAction, setIsAllowAction] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [confirmId, setConfirmId] = useState("");
    const [completeId, setCompleteId] = useState("");
    const [cancelId, setCancelId] = useState("");

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

    useEffect(() => {
        service.driverGetDeliveryByStatus(1, pageSizeNEW, "NEW").then(data => {
            setDeliveryNEW(data);
        })
    }, [pageSizeNEW, confirmId, cancelId]);

    useEffect(() => {
        service.driverGetDeliveryByStatus(1, pageSizeINPROGRESS, "IN_PROGRESS").then(data => {
            setDeliveryINPROGRESS(data);
        })
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
            notice.warn("Vui lòng ấn bắt đầu giao hàng");
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
        return (
            <>
                <div className="rfid">
                    <div>{data.fullNameReceiver}</div>
                </div>
                <div className="license-plate">
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
                                <Button style={{color:"#990000"}} onClick={() => clickConfirmDelivery(data.id)}>XÁC NHẬN</Button>
                                <Button style={{color:"#990000"}} onClick={() => clickCancelDelivery(data.id)}>HUỶ</Button>
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
                                <Button style={{color:"#990000"}} onClick={() => clickCompleteDelivery(data.id)}>ĐÃ GIAO</Button>
                                <Button style={{color:"#990000"}} onClick={() => clickCancelDelivery(data.id)}>HUỶ</Button>
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
                    <div>Họ tên người nhận</div>
                </div>
                <div className="license-plate">
                    <div>Số điện thoại người nhận</div>
                </div>
                <div className="driver-name">
                    <div>Địa chỉ người nhận</div>
                </div>
                <div className="driving-license">
                    <div>Hành động</div>
                </div>
            </div>
        )
    }

    const handleSetShowInfo = (value) => {
        setShowInfo(value)
    }

    const startProcess = () => {
        service.driverGetDeliveryByStatus(1, pageSizeNEW, "NEW").then(data => {
            if (data.length === 0) {
                setIsAllowAction(true);
            } else {
                notice.warn("Vui lòng xác nhận hết các đơn hàng mới");
            }
        })
    }

    return (
        <>
            <div>
                <div className="info-v1">Các đơn hàng mới:</div>
                <div className="main-car-info">
                    <Title/>
                    <DeliveryNEW/>
                    {deliveryNEW.length === 5 &&
                        <Button style={{width:"100%", color:"#990000"}} onClick={handlePageSizeNEW}>
                            Xem thêm
                        </Button>
                    }
                </div>
            </div>
            <Button style={{width:"100%", color:"#990000", marginTop:"1rem"}} onClick={startProcess}>
                Bắt đầu giao hàng
            </Button>
            {!showInfo &&
                <Button style={{width:"100%", color:"#990000", marginTop:"1rem"}} onClick={() => handleSetShowInfo(true)}>
                    Xem chi tiết
                </Button>
            }
            {showInfo &&
                <Button style={{width:"100%", color:"#990000", marginTop:"1rem"}} onClick={() => handleSetShowInfo(false)}>
                    Ẩn
                </Button>
            }
            {showInfo &&
                <>
                    <div>
                        <div className="info-v1">Các đơn hàng đang trong quá trình vận chuyển</div>
                        <div className="main-car-info">
                            <Title/>
                            <DeliveryINPROGRESS/>
                            {deliveryINPROGRESS.length === 5 &&
                                <Button style={{width:"100%", color:"#990000"}} onClick={handlePageSizeINPROGRESS}>
                                    Xem thêm
                                </Button>
                            }
                        </div>
                    </div>
                    <div>
                        <div className="info-v1">Các đơn hàng đã hoàn thành</div>
                        <div className="main-car-info">
                            <Title/>
                            <DeliveryCOMPLETED/>
                            {deliveryCOMPLETED.length === 5 &&
                                <Button style={{width:"100%", color:"#990000"}} onClick={handlePageSizeCOMPLETED}>
                                    Xem thêm
                                </Button>
                            }
                        </div>
                    </div>
                    <div>
                        <div className="info-v1">Các đơn hàng đã bị huỷ</div>
                        <div className="main-car-info">
                            <Title/>
                            <DeliveryCANCELED/>
                            {deliveryCANCELED.length === 5 &&
                                <Button style={{width:"100%", color:"#990000"}} onClick={handlePageSizeCANCELED}>
                                    Xem thêm
                                </Button>
                            }
                        </div>
                    </div>
                </>
            }
        </>
    )
}
export default DriverManage