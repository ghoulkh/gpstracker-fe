import {Menu, MenuItem} from "@mui/material";
import {useState} from "react";
import iconAccount from "../../Image/icon-account.png";
import {DownOutlined} from "@ant-design/icons";
import {driverDeliveryTypeState} from "../recoil.js";
import {useSetRecoilState} from "recoil";

const NavigationMobileDriver = ({setPopupNavigation}) => {
    const [anchorProfile, setAnchorProfile] = useState();
    const setType = useSetRecoilState(driverDeliveryTypeState);

    const handleHoverProfile = (event) => {
        if (anchorProfile !== event.currentTarget) {
            setAnchorProfile(event.currentTarget)
        }
    }

    const handleCloseProfile = () => {
        setAnchorProfile(null)
    }

    const handleClickNEW = () => {
        setType("NEW")
        setPopupNavigation(true)
        setAnchorProfile(null)
    }

    const handleClickINPROGRESS = () => {
        setType("INPROGRESS")
        setPopupNavigation(true)
        setAnchorProfile(null)
    }

    const handleClickCOMPLETED = () => {
        setType("COMPLETED")
        setPopupNavigation(true)
        setAnchorProfile(null)
    }

    const handleClickCANCELED = () => {
        setType("CANCELED")
        setPopupNavigation(true)
        setAnchorProfile(null)
    }

    return (
        <div style={{
            "display": "flex", "justifyContent": "center", "alignItems": "center"
        }}
        >
            <button
                className="home-2"
                style={{display: "flex"}}
                onClick={(e) => handleHoverProfile(e)}
            >
                <div
                    className="user-profile"
                >
                    <div>Đơn hàng</div>
                    <DownOutlined style={{marginLeft: "0.5rem", marginTop: "2px"}}/>
                </div>
            </button>
            <div>

            </div>
            <Menu
                id="user-profile-menu"
                className="user-profile-menu"
                anchorEl={anchorProfile}
                open={Boolean(anchorProfile)}
                onClose={() => handleCloseProfile()}
                MenuListProps={{onMouseLeave: () => handleCloseProfile()}}
            >
                <div className="items-app-bar2">
                    <MenuItem className="item-app-bar3"
                              onClick={() => handleClickNEW()}>
                        Các đơn hàng mới</MenuItem>
                    <MenuItem className="item-app-bar3"
                              onClick={() => handleClickINPROGRESS()}
                    >
                        Các đơn hàng đang vận chuyển</MenuItem>
                    <MenuItem className="item-app-bar3"
                              onClick={() => handleClickCOMPLETED()}
                    >
                        Các đơn hàng đã hoàn thành</MenuItem>
                    <MenuItem className="item-app-bar3"
                              onClick={() => handleClickCANCELED()}
                    >
                        Các đơn hàng bị huỷ</MenuItem>
                </div>
            </Menu>
        </div>
    )
}

export default NavigationMobileDriver