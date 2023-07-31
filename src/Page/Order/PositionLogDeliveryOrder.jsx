import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import service from "../../API/Service.js";
import notice from "../../Utils/Notice.js";
import MapContainer from "../Map/MapContainer.jsx";
import {useSetRecoilState} from "recoil";
import {collapsedState, positionClickState} from "../recoil.js";
import {Button} from "@mui/material";

const PositionLogDeliveryOrder = ({username, setUsername}) => {
    const [data, setData] = useState([])
    const setPositionClick = useSetRecoilState(positionClickState)
    const setCollapsed = useSetRecoilState(collapsedState)

    useEffect(() => {
        setCollapsed(true)
        service.getPositionByUserName(username)
            .then(data => {
                setData(data)
                if (data.length > 0) {
                    setPositionClick({
                        lat: data[0].lat,
                        lng: data[0].lon,
                    })
                }
            })
            .catch(() => {
                // notice.err("Không tồn tại trang web này!");
                // setInterval(() => {
                //     window.location.href = "/"
                // }, 3000)
            })
    }, [username])

    const handleRollBack = () => {
        setUsername(null)
    }

    return (
        <>
            <MapContainer markerStart={[]} markers={data.length > 0 ? [data[0]] : []} locations={[]}/>
            <div className="user-view-map">
                <div className="user-view-map-btn">
                    <Button
                        onClick={handleRollBack}
                        style={{width:"fit-content", padding: "1rem 3rem", color: "#990000"}}>
                        Quay lại
                    </Button>
                </div>
            </div>
        </>
    )
}

export default PositionLogDeliveryOrder;
