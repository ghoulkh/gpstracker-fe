import {Map, Marker, InfoWindow, GoogleApiWrapper} from 'google-maps-react';
import {useState} from "react";
import {API_KEY} from "../Const/ActionType.js";

function MapContainer(props) {
    const [showingInfoWindow, setShowingInfoWindow] = useState(false);
    const [activeMarker, setActiveMarker] = useState({});
    const [selectedPlace, setSelectedPlace] = useState({});
    const [markers, setMarkers] = useState([]);
    const [currentLocation, setCurrentLocation] = useState({
        lat: 21.0285,
        lng: 105.8542,
    });
    const [zoom, setZoom] = useState(13);

    const onMarkerClick = (props, marker) => {
        setSelectedPlace(props);
        setActiveMarker(marker);
        setShowingInfoWindow(true);
        setCurrentLocation(props.position);
    };

    const handleMarkerClick = () => {
        setShowingInfoWindow(false)
    };

    const displayMarkers = () => {
        return markers.map((marker, index) => {
            return (
                <Marker
                    key={index}
                    id={index}
                    image={marker.imagesUrl}
                    name={marker.title}
                    price={marker.price}
                    address={marker.address}
                    position={{
                        lat: marker.lat,
                        lng: marker.lnp,
                    }}
                    // icon={iconMaker}
                    onClick={onMarkerClick}
                    onClose={handleMarkerClick}
                />
            );
        });
    };
    console.log(currentLocation)
    console.log(zoom)
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
                            {displayMarkers}
                            <InfoWindow
                                marker={activeMarker}
                                visible={showingInfoWindow}
                                google="" map="">
                                <div className="map-info-in">
                                    Đã click vào đây
                                </div>
                            </InfoWindow>
                        </Map>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GoogleApiWrapper({
    apiKey: API_KEY,
})(MapContainer);