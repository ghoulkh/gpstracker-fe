import MapContainer from "./MapContainer.jsx";
import "../CSS/manager.css"
import {Component} from "react";
import Manage from "./AdminManage/Manage.jsx";
import TimeSlider from "./AdminManage/TimeSlider.jsx";
import DirectoryTreeMapImage from "./AdminManage/Image/DirectoryTreeMapImage.jsx";
import imageNotFound from "../Image/imageNotFound.png";

class Manager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: '',
            markers: [],
            linkImage: "",
            errorImageUrl: ""
        }
    }

    chooseMode = (event) => {
        this.setState({
            mode: event.target.value
        })
    }

    handleImageError = () => {
        this.setState({
            errorImageUrl: "error"
        })
    };

    setLinkImage = (link) => {
        this.setState({
            linkImage: link,
            errorImageUrl: ""
        })
        console.log(link)
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
                                <Manage setMarker={(marker) => this.setMarker(marker)}
                                        user={this.state.user}/>}
                            {this.state.mode === 'video' &&
                                <TimeSlider setMarker={(marker) => this.setMarker(marker)}/>}
                            {this.state.mode === 'image' &&
                                <DirectoryTreeMapImage setLinkImage={(url) => this.setLinkImage(url)}/>}

                        </div>
                    </div>
                    {this.state.mode === 'image' ?
                        <div style={{width:"100%"}}>
                            <div>
                                {this.state.linkImage ? (
                                    !this.state.errorImageUrl &&
                                    <img style={{ width: "100%" }} src={this.state.linkImage} onError={this.handleImageError} />
                                ) : (
                                    <img style={{ width: "100%" }} src={imageNotFound} onError={this.handleImageError} />
                                )}
                            </div>
                            <div>
                                {this.state.errorImageUrl && (
                                    <img style={{ width: "100%" }} src={imageNotFound} alt="Fallback Image" />
                                )}
                            </div>
                        </div> :
                        <MapContainer markers={this.state.markers}/>
                    }
                </div>
            </>
        )
    }


}

export default Manager;