import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import service from "../../API/Service.js";
import notice from "../../Utils/Notice.js";
import MapContainer from "../Map/MapContainer.jsx";
import {useSetRecoilState} from "recoil";
import {positionClickState} from "../recoil.js";

const PositionLogDeliveryOrder = () => {
    const [data, setData] = useState([])
    const [searchParams] = useSearchParams();
    const setPositionClick = useSetRecoilState(positionClickState)
    const username = searchParams.get("username")

    useEffect(() => {
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
                notice.err("Không tồn tại trang web này!");
                setInterval(() => {
                    window.location.href = "/"
                }, 3000)
            })
    }, [username])

    return (
        <>
            <MapContainer markerStart={[]} markers={data.length > 0 ? [data[0]] : []} locations={[]}/>
        </>
    )
}

export default PositionLogDeliveryOrder;
