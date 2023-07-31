import background from "../Image/background.png";
import "../CSS/body.css"
import {Container} from "@mui/material";
import {useRef, useState} from "react";
import iconCanhBao from "../Image/icon-canhbao-enable.png"
import iconCanhBaoX from "../Image/icon-canhbao-disable.png"
import canhBao from "../Image/canhbao.png"
import iconHanhTrinh from "../Image/icon-hanhtrinh-enable.png"
import iconHanhTrinhX from "../Image/icon-hanhtrinh-disable.png"
import hanhTrinh from "../Image/hanhtrinh.png"
import iconViTri from "../Image/icon-vitri-enable.png"
import iconViTriX from "../Image/icon-vitri-disable.png"
import viTri from "../Image/vitri.png"
import iconVideoHanhAnh from "../Image/icon-videohinhanh-enable.png"
import iconVideoHanhAnhX from "../Image/icon-videohinhanh-disable.png"
import videoHinhAnh from "../Image/videohinhanh.png"


function Body() {
    const [item, setItem] = useState("vitri")

    const onClickItem = (value) => {
        setItem(value);
    }

    return (
        <>
            <div className="main-body">
                <div className="background-body">
                    <div className="div-image-background-body">
                        <img className="image-background-body"
                             src={background}
                             alt={background}/>
                    </div>
                    <div className="title-background-body">
                        <div className="title-background-body-1">
                            HỆ THỐNG QUẢN LÝ VÀ GIÁM SÁT PHƯƠNG TIỆN VẬN TẢI HUST-TRACKING
                        </div>
                        <div className="title-background-body-2">
                            Chỉ cần truy cập hệ thống từ các thiết bị có kết nối internet
                            để giám sát hành trình và quản lý những chiếc xe của bạn
                        </div>
                    </div>
                </div>
                <Container>
                    <div id="uses-body" className="uses-body">
                        <h2 className="h2-uses-body">
                            CHỨC NĂNG NỔI BẬT CỦA HUST-TRACKING
                        </h2>
                        <div className="div-btn-use-body">
                            <a onClick={() => onClickItem("vitri")}
                               className="icon-btn-use-body">
                                <img src={item === "vitri" ? iconViTri : iconViTriX} alt={iconViTri}/>
                                <div className={item === "vitri" ?  "text-icon-use-body-click" : "text-icon-use-body"}>
                                Giám sát vị trí
                                </div>
                            </a>
                            <a onClick={() => onClickItem("video")}
                               className="icon-btn-use-body">
                                <img src={item === "video" ? iconVideoHanhAnh : iconVideoHanhAnhX} alt={iconVideoHanhAnh}/>
                                <div className={item === "video" ?  "text-icon-use-body-click" : "text-icon-use-body"}>
                                Giám sát video & hình ảnh
                                </div>
                            </a>
                            <a onClick={() => onClickItem("hanhtrinh")}
                               className="icon-btn-use-body">
                                <img src={item === "hanhtrinh" ? iconHanhTrinh : iconHanhTrinhX} alt={iconHanhTrinh}/>
                                <div className={item === "hanhtrinh" ?  "text-icon-use-body-click" : "text-icon-use-body"}>
                                    Xem lại hành trình
                                </div>
                            </a>
                            <a onClick={() => onClickItem("canhbao")}
                               className="icon-btn-use-body">
                                <img src={item === "canhbao" ? iconCanhBao : iconCanhBaoX} alt={iconCanhBao}/>
                                <div className={item === "canhbao" ?  "text-icon-use-body-click" : "text-icon-use-body"}>
                                    Cảnh báo tức thời
                                </div>
                            </a>
                        </div>
                        {item === "vitri" &&
                            <div className="info-use-body">
                                <img src={viTri} alt={viTri}/>
                                <div className="text-info-use-body">
                                    <div className="title-info-use-body">Giám sát vị trí</div>
                                    <ul>
                                        <li>
                                            Vị trí hiện thời trên bản đồ số và trạng thái hoạt động tạm thời
                                        </li>
                                        <li>
                                            Vận tốc, số km đi được, trạng thái đóng mở cửa, tắt mở máy,
                                            thông tin xe, ...
                                        </li>
                                        <li>
                                            Lựa chọn lộ trình di chuyển ngắn nhất, tốn ít thời gian nhất ...
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        }
                        {item === "video" &&
                            <div className="info-use-body">
                                <img src={videoHinhAnh} alt={videoHinhAnh}/>
                                <div className="text-info-use-body">
                                    <div className="title-info-use-body">Giám sát hình ảnh & video</div>
                                    <ul>
                                        <li>
                                            Có thể xem cùng lúc nhiều ảnh của 1 xe trên màn hình
                                        </li>
                                        <li>
                                            Xem ảnh nhận diện gương mặt tài xế
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        }
                        {item === "hanhtrinh" &&
                            <div className="info-use-body">
                                <img src={hanhTrinh} alt={hanhTrinh}/>
                                <div className="text-info-use-body">
                                    <div className="title-info-use-body">Xem lại hành trình</div>
                                    <ul>
                                        <li>
                                            Xem lại hành trình của xe trong khoảng thời gian
                                            nhất định (thời điểm, trạng thái, vị trí)
                                        </li>
                                        <li>
                                            Vẽ lại hành trình trực quan trên bản đồ
                                            và xem với tốc độ xem đa dạng
                                        </li>
                                        <li>
                                            Tính tổng quảng đường, tổng số lần dừng, thời gian dừng
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        }
                        {item === "canhbao" &&
                            <div className="info-use-body">
                                <img src={canhBao} alt={canhBao}/>
                                <div className="text-info-use-body">
                                    <div className="title-info-use-body">Cảnh cáo tức thời</div>
                                    <ul>
                                        <li>
                                            Có thể cảnh báo các trường hợp như SOS,
                                            quá tốc độ, vi phạm thời gian lái xe liên tục,
                                            vi phạm thời gian làm việc…
                                        </li>
                                        <li>
                                            Có thể cấu hình các ngưỡng cảnh báo cho chủ phương tiện qua SMS, Email
                                        </li>
                                        <li>
                                            Thông báo thời tiết cho chủ xe
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        }
                    </div>
                </Container>

            </div>
        </>
    )
}

export default Body;