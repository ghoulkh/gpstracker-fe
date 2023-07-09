import MapContainer from "./MapContainer.jsx";
import "../CSS/manager.css"
import {Component} from "react";
import Manage from "./AdminManage/Manage.jsx";
import TimeSlider from "./AdminManage/TimeSlider.jsx";

class Manager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: '',
            markers: []
        }
    }

    chooseMode = (event) => {
        this.setState({
            mode: event.target.value
        })
    }

    setMarker = (markers) => {
        this.setState({
            markers:markers
        })
        console.log(markers)
    }

    componentDidMount() {

    }

    render() {
        return (
            <>
                <div className="main-manager">
                    <div className="info-manager">
                        <div className="info">
                            <div>
                                <select onChange={this.chooseMode} className="info-select">
                                    {/* eslint-disable-next-line react/no-unknown-property */}
                                    <option value="" disable="true">Chọn...</option>
                                    <option value="manage">Giám sát</option>
                                    <option value="video">Xem lại hành trình</option>
                                    <option value="image">Hình ảnh</option>
                                </select>
                            </div>
                            {this.state.mode === 'manage' &&
                                <Manage setMarker={(marker) => this.setMarker(marker)} user={this.state.user}/>}
                            {this.state.mode === 'video' &&
                                <TimeSlider/>}
                        </div>
                    </div>
                    <div className="map-manager">
                        <MapContainer markers={this.state.markers}/>
                    </div>
                </div>
            </>
        )
    }


}

export default Manager;