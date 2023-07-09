import {useState, useEffect} from 'react';
import {parseISO, startOfDay, endOfDay, format, addMilliseconds} from 'date-fns';
import "../../CSS/time-slider.css"
import service from "../../API/Service.js";

function TimeSlider() {
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedTime, setSelectedTime] = useState(currentTime);
    const [user, setUser] = useState([]);
    const [rfidValue, setRfidValue] = useState([]);
    const [licensePlate, setLicensePlate] = useState("");
    const [position, setPosition] = useState([])

    useEffect(() => {
        service.getInfoCar(1, 20).then(data => {
            console.log(data)
            setUser(data)
        })
    }, [])

    useEffect(() => {
        // Cập nhật currentTime theo thời gian trượt thanh
        setCurrentTime(startTime);
    }, [startTime]);

    const handleSliderChange = (event) => {
        const value = parseInt(event.target.value);
        setCurrentTime(value);
    };

    const handleSliderClick = () => {
        setSelectedTime(currentTime);
    };

    const handleStartTimeChange = (event) => {
        const selectedDateTime = parseISO(event.target.value);
        const startTimeMilliseconds = selectedDateTime.getTime();
        setStartTime(startTimeMilliseconds);
    };

    const handleEndTimeChange = (event) => {
        const selectedDateTime = parseISO(event.target.value);
        const endTimeMilliseconds = selectedDateTime.getTime();
        setEndTime(endTimeMilliseconds);
    };

    useEffect(() => {
        let intervalId = null;

        const playSlider = () => {
            // Tăng currentTime khi đang phát và currentTime chưa vượt quá endTime
            if (isPlaying && currentTime < endTime) {
                setCurrentTime((prevTime) => prevTime + 1000);
            }
        };

        // Bắt đầu phát khi nhấn nút Play
        if (isPlaying) {
            intervalId = setInterval(playSlider, 1000);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [isPlaying, currentTime, endTime]);

    const handlePlayClick = () => {
        setIsPlaying(true);
    };

    const handlePauseClick = () => {
        setIsPlaying(false);
    };

    const UserInfo = () => {
        return (
            <>
                {user.map((data, index) => (
                    <button onClick={() => handleInputChange(data)} key={index} className="car-user-info">
                        <div className="rfid">
                            <div>{data.rfid}</div>
                        </div>
                        <div className="license-plate">
                            <div>{data.licensePlate}</div>
                        </div>
                        <div className="driver-name">
                            <div>{data.driver}</div>
                        </div>
                        <div className="driving-license">
                            <div>{data.drivingLicense}</div>
                        </div>
                    </button>
                ))}
            </>
        )
    }

    const handleInputChange = (data) => {
        setRfidValue([data.rfid]);
        setLicensePlate(data.licensePlate);
    };

    const CarInfo = () => {
        return (
            <>
                {position.reverse().map((data, index) => {
                    const dateObj = new Date(data.date);
                    const vietnamTime = new Date(dateObj.getTime());
                    const hours = vietnamTime.getHours().toString().padStart(2, '0');
                    const minutes = vietnamTime.getMinutes().toString().padStart(2, '0');
                    const seconds = vietnamTime.getSeconds().toString().padStart(2, '0');
                    const formattedTime = `${hours}:${minutes}:${seconds}`;
                    return (
                        <button onClick={() => handleInputChange(data)} key={index} className="car-user-info">
                            <div className="rfid">
                                <div>{formattedTime}</div>
                            </div>
                            <div className="license-plate">
                                <div>{data.lat}</div>
                            </div>
                            <div className="driver-name">
                                <div>{data.lon}</div>
                            </div>
                            <div className="driving-license">
                                <div>{data.speed}</div>
                            </div>
                        </button>
                    )
                })}
            </>
        )
    }

    return (
        <>
            <div>
                <div className="info-v1">Thông tin xe</div>
                <div className="main-car-info">
                    <div className="car-info">
                        <div className="rfid">
                            <div>RFID</div>
                        </div>
                        <div className="license-plate">
                            <div>Biển số</div>
                        </div>
                        <div className="driver-name">
                            <div>Tài xế</div>
                        </div>
                        <div className="driving-license">
                            <div>Giấy phép</div>
                        </div>
                    </div>
                    <UserInfo/>
                </div>
            </div>
            <div className="time-slider">
                <div>
                    Start Time:{' '}
                    <input type="datetime-local" value={format(startTime, 'yyyy-MM-dd\'T\'HH:mm')}
                           onChange={handleStartTimeChange}/>
                </div>
                <div>
                    End Time:{' '}
                    <input type="datetime-local" value={format(endTime, 'yyyy-MM-dd\'T\'HH:mm')}
                           onChange={handleEndTimeChange}/>
                </div>
                <div>
                    <input
                        type="range"
                        min={startTime}
                        max={endTime}
                        value={currentTime}
                        onChange={handleSliderChange}
                        onClick={handleSliderClick}
                    />
                </div>
                <div>
                    {isPlaying ? (
                        <button onClick={handlePauseClick}>Pause</button>
                    ) : (
                        <button onClick={handlePlayClick}>Play</button>
                    )}
                </div>
                <div>
                    Current Time: {format(currentTime, 'HH:mm:ss')}
                </div>
            </div>
            <div>
                <div className="info-v1">Theo dõi xe: {licensePlate}</div>
                <div className="main-car-info">
                    <div className="car-info">
                        <div className="rfid">
                            <div>Thời gian</div>
                        </div>
                        <div className="license-plate">
                            <div>Kinh độ</div>
                        </div>
                        <div className="driver-name">
                            <div>Vĩ độ</div>
                        </div>
                        <div className="driving-license">
                            <div>Tốc độ</div>
                        </div>
                    </div>
                    <CarInfo/>
                </div>
            </div>
        </>

    );
}

export default TimeSlider;