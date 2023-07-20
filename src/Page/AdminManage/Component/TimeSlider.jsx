import {useState, useEffect} from 'react';
import {parseISO, format} from 'date-fns';
import "../../../CSS/time-slider.css"
import service from "../../../API/Service.js";
import moment from "moment";

function TimeSlider(props) {
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedTime, setSelectedTime] = useState(currentTime);
    const [user, setUser] = useState([]);
    const [rfidValue, setRfidValue] = useState([]);
    const [licensePlate, setLicensePlate] = useState("");
    const [position, setPosition] = useState([]);
    const [selectedDays, setSelectedDays] = useState(0); // Mặc định là ngày hôm nay
    const [playbackSpeed, setPlaybackSpeed] = useState(1); // Mặc định là x1

    useEffect(() => {
        service.getInfoCar(1, 20).then(data => {
            setUser(data)
        })
    }, [])

    useEffect(() => {
        setCurrentTime(startTime);
    }, [startTime]);

    useEffect(() => {
        if (isPlaying && rfidValue.length > 0 && startTime && currentTime) {
            service.getPositionRfidInOneDay(rfidValue, startTime, currentTime)
                .then(data => {
                    if (data) {
                        console.log(data)
                        const list = []
                        if (data && data[0]) {
                            list.push(data[0])
                            setPosition(list)
                            props.setMarker(list)
                        }
                    }
                });
        } else {
            if (rfidValue.length > 0 && startTime && endTime) {
                service.getPositionRfidInOneDay(rfidValue, startTime, endTime)
                    .then(data => {
                        if (data) {
                            const list = [];
                            data.forEach(i => {
                                list.push(i)
                            })
                            setPosition(list);
                            props.setMarker(list)
                            props.setLocation(list)
                        }
                    });
            }
        }

    }, [rfidValue, startTime, endTime, currentTime, isPlaying]);

    useEffect(() => {
        if (selectedDays === 0) {
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            const startTime = currentDate.getTime();
            const endTime = startTime + 24 * 60 * 60 * 1000;
            setStartTime(startTime);
            setEndTime(endTime);
            setCurrentTime(startTime);
        } else {
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            const startTime = currentDate - selectedDays * 24 * 60 * 60 * 1000;// Convert days to milliseconds
            const endTime = startTime + 24 * 60 * 60 * 1000;
            setStartTime(startTime);
            setEndTime(endTime);
            setCurrentTime(startTime); // Set currentTime to startTime when selecting a different number of days
        }
    }, [selectedDays]);

    const handleSliderChange = (event) => {
        const value = parseInt(event.target.value);
        setCurrentTime(value);
    };

    const handleSelectDaysChange = (event) => {
        const selectedDays = parseInt(event.target.value);
        setSelectedDays(selectedDays);
        //Khi ngày thay đổi thì set false
        setIsPlaying(false);
    };

    const handleSliderClick = () => {
        setSelectedTime(currentTime);
    };

    const handleSpeedChange = () => {
        const availablePlaybackSpeeds = [1, 2, 4, 8, 10, 20]; // List of available speeds
        const currentIndex = availablePlaybackSpeeds.indexOf(playbackSpeed);
        const nextIndex = (currentIndex + 1) % availablePlaybackSpeeds.length;
        const nextSpeed = availablePlaybackSpeeds[nextIndex];
        setPlaybackSpeed(nextSpeed);
    };

    const handleStartTimeChange = (event) => {
        const selectedDateTime = parseISO(event.target.value);
        const startTimeMilliseconds = selectedDateTime.getTime();
        setStartTime(startTimeMilliseconds);
        //Khi giờ thay đổi thì set false
        setIsPlaying(false);
    };

    const handleEndTimeChange = (event) => {
        const selectedDateTime = parseISO(event.target.value);
        const endTimeMilliseconds = selectedDateTime.getTime();
        setEndTime(endTimeMilliseconds);
        //Khi giờ thay đổi thì set false
        setIsPlaying(false);
    };

    useEffect(() => {
        let intervalId = null;

        const playSlider = () => {
            // Tăng currentTime khi đang phát và currentTime chưa vượt quá endTime
            if (isPlaying && currentTime < endTime) {
                setCurrentTime((prevTime) => prevTime + 1000 * playbackSpeed); // Multiply by playbackSpeed
            }
        };

        // Bắt đầu phát khi nhấn nút Play
        if (isPlaying) {
            intervalId = setInterval(playSlider, 1000);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [isPlaying, currentTime, endTime, playbackSpeed]);

    const handlePlayClick = () => {
        setPosition((prevPosition) => {
            if (prevPosition.length > 0) {
                props.setMarker([prevPosition[0]])
                return [prevPosition[0]]; // Chỉ giữ lại vị trí đầu tiên
            } else {
                return [];
            }
        });
        setIsPlaying(true);
    };

    const handlePauseClick = () => {
        setIsPlaying(false);
    };

    const UserInfo = () => {
        return (
            <>
                {user.map((data, index) => (
                    <button onClick={() => handleInputChange(data)} key={index} className="car-user-info-disable">
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
                {position && position.reverse().map((data, index) => {
                    const dateObj = new Date(data.date);
                    const vietnamTime = moment(dateObj).utcOffset(7);
                    const hours = vietnamTime.hours().toString().padStart(2, '0');
                    const minutes = vietnamTime.minutes().toString().padStart(2, '0');
                    const seconds = vietnamTime.seconds().toString().padStart(2, '0');
                    const formattedTime = `${hours}:${minutes}:${seconds}`;
                    return (
                        <button onClick={() => handleInputChange(data)} key={index} className="car-user-info-disable">
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
                <div className="select-days">
                    <label>Chọn nhanh: </label>
                    <select value={selectedDays} onChange={handleSelectDaysChange}>
                        <option value={0}>Hôm nay</option>
                        <option value={1}>1 Ngày trước</option>
                        <option value={2}>2 Ngày trước</option>
                        <option value={3}>3 Ngày trước</option>
                        <option value={4}>4 Ngày trước</option>
                        <option value={5}>5 Ngày trước</option>
                        <option value={6}>6 Ngày trước</option>
                        <option value={7}>7 Ngày trước</option>
                        {/* Add more options for the desired number of days */}
                    </select>
                </div>
                <div style={{marginTop: "0.5rem", marginBottom: "0.5rem"}}>
                    Hoặc chọn khoảng thời gian
                </div>
                <div>
                    Bắt đầu từ:{' '}
                    <input type="datetime-local" value={format(startTime, 'yyyy-MM-dd\'T\'HH:mm')}
                           onChange={handleStartTimeChange}/>
                </div>
                <div>
                    Kết thúc tại:{' '}
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
                <div className="div-change-play">
                    {isPlaying ? (
                        <button className="btn-pause" onClick={handlePauseClick}>Pause</button>
                    ) : (
                        <button className="btn-play" onClick={handlePlayClick}>Play</button>
                    )}
                    <button className="btn-speed" onClick={handleSpeedChange}>x{playbackSpeed}</button>
                </div>
                <div>
                    Thời gian chạy: {format(currentTime, 'HH:mm:ss')}
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