import "../CSS/body.css";
import introduction from "../Image/gioithieu.png";


function Footer() {
    return (
        <div id="introduction-body" className="introduction-body">
            <div className="title-background-body">
                <div className="title-background-body-1">
                    HỆ THỐNG QUẢN LÝ VÀ GIÁM SÁT PHƯƠNG TIỆN VẬN TẢI HUST-TRACKING
                </div>
                <div className="title-background-body-2 title-background-footer-2">
                    {/*Được phát triển bởi nhóm sinh viên:*/}
                    <ul>
                        {/*<li>Đoàn Hữu Hải</li>*/}
                    </ul>
                </div>
            </div>
            <div className="div-image-background-footer">
                <img className="image-background-body image-background-footer"
                     src={introduction}
                     alt={introduction}/>
            </div>
        </div>
    )
}

export default Footer;