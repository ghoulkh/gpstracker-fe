import {useEffect, useState} from "react";
import {Button} from "@mui/material";
import AddressInput from "../../../Map/AddressInput.jsx";
import {API_KEY} from "../../../../Const/ActionType.js";
import notice from "../../../../Utils/Notice.js";
import "../../../../CSS/popup-order.css";
import {Input} from "antd";
import Select from 'react-select';
import service from "../../../../API/Service.js";
import AddressInput2 from "../../../Map/AddressInput2.jsx";


const PopupOrder = ({
                        handleOpenPopup,
                        handleOpenMap,
                        valueClickLocation,
                        userOptionsProps,
                        isView,
                        item,
                        isEdit,
                        callBackGetDeliveryCANCELED,
                        setOpenMapInfo,
                        valueClickFromLocation
                    }) => {
    const [input, setInput] = useState(1);
    const [choose, setChoose] = useState(0);
    const [inputFrom, setInputFrom] = useState(1);
    const [chooseFrom, setChooseFrom] = useState(0);
    const [fromAddress, setFromAddress] = useState("");
    const [fromLat, setFromLat] = useState("");
    const [fromLon, setFromLon] = useState("");
    const [toLat, setToLat] = useState("");
    const [toLon, setToLon] = useState("");
    const [fullNameReceiver, setFullNameReceiver] = useState("");
    const [phoneNumberReceiver, setPhoneNumberReceiver] = useState("");
    const [emailReceiver, setEmailReceiver] = useState("");
    const [senderEmail, setSenderEmail] = useState("");
    const [senderFullName, setSenderFullName] = useState("");
    const [toAddress, setToAddress] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const [driverUserName, setDriverUserName] = useState("");
    const [userOptions, setUserOptions] = useState([]);
    const [id, setId] = useState("");

    useEffect(() => {
        setDriverUserName(item?.driverUsername)
        setEmailReceiver(item?.emailReceiver)
        setFromAddress(item?.fromAddress)
        setFromLat(item?.fromLat)
        setFromLon(item?.fromLon)
        setFullNameReceiver(item?.fullNameReceiver)
        setId(item?.id)
        setPhoneNumberReceiver(item?.phoneNumberReceiver)
        setSenderEmail(item?.senderEmail)
        setSenderFullName(item?.senderFullName)
        setToAddress(item.toAddress)
        setToLon(item.toLon)
        setToLat(item.toLat)
    }, [item]);

    // Hàm xử lý khi người dùng click vào nút lấy vị trí hiện tại
    useEffect(() => {
        getGeocodeFromLatLng();
    }, []);

    useEffect(() => {
        setToLat(valueClickLocation.lat)
        setToLon(valueClickLocation.lon)
        setToAddress(valueClickLocation.address)
    }, [valueClickLocation]);


    useEffect(() => {
        setFromAddress(valueClickFromLocation.address)
    }, [valueClickFromLocation]);

    useEffect(() => {
        setUserOptions(userOptionsProps)
    }, [userOptionsProps])

    // Hàm gọi Geocoding API để lấy địa chỉ từ tọa độ
    const getGeocodeFromLatLng = async () => {
        await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${21.0072824},${105.8426416}&key=${API_KEY}`, {
            method: 'GET',
        }).then(response => response.json()).then(data => {
            if (data.results.length > 0) {
                setFromLat(21.0072824);
                setFromLon(105.8426416);
                setFromAddress(data.results[0].formatted_address);
            } else {
                notice.inf("Vui lòng chọn chia sẻ vị trí.");
            }
        }).catch(() => {
            notice.inf("Vui lòng chọn chia sẻ vị trí.")
        })
    };

    const handleSelectOption = selectedOption => {
        console.log(selectedOption)
        setSelectedOption(selectedOption)
    };

    function handleAddressInputChanged(lat, lng, address) {
        if (lat) {
            setToLat(lat);
        }
        if (lng) {
            setToLon(lng);
        }
        if (address) {
            setToAddress(address);
        }
    }

    function handleFromAddressInputChanged(lat, lng, address) {
        if (address) {
            setFromAddress(address);
        }
    }

    const openMap = () => {
        handleOpenMap(true)
    }

    const handleChooseAreaOrLocation = (type) => {
        if (type === "input") {
            setInput(2);
            setChoose(1);
        } else {
            setChoose(2);
            setInput(1);
        }
    }

    const handleChooseAreaOrLocationFrom = (type) => {
        if (type === "input") {
            setInputFrom(2);
            setChooseFrom(1);
        } else {
            setChooseFrom(2);
            setInputFrom(1);
        }
    }

    const onSubmit = () => {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        const phoneRegex = /^(0\d{9})$/;

        if (!selectedOption.value) {
            notice.inf("Vui lòng chọn tài xế");
            return;
        }
        if (!senderFullName) {
            notice.inf("Vui lòng nhập họ tên người gửi");
            return;
        }
        if (!senderEmail) {
            notice.inf("Vui lòng nhập họ tên người nhận");
            return;
        } else {
            if (!emailRegex.test(senderEmail)) {
                notice.inf("Email người gửi chưa đúng định dạng");
                return;
            }
        }
        if (!fullNameReceiver) {
            notice.inf("Vui lòng nhập họ tên người nhận");
            return;
        }
        if (!emailReceiver) {
            notice.inf("Vui lòng nhập email người nhận");
            return;
        } else {
            if (!emailRegex.test(emailReceiver)) {
                notice.inf("Email người nhận chưa đúng định dạng");
                return;
            }
        }
        if (!phoneNumberReceiver) {
            notice.inf("Vui lòng nhập số điện thoại người nhận");
            return;
        } else {
            if (!phoneRegex.test(phoneNumberReceiver)) {
                notice.inf("Số điện thoại người nhận không đúng định dạng");
                return;
            }
        }
        if (!toAddress) {
            notice.inf("Vui lòng nhập địa chỉ người nhận");
            return;
        }
        service.createDelivery({
            fromAddress: fromAddress,
            toAddress: toAddress,
            driverUsername: selectedOption.value,
            fullNameReceiver: fullNameReceiver,
            phoneNumberReceiver: phoneNumberReceiver,
            emailReceiver: emailReceiver,
            senderEmail: senderEmail,
            senderFullName: senderFullName,
            fromLat: fromLat,
            fromLon: fromLon,
            toLat: toLat,
            toLon: toLon
        }).then(() => {
            notice.success("Đã tạo mới một đơn hàng");
        }).catch((err) => {
            console.log(err)
            if (err.description) {
                notice.err(err.description);
                return;
            }
            notice.err("Có lỗi xảy ra vui lòng liên hệ CSKH");
        })
    }

    const onUpdateChange = () => {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        const phoneRegex = /^(0\d{9})$/;

        if (!selectedOption.value) {
            notice.inf("Vui lòng chọn tài xế");
            return;
        }
        if (!senderFullName) {
            notice.inf("Vui lòng nhập họ tên người gửi");
            return;
        }
        if (!senderEmail) {
            notice.inf("Vui lòng nhập họ tên người nhận");
            return;
        } else {
            if (!emailRegex.test(senderEmail)) {
                notice.inf("Email người gửi chưa đúng định dạng");
                return;
            }
        }
        if (!fullNameReceiver) {
            notice.inf("Vui lòng nhập họ tên người nhận");
            return;
        }
        if (!emailReceiver) {
            notice.inf("Vui lòng nhập email người nhận");
            return;
        } else {
            if (!emailRegex.test(emailReceiver)) {
                notice.inf("Email người nhận chưa đúng định dạng");
                return;
            }
        }
        if (!phoneNumberReceiver) {
            notice.inf("Vui lòng nhập số điện thoại người nhận");
            return;
        } else {
            if (!phoneRegex.test(phoneNumberReceiver)) {
                notice.inf("Số điện thoại người nhận không đúng định dạng");
                return;
            }
        }
        if (!item?.toAddress) {
            notice.inf("Vui lòng nhập địa chỉ người nhận");
            return;
        }
        service.changeDriverDelivery({
            fromAddress: fromAddress,
            toAddress: item?.toAddress,
            driverUsername: selectedOption.value,
            fullNameReceiver: fullNameReceiver,
            phoneNumberReceiver: phoneNumberReceiver,
            emailReceiver: emailReceiver,
            senderEmail: senderEmail,
            senderFullName: senderFullName,
            fromLat: fromLat,
            fromLon: fromLon,
            toLat: item?.toLat,
            toLon: item?.toLon
        }, item?.id).then(() => {
            notice.success("Đã cập nhật đơn hàng");
            callBackGetDeliveryCANCELED();
            handleOpenPopup(false)
        }).catch((err) => {
            console.log(err)
            notice.err("Có lỗi xảy ra vui lòng liên hệ CSKH");
        })
    }

    const handleSenderFullName = (event) => {
        setSenderFullName(event.target.value)
    }

    const handleSenderEmail = (event) => {
        setSenderEmail(event.target.value)
    }

    const handleEmailReceiver = (event) => {
        setEmailReceiver(event.target.value)
    }

    const handlePhoneNumberReceiver = (event) => {
        setPhoneNumberReceiver(event.target.value)
    }

    const handlefullNameReceiver = (event) => {
        setFullNameReceiver(event.target.value)
    }

    const onClickExit = () => {
        handleOpenPopup(false);
    }

    return (
        <>
            <div className="popup-order-main">
                <div className="popup-order-root">
                    <div className="title-exit-1">
                        <div onClick={onClickExit} className="title-exit-2">+</div>
                    </div>
                    <div className="value-form-data">
                        <h2>
                            Địa chỉ chi nhánh: Số 1 Đại Cồ Việt, Bách Khoa, Hai Bà Trưng, Hà Nội, Vietnam
                        </h2>
                        {item?.id &&
                            <h3>Mã vận đơn: {item?.id}</h3>
                        }
                        <div style={{display: "flex", width: "100%", justifyContent: "start", alignItems: "center"}}>
                            <h3>
                                Chọn tài xế:
                            </h3>
                            <div style={{
                                width: "fit-content",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                {item?.id && isView ?
                                    <>
                                        <Input disabled={isView} value={driverUserName}/>
                                    </> :
                                    <Select
                                        isDisabled={isView}
                                        color={"#990000"}
                                        value={selectedOption}
                                        onChange={handleSelectOption}
                                        options={userOptions}
                                        isSearchable // Cho phép tìm kiếm các option
                                        placeholder="Vui lòng chọn tài xế"
                                    />
                                }
                                {isEdit &&
                                    <>
                                        <div style={{marginLeft: "1rem"}}> ---</div>
                                        <div style={{marginLeft: "1rem", fontWeight: 500}}>Bị huỷ
                                            bởi {driverUserName}</div>
                                    </>
                                }
                            </div>
                        </div>

                        <div style={{display: "flex", width: "100%", justifyContent: "start", alignItems: "center"}}>
                            <h3>
                                Họ tên người gửi:
                            </h3>
                            <div style={{marginRight: "2rem"}}>
                                <Input onChange={handleSenderFullName}
                                       disabled={isView || isEdit}
                                       value={senderFullName}
                                       placeholder="Vui lòng nhập họ tên người gửi"/>
                            </div>
                            <h3>
                                Email người gửi:
                            </h3>
                            <div>
                                <Input onChange={handleSenderEmail}
                                       disabled={isView || isEdit}
                                       value={senderEmail}
                                       placeholder="Vui lòng nhập email người gửi"/>
                            </div>
                        </div>

                        {!isView && !isEdit ?
                            <>
                                <div className="div-location">
                                    <div className="div-location-1">
                                        <h3>
                                            Địa chỉ người gửi:
                                        </h3>
                                        <div className="background-btn-choose-input">
                                            <button onClick={() => handleChooseAreaOrLocationFrom("input")}
                                                    style={{marginRight: "1rem"}}
                                                    className={inputFrom % 2 === 0 ? "choose-input-or-choose-2" : "choose-input-or-choose"}>
                                                Nhập vị trí
                                            </button>
                                            <button onClick={() => handleChooseAreaOrLocationFrom("choose")}
                                                    className={chooseFrom % 2 === 0 ? "choose-input-or-choose-2" : "choose-input-or-choose"}>
                                                Chọn trên bản đồ
                                            </button>
                                        </div>
                                    </div>
                                    <div className="div-select-type-main">
                                        {inputFrom % 2 === 0 &&
                                            <div className="div-type">
                                                <AddressInput2 disable={isView}
                                                              isFrom={true}
                                                              onFromAddressChanged={handleFromAddressInputChanged}/>
                                            </div>
                                        }
                                        {chooseFrom % 2 === 0 &&
                                            <div className="btn-type-0">
                                                <button className="btn-type" onClick={() => {
                                                    openMap()
                                                    setOpenMapInfo(1)
                                                }}>
                                                    {fromAddress ? fromAddress : "Mở bản đồ"}
                                                </button>
                                            </div>}
                                    </div>
                                </div>
                            </> :
                            <>
                                <div className="div-location">
                                    <div className="div-location-1">
                                        <h3>
                                            Địa chỉ người gửi:
                                        </h3>
                                        <div className="background-btn-choose-input">
                                            <Input value={item?.fromAddress} disabled={isView || isEdit}/>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }

                        <div style={{display: "flex", width: "100%", justifyContent: "start", alignItems: "center"}}>
                            <h3>
                                Họ tên người nhận:
                            </h3>
                            <div style={{marginRight: "2rem"}}>
                                <Input onChange={handlefullNameReceiver}
                                       disabled={isView || isEdit}
                                       value={fullNameReceiver}
                                       placeholder="Vui lòng nhập họ tên người gửi"/>
                            </div>
                            <h3>
                                Email người nhận:
                            </h3>
                            <div style={{marginRight: "2rem"}}>
                                <Input onChange={handleEmailReceiver}
                                       disabled={isView || isEdit}
                                       value={emailReceiver}
                                       placeholder="Vui lòng nhập email người gửi"/>
                            </div>
                            <h3>
                                Số điện thoại người nhận:
                            </h3>
                            <div>
                                <Input onChange={handlePhoneNumberReceiver}
                                       disabled={isView || isEdit}
                                       value={phoneNumberReceiver}
                                       placeholder="Vui lòng nhập email người gửi"/>
                            </div>
                        </div>

                        {!isView && !isEdit ?
                            <>
                                <div className="div-location">
                                    <div className="div-location-1">
                                        <h3>
                                            Địa chỉ người nhận:
                                        </h3>
                                        <div className="background-btn-choose-input">
                                            <button onClick={() => handleChooseAreaOrLocation("input")}
                                                    style={{marginRight: "1rem"}}
                                                    className={input % 2 === 0 ? "choose-input-or-choose-2" : "choose-input-or-choose"}>
                                                Nhập vị trí
                                            </button>
                                            <button onClick={() => handleChooseAreaOrLocation("choose")}
                                                    className={choose % 2 === 0 ? "choose-input-or-choose-2" : "choose-input-or-choose"}>
                                                Chọn trên bản đồ
                                            </button>
                                        </div>
                                    </div>
                                    <div className="div-select-type-main">
                                        {input % 2 === 0 &&
                                            <div className="div-type">
                                                <AddressInput disable={isView}
                                                              onAddressChanged={handleAddressInputChanged}/>
                                            </div>
                                        }
                                        {choose % 2 === 0 &&
                                            <div className="btn-type-0">
                                                <button className="btn-type" onClick={() => {
                                                    openMap()
                                                    setOpenMapInfo(0)
                                                }}>
                                                    {toAddress ? toAddress : "Mở bản đồ"}
                                                </button>
                                            </div>}
                                    </div>
                                </div>
                            </> :
                            <>
                                <div className="div-location">
                                    <div className="div-location-1">
                                        <h3>
                                            Địa chỉ người nhận:
                                        </h3>
                                        <div className="background-btn-choose-input">
                                            <Input value={item?.toAddress} disabled={isView || isEdit}/>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                    {!isView && !isEdit &&
                        <div style={{width: "100%", padding: "0 15rem"}}>
                            <Button onClick={onSubmit}
                                    style={{width: "100%", marginBottom: "1rem", color: "#990000"}}>Thêm</Button>
                        </div>
                    }
                    {isEdit &&
                        <div style={{width: "100%", padding: "0 15rem"}}>
                            <Button onClick={onUpdateChange}
                                    style={{width: "100%", marginBottom: "1rem", color: "#990000"}}>Thay đổi</Button>
                        </div>
                    }
                </div>
            </div>
        </>
    );
}

export default PopupOrder;
