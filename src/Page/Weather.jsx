import {useEffect, useState} from "react";
import {API_KEY} from "../Const/ActionType.js";
import notice from "../Utils/Notice.js";

const Weather = ({marker}) => {
    const [lat, setLat] = useState(21.0072824)
    const [lon, setLon] = useState(105.8426416)
    const [data, setData] = useState()

    useEffect(() => {
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=c34d0b30de706ed953190741dcd852f2&units=metric&lang=vi`
        if (marker.length > 0) {
            const lat = marker[0].lat;
            const lon = marker[0].lon;
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=c34d0b30de706ed953190741dcd852f2&units=metric&lang=vi`
        }
        fetch(`${url}`, {
            method: 'GET',
        }).then(response => response.json()).then(data => {
            if (data.cod !== 200) {
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=c34d0b30de706ed953190741dcd852f2&units=metric&lang=vi`, {
                    method: 'GET'
                }).then(response => response.json()).then(data => {
                    if (data.cod !== 200) {
                        notice.inf("Đang có lỗi khi cập nhật thông tin thời tiết!")
                    } else {
                        setData(data)
                    }
                })
            } else {
                setData(data)
            }
        }).catch(() => {
            notice.inf("Đang có lỗi khi cập nhật thông tin thời tiết!")
        })
    }, [marker]);

    return (
        <>
            {data && data.weather.length > 0 &&
                <>
                    <div>

                        <img src={`http://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
                             alt={data.weather[0].description}/>
                    </div>
                    <div>
                        <strong>Thời tiết:</strong> {data.weather[0].description}
                    </div>
                </>
            }
            <div>
                <strong>Nhiệt độ:</strong> {data?.main?.temp} độ C
            </div>
        </>
    )

}

export default Weather