import MapContainer from "../MapContainer.jsx";
import "../../CSS/manager.css"
import {Component} from "react";
import Manage from "./Component/Manage.jsx";
import TimeSlider from "./Component/TimeSlider.jsx";
import DirectoryTreeMapImage from "./Component/Image/DirectoryTreeMapImage.jsx";
import imageNotFound from "../../Image/imageNotFound.png";

class Manager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: '',
            markers: [],
            locations: [],
            linkImage: "",
            errorImageUrl: ""
        }
    }

    chooseMode = (event) => {
        this.setState({
            mode: event.target.value
        })
        if (event.target.value === 'none') {
            this.setState({
                mode: '',
                markers: [],
                locations: [],
                linkImage: "",
                errorImageUrl: ""
            })
        }
    }

    handleImageError = () => {
        this.setState({
            errorImageUrl: "error"
        })
    };

    setLocation = (locations) => {
        this.setState({
            locations: locations
        })
        console.log(locations)
    }

    setLinkImage = (link) => {
        this.setState({
            linkImage: link,
            errorImageUrl: ""
        })
        console.log(link)
    }

    setMarker = (markers) => {
        this.setState({
            markers: markers
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
                                    <option value="none" disable="true">Chọn...</option>
                                    <option value="manage">Giám sát</option>
                                    <option value="video">Xem lại hành trình</option>
                                    <option value="image">Hình ảnh</option>
                                </select>
                            </div>
                            {this.state.mode === 'manage' &&
                                <Manage setMarker={(marker) => this.setMarker(marker)}
                                        user={this.state.user}/>}
                            {this.state.mode === 'video' &&
                                <TimeSlider setLocation={(location) => this.setLocation(location)}
                                            setMarker={(marker) => this.setMarker(marker)}/>}
                            {this.state.mode === 'image' &&
                                <DirectoryTreeMapImage setLinkImage={(url) => this.setLinkImage(url)}/>}

                        </div>
                    </div>
                    {this.state.mode === 'image' ?
                        <div style={{width: "100%"}}>
                            <div>
                                {this.state.linkImage ? (
                                    !this.state.errorImageUrl &&
                                    <img style={{width: "100%"}} src={this.state.linkImage}
                                         onError={this.handleImageError}/>
                                ) : (
                                    <img style={{width: "100%"}} src={imageNotFound} onError={this.handleImageError}/>
                                )}
                            </div>
                            <div>
                                {this.state.errorImageUrl && (
                                    <img style={{width: "100%"}} src={imageNotFound} alt="Fallback Image"/>
                                )}
                            </div>
                        </div> :
                        <MapContainer markers={this.state.markers} locations={this.state.locations}/>
                    }
                </div>
            </>
        )
    }


}

export default Manager;