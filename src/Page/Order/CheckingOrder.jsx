import {VerticalTimeline, VerticalTimelineElement} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import "../../CSS/search-order.css"

const CheckingOrder = ({delivery}) => {
    return (
        <>
            {delivery.deliveryStatus &&
                <VerticalTimeline>
                    {(delivery.deliveryStatus === "NEW" || delivery.deliveryStatus === "IN_PROGRESS" || delivery.deliveryStatus === "COMPLETED") &&
                        <VerticalTimelineElement
                            className="vertical-timeline-element"
                            contentStyle={{background: '#ccc', color: '#fff'}}
                            contentArrowStyle={{borderRight: '7px solid #ccc'}}
                            iconStyle={{background: '#ccc', color: '#fff'}}
                            icon={<div className="custom-icon">A</div>}
                        >
                            <h3 className="vertical-timeline-element-title">Lên đơn</h3>
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
                            <h3 className="vertical-timeline-element-title">Vận chuyển</h3>
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
                            <h3 className="vertical-timeline-element-title">Hoàn thành</h3>
                        </VerticalTimelineElement>
                    }
                </VerticalTimeline>
            }
        </>
    );
};

export default CheckingOrder;
