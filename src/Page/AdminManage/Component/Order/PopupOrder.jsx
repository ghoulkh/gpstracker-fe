import {useEffect, useState} from "react";
import {Button} from "@mui/material";
import AddressInput from "../../../Map/AddressInput.jsx";
import {API_KEY} from "../../../../Const/ActionType.js";
import notice from "../../../../Utils/Notice.js";
import "../../../../CSS/popup-order.css";
import {Input} from "antd";

const PopupOrder = ({handleOpenPopup, handleOpenMap, valueClickLocation}) => {
    const [input, setInput] = useState(1);
    const [choose, setChoose] = useState(0);
    const [fromAddress, setFromAddress] = useState(null);
    const [fromLat, setFromLat] = useState(null);
    const [fromLon, setFromLon] = useState(null);
    const [toLat, setToLat] = useState(null);
    const [toLon, setToLon] = useState(null);
    const [toAddress, setToAddress] = useState(null)

    // Hàm xử lý khi người dùng click vào nút lấy vị trí hiện tại
    useEffect(() => {
        if (navigator.geolocation) {
            // Sử dụng Geolocation API để lấy vị trí hiện tại
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setFromLat(lat);
                    setFromLon(lng)
                    // Gọi Geocoding API để lấy địa chỉ từ vị trí hiện tại
                    getGeocodeFromLatLng(lat, lng);
                },
                (error) => {
                    alert("Không thể lấy vị trí hiện tại của bạn " + error);
                }
            );
        } else {
            alert("Trình duyệt của bạn không hỗ trợ Geolocation API.");
        }
    }, [])

    useEffect(() => {
        setToLat(valueClickLocation.lat)
        setToLon(valueClickLocation.lon)
        setToAddress(valueClickLocation.address)
    }, [valueClickLocation])

    // Hàm gọi Geocoding API để lấy địa chỉ từ tọa độ
    const getGeocodeFromLatLng = async (lat, lng) => {
        await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`, {
            method: 'GET',
        }).then(response => response.json()).then(data => {
            if (data.results.length > 0) {
                setFromAddress(data.results[0].formatted_address);
            } else {
                notice.inf("Vui lòng chọn chia sẻ vị trí.");
            }
        }).catch(() => {
            notice.inf("Vui lòng chọn chia sẻ vị trí.")
        })
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

    }

    const onClickExit = () => {
        handleOpenPopup(false);
    }

    return (
        <>
            <div className="popup-order-main">
                <div onClick={onClickExit} className="title-exit-2">+</div>
                <div className="div-location">
                    <div>
                        Địa chỉ chi nhánh: {fromAddress}
                    </div>
                    <div>
                        Nhập tên tài xế:
                        <Input>

                        </Input>
                    </div>

                    <div className="div-location-1">
                        Vị trí:
                        <div className="background-btn-choose-input">
                            <button onClick={() => handleChooseAreaOrLocation("input")}
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
                                Nhập vị trí:
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
                <Button onClick={onSubmit} style={{width: '100%'}}>Thêm</Button>
            </div>
        </>
    );
}

export default PopupOrder;