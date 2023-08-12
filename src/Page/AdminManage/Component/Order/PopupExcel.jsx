import {useEffect, useState} from "react";
import "../../../../CSS/popup-order.css";
import {format} from "date-fns";
import service from "../../../../API/Service.js";
import notice from "../../../../Utils/Notice.js";
import { saveAs } from 'file-saver';
import { Button, Space } from 'antd';


const PopupExcel = ({setOpenPopupExcel}) => {
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [selectedDays, setSelectedDays] = useState(0);
    const [loadings, setLoadings] = useState(false);

    const onClickExit = () => {
        setOpenPopupExcel(false);
    }

    const handleSelectDaysChange = (event) => {
        const selectedDays = parseInt(event.target.value);
        setSelectedDays(selectedDays);
    };

    useEffect(() => {
        if (selectedDays === 0) {
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            const startTime = currentDate.getTime();
            const endTime = startTime + 24 * 60 * 60 * 1000;
            setStartTime(new Date(startTime));
            setEndTime(new Date(endTime));
        } else {
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            const startTime = currentDate - selectedDays * 24 * 60 * 60 * 1000;// Convert days to milliseconds
            const endTime = startTime + 24 * 60 * 60 * 1000;
            setStartTime(new Date(startTime));
            setEndTime(new Date(endTime));
        }
    }, [selectedDays]);

    const handleStartTime = (event) => {
        try {
            format(new Date(event.target.value), "yyyy-MM-dd")
        } catch (err) {
            notice.warn("Bạn nhập sai kí tự")
            return;
        }
        const newStartTime = new Date(event.target.value);
        setStartTime(newStartTime);
    };

    const handleEndTime = (event) => {
        try {
            format(new Date(event.target.value), "yyyy-MM-dd")
        } catch (err) {
            notice.warn("Bạn nhập sai kí tự")
            return;
        }
        const newEndTime = new Date(event.target.value);
        setEndTime(newEndTime);
    };

    const exportExcel = () => {
        setLoadings(true)
        const name1 = "Từ " + format(startTime, "yyyy-MM-dd");
        const name2 = " Đến " + format(endTime, "yyyy-MM-dd");

        service.exportExcel(startTime.getTime(), endTime.getTime()).then(response => {
            response.blob().then(blob => {
                saveAs(blob, name1 + name2 + ".xlsx");
                setLoadings(false)
            });
        }).catch(() => {
            notice.warn("Không có dữ liệu")
            setLoadings(false)
        });
    }

    return (
        <>
            <div className="popup-order-main">
                <div className="popup-order-root-123">
                    <div className="title-exit-1">
                        <div onClick={onClickExit} className="title-exit-2">+</div>
                    </div>
                    <div className="value-form-data">
                        <div className="time-slider">
                            <div className="time-slider-2">
                                <div className="select-days" style={{marginRight: "2rem"}}>
                                    <label>Chọn nhanh: </label>
                                    <select style={{width:"100%", fontSize: "16px", fontWeight: "500"}} value={selectedDays} onChange={handleSelectDaysChange}>
                                        <option value={0}>Hôm nay</option>
                                        <option value={1}>1 Ngày trước</option>
                                        <option value={2}>2 Ngày trước</option>
                                        <option value={3}>3 Ngày trước</option>
                                        <option value={4}>4 Ngày trước</option>
                                        <option value={5}>5 Ngày trước</option>
                                        <option value={6}>6 Ngày trước</option>
                                        <option value={7}>7 Ngày trước</option>
                                        <option value={14}>2 tuần trước</option>
                                        <option value={21}>3 tuần trước</option>
                                        <option value={28}>4 tuần trước</option>
                                    </select>
                                </div>
                                <div>
                                    Từ:{" "}
                                    <input
                                        style={{width:"100%", fontSize: "16px", fontWeight: "500"}}
                                        onChange={handleStartTime}
                                        type="date"
                                        value={format(startTime, "yyyy-MM-dd")}
                                    />
                                </div>
                                <div>
                                    Đến:{" "}
                                    <input
                                        style={{width:"100%", fontSize: "16px", fontWeight: "500"}}
                                        onChange={handleEndTime}
                                        type="date"
                                        value={format(endTime, "yyyy-MM-dd")}
                                    />
                                </div>
                            </div>
                            <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "1rem"}}>
                                <Space direction="vertical">
                                    <Space wrap>
                                        <Button className="btn-excel" loading={loadings} onClick={exportExcel}>
                                            Xuất báo cáo
                                        </Button>
                                    </Space>
                                </Space>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PopupExcel;
