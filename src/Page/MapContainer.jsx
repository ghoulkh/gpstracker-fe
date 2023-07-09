import {Map, Marker, InfoWindow, GoogleApiWrapper} from 'google-maps-react';
import {useEffect, useState} from "react";
import {API_KEY} from "../Const/ActionType.js";
import PropTypes from "prop-types";
import iconMaker from '../Image/icon-marker.png';


// eslint-disable-next-line react-refresh/only-export-components
function MapContainer(props) {
    MapContainer.propTypes = {
        google: PropTypes.func,
        position: PropTypes.func,
        markers: PropTypes.array,
    };

    const [showingInfoWindow, setShowingInfoWindow] = useState(false);
    const [activeMarker, setActiveMarker] = useState({});
    const [carInfo, setCarInfo] = useState({});
    const [markers, setMarkers] = useState([]);
    const [currentLocation, setCurrentLocation] = useState({
        lat: 21.0285,
        lng: 105.8542,
    });
    const [zoom] = useState(13);

    useEffect(() => {
        setMarkers(props.markers)
    }, [props.markers])

    const onMarkerClick = (props, marker) => {
        setActiveMarker(marker);
        setShowingInfoWindow(true);
        setCurrentLocation(props.position);
        setCarInfo(marker.carInfo)
    };

    const handleMarkerClick = () => {
        setShowingInfoWindow(false)
    };

    return (
        <>
            <div className="map">
                <div className="map-main">
                    <div className="map-info">
                        <Map
                            google={props.google}
                            zoom={zoom}
                            initialCenter={currentLocation}
                            center={currentLocation}
                            onClick={(t, map, coord) => {
                                const {latLng} = coord;
                                latLng.lat();
                                latLng.lng();
                            }}>
                            {markers && markers.map((data, index) => {
                                if (data) {
                                    const position = { lat: data.lat, lng: data.lon };
                                    return(
                                        <Marker
                                            key={index}
                                            position={position}
                                            carInfo={data}
                                            onClick={onMarkerClick}
                                            onClose={handleMarkerClick}
                                            icon={iconMaker}
                                        />
                                    )
                                }
                            })
                            }
                            <InfoWindow
                                marker={activeMarker}
                                visible={showingInfoWindow}
                                google="" map={props.google}>
                                <div className="map-info-in">
                                    <div>
                                        RFID: {carInfo.rfid}
                                    </div>
                                    <div>
                                        Tốc độ: {carInfo.speed}
                                    </div>
                                </div>
                            </InfoWindow>
                        </Map>
                    </div>
                </div>
            </div>
        </>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export default GoogleApiWrapper({
    apiKey: API_KEY,
})(MapContainer);