import MapContainer from "./MapContainer.jsx";
import "../CSS/manager.css"
import {Component} from "react";
import config from "../API/Config.js";
import SockJS from "sockjs-client/dist/sockjs"
import Stomp from 'stompjs';

class Manager extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const socket = new SockJS(config.WS);
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, () => {
            console.log('WebSocket connection opened');

            // Đăng ký lắng nghe sự kiện từ /post/49
            stompClient.subscribe('/rfid/' + "DCEDD4E0", message => {
                console.log('Received message:', message.body);
                // Xử lý dữ liệu nhận được từ server và cập nhật trong ứng dụng của bạn
            });
        });
    }

    render() {
        return (
            <>
                <div className="main-manager">
                    <div className="info-manager">

                    </div>
                    <div className="map-manager">
                        <MapContainer/>
                    </div>
                </div>
            </>
        )
    }


}

export default Manager;