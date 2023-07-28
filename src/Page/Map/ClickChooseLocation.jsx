import {Component} from 'react';
import {Map, GoogleApiWrapper, Marker} from 'google-maps-react';
import {API_KEY} from "../../Const/ActionType";
import '../../CSS/map-style.css';
import iconOrder from "../../Image/iconOrder.png"

class ClickChooseLocation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            lat: "",
            lng: "",
            address: "",
            distance: "",
            isPopupOpen: false
        };
    }

    handleClick = (mapProps, map, clickEvent) => {
        const lat = clickEvent.latLng.lat();
        const lng = clickEvent.latLng.lng();
        console.log(lat)
        console.log(lng)
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                if (data.results.length > 0) {
                    this.setState({address: data.results[0].formatted_address});
                    this.props.handleClickLocation(lat, lng, data.results[0].formatted_address)
                }
            })
            .catch(error => {
                console.log(error);
            });
        this.setState({
            lat: lat,
            lng: lng,
        })
    }

    handleConfirm = () => {
        this.props.openMap(false);
    }

    handlePopupClose = () => {
        this.setState({isPopupOpen: false});
    };

    render() {
        const mapStyles = {
            width: '100%',
            height: '90%',
        };
        return (
            <div style={{width:"100%", height:"100%"}}>
                <Map
                    google={this.props.google}
                    zoom={12}
                    style={mapStyles}
                    initialCenter={{
                        lat: 21.0285,
                        lng: 105.8542,
                    }}
                    onClick={this.handleClick}
                >
                    <Marker
                        icon={iconOrder}
                        position={{lat: this.state.lat, lng: this.state.lng}}/>
                </Map>
                <div className="btn-confirm-location">
                    <div style={{height: "90%"}}>
                    </div>
                    <div className="btn-confirm-location-1">
                        {window.location.pathname.includes("/choose-location") ?
                            <button className="home" onClick={this.handleConfirm}>Tiếp tục</button> :
                            <button className="home" onClick={this.handleConfirm}>Xác nhận</button>
                        }
                    </div>
                </div>
            </div>

        );
    }
}

export default GoogleApiWrapper({
    apiKey: API_KEY
})(ClickChooseLocation);