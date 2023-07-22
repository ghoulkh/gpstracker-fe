import Button from "@mui/material/Button";
import PopupOrder from "./PopupOrder.jsx";
import {useState} from "react";
import ClickChooseLocation from "../../../Map/ClickChooseLocation.jsx";

const AdminOrder = () => {
    const [openPopup, setOpenPopup] = useState(false);
    const [openMap, setOpenMap] = useState(false)
    const [lat, setLat] = useState(false)
    const [lon, setLon] = useState(false)
    const [address, setAddress] = useState(false)

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
    return (
        <>
            <div>
                <Button onClick={() => handleOpenPopup(true)}>
                    Thêm đơn
                </Button>

            </div>
            <div className={openPopup ? "login-click" : "none-click-login"}>
                <PopupOrder valueClickLocation={{
                    lat: lat,
                    lon: lon,
                    address: address
                }}
                            handleOpenPopup={handleOpenPopup}
                            handleOpenMap={handleOpenMap}/>
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