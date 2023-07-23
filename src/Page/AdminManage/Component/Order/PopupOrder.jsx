import {useEffect, useState} from "react";
import {Button} from "@mui/material";
import AddressInput from "../../../Map/AddressInput.jsx";
import {API_KEY} from "../../../../Const/ActionType.js";
import notice from "../../../../Utils/Notice.js";
import "../../../../CSS/popup-order.css";
import {Input} from "antd";
import Select from 'react-select';
import service from "../../../../API/Service.js";
import config from "../../../../API/Config.js";


const PopupOrder = ({handleOpenPopup, handleOpenMap, valueClickLocation, userOptionsProps}) => {
    const [input, setInput] = useState(1);
    const [choose, setChoose] = useState(0);
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
    const [userOptions, setUserOptions] = useState([]);
    const [checkUser, setCheckUser] = useState("");


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
            fromAddress:fromAddress,
            toAddress: toAddress,
            driverUsername:selectedOption.value,
            fullNameReceiver:fullNameReceiver,
            phoneNumberReceiver:phoneNumberReceiver,
            emailReceiver:emailReceiver,
            senderEmail:senderEmail,
            senderFullName:senderFullName,
            fromLat:fromLat,
            fromLon:fromLon,
            toLat:toLat,
            toLon:toLon
        }).then(() => {
            notice.success("Đã tạo mới một đơn hàng");
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
                            Địa chỉ chi nhánh: {fromAddress}
                        </h2>
                        <div style={{display: "flex", width:"100%", justifyContent: "start", alignItems: "center"}}>
                            <h3>
                                Chọn tài xế:
                            </h3>
                            <div style={{width:"fit-content"}}>
                                <Select
                                    color={"#990000"}
                                    value={selectedOption}
                                    onChange={handleSelectOption}
                                    options={userOptions}
                                    isSearchable // Cho phép tìm kiếm các option
                                    placeholder="Vui lòng chọn tài xế"
                                />
                            </div>
                        </div>

                        <div style={{display: "flex", width:"100%", justifyContent: "start", alignItems: "center"}}>
                            <h3>
                                Họ tên người gửi:
                            </h3>
                            <div style={{marginRight:"2rem"}}>
                                <Input onChange={handleSenderFullName} placeholder="Vui lòng nhập họ tên người gửi"/>
                            </div>
                            <h3>
                                Email người gửi:
                            </h3>
                            <div>
                                <Input onChange={handleSenderEmail} placeholder="Vui lòng nhập email người gửi"/>
                            </div>
                        </div>

                        <div style={{display: "flex", width:"100%", justifyContent: "start", alignItems: "center"}}>
                            <h3>
                                Họ tên người nhận:
                            </h3>
                            <div style={{marginRight:"2rem"}}>
                                <Input onChange={handlefullNameReceiver} placeholder="Vui lòng nhập họ tên người gửi"/>
                            </div>
                            <h3>
                                Email người nhận:
                            </h3>
                            <div style={{marginRight:"2rem"}}>
                                <Input onChange={handleEmailReceiver} placeholder="Vui lòng nhập email người gửi"/>
                            </div>
                            <h3>
                                Số điện thoại người nhận:
                            </h3>
                            <div>
                                <Input onChange={handlePhoneNumberReceiver} placeholder="Vui lòng nhập email người gửi"/>
                            </div>
                        </div>

                        <div className="div-location">
                            <div className="div-location-1">
                                <h3>
                                    Địa chỉ người nhận:
                                </h3>
                                <div className="background-btn-choose-input">
                                    <button onClick={() => handleChooseAreaOrLocation("input")}
                                            style={{marginRight:"1rem"}}
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
                                        <AddressInput onAddressChanged={handleAddressInputChanged}/>
                                    </div>
                                }
                                {choose % 2 === 0 &&
                                    <div className="btn-type-0">
                                        <button className="btn-type" onClick={openMap}>
                                            {toAddress ? toAddress : "Mở bản đồ"}
                                        </button>
                                    </div>}
                            </div>
                        </div>
                    </div>
                    <div style={{width:"100%",padding:"0 15rem"}}>
                        <Button onClick={onSubmit} style={{width:"100%",marginBottom:"1rem", color:"#990000"}}>Thêm</Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PopupOrder;