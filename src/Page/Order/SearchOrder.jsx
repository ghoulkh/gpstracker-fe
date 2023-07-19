import {Input} from 'antd';
import "../../CSS/search-order.css"
import {useEffect, useState} from "react";
import CheckingOrder from "./CheckingOrder.jsx";
import notice from "../../Utils/Notice.js";
import service from "../../API/Service.js";
import config from "../../API/Config.js";
import Stomp from "stompjs";
const SearchOrder = () => {
    const { Search } = Input;
    const [isLoading, setIsLoading] = useState(false);
    const [receiver, setReceiver] = useState("");
    const [id, setId] = useState("");
    const [delivery, setDelivery] = useState({});

    const handleSearchClick = (event) => {
        setIsLoading(true);
        console.log(!event);
        if (!event) {
            setIsLoading(false);
            notice.warn("Vui lòng nhập mã vận đơn")
            return;
        }
        if (event.split("/").length !== 2) {
            setIsLoading(false);
            notice.warn("Mã vận đơn không đúng định dạng");
            return;
        }
        const value = event.split("/");
        if (!value[0] || !value[1]) {
            setIsLoading(false);
            notice.warn("Mã vận đơn không đúng định dạng");
            return;
        }
        setId(value[0]);
        setReceiver(value[1]);
    };

    useEffect(() => {
        service.getOrder(id, receiver).then(data => {
            console.log(data);
            setDelivery(data);
            setIsLoading(false)
        })
    }, [id, receiver, isLoading])

    return (
        <>
            <div className="title-order">
                ĐỊNH VỊ ĐƠN HÀNG
            </div>
            <div className="order-main">
                <div className="order-main-2">
                    <div className="text-order">
                        Mã vận đơn (Có dạng: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/Email hoặc số điện thoại)
                    </div>
                    {isLoading ?
                        <Search placeholder="Nhập mã vận đơn (Eg: 345cf3dc-347f-4963-8983-59f701482304/1203ddp@gmail.com)" enterButton="Search" size="large" loading/>
                        :
                        <Search placeholder="Nhập mã vận đơn (Eg: 345cf3dc-347f-4963-8983-59f701482304/1203ddp@gmail.com)" enterButton="Search" size="large" onSearch={handleSearchClick}/>
                    }
                </div>
            </div>
            <CheckingOrder delivery={delivery}/>
        </>
    )
}

export default SearchOrder;