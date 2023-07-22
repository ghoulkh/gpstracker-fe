import {VerticalTimeline, VerticalTimelineElement} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import "../../CSS/search-order.css"
import {format} from 'date-fns';

const CheckingOrder = ({delivery}) => {
    return (
        <>
            {delivery.deliveryStatus &&
                <VerticalTimeline>
                    {(delivery.deliveryStatus === "NEW" || delivery.deliveryStatus === "IN_PROGRESS" || delivery.deliveryStatus === "COMPLETED") &&
                        <VerticalTimelineElement
                            className="vertical-timeline-element"
                            contentStyle={{background: '#008080', color: '#fff'}}
                            contentArrowStyle={{borderRight: '7px solid #ccc'}}
                            iconStyle={{background: '#008080', color: '#fff'}}
                            icon={<div className="custom-icon">A</div>}
                        >
                            <h3 className="vertical-timeline-element-title">Lên đơn của: {delivery.senderFullName}
                            <br /> Vào lúc: {format(delivery.statusHistories[0].createdAt,'HH:mm\' \'dd-MM-yyyy')}</h3>
                        </VerticalTimelineElement>
                    }
                    {(delivery.deliveryStatus === "IN_PROGRESS" || delivery.deliveryStatus === "COMPLETED") &&
                        <VerticalTimelineElement
                            className="vertical-timeline-element"
                            contentStyle={{background: '#ff9800', color: '#fff'}}
                            contentArrowStyle={{borderRight: '7px solid #ff9800'}}
                            iconStyle={{background: '#ff9800', color: '#fff'}}
                            icon={<div className="custom-icon">P</div>}
                        >
                            <div className="timeline-content">
                            <h3 className="vertical-timeline-element-title">Vận chuyển bởi Driver: {delivery.driverUsername}</h3>
                             {/* Button để chuyển trang */}
                            <button className="vertical-timeline-element-title" onClick={handleButtonClick}>Xem vị trí tài xế</button>
                            </div>
                            
                        </VerticalTimelineElement>
                    }
                    {(delivery.deliveryStatus === "COMPLETED") &&
                        <VerticalTimelineElement
                            className="vertical-timeline-element"
                            contentStyle={{background: '#4caf50', color: '#fff'}}
                            contentArrowStyle={{borderRight: '7px solid #4caf50'}}
                            iconStyle={{background: '#4caf50', color: '#fff'}}
                            icon={<div className="custom-icon">S</div>}
                        >
                            <h3 className="vertical-timeline-element-title">Giao thành công đến: {delivery.fullNameReceiver}
                            <br />Vào lúc: {format(delivery.statusHistories[2].createdAt,'HH:mm\' \'dd-MM-yyyy')} </h3>
                        </VerticalTimelineElement>
                    }
                </VerticalTimeline>
            }
        </>
    );
};


// Function để xử lý việc chuyển trang khi ấn vào button
function handleButtonClick() {
    // Thực hiện hành động chuyển trang tại đây, ví dụ:
    window.location.href = 'https://example.com/'; // Thay đổi URL chuyển đến trang mới
  }

export default CheckingOrder;
