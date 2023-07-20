import {Map, Marker, InfoWindow, GoogleApiWrapper, Polyline} from 'google-maps-react';
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
        locations: PropTypes.array,
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
    const [path, setPath] = useState([]);

    useEffect(() => {
        setMarkers(props.markers)
    }, [props.markers])

    useEffect(() => {
        if (props.locations.length > 1) {
            const locations = props.locations.map(point => ({
                lat: point.lat,
                lon: point.lon
            }));
            getPathCoordinates(locations);
        }
    }, [props.locations]);

    const getPathCoordinates = (locations) => {
        console.log(locations)
        const directionsService = new props.google.maps.DirectionsService();

        if (locations.length < 2) {
            // Không đủ số điểm để vẽ đoạn đường
            return;
        }

        const waypoints = locations.slice(1, locations.length - 1).map((location) => ({
            location: `${location.lat},${location.lon}`
        }));

        const origin = `${locations[0].lat},${locations[0].lon}`;
        const destination = `${locations[locations.length - 1].lat},${locations[locations.length - 1].lon}`;

        const request = {
            origin,
            destination,
            waypoints,
            optimizeWaypoints: true,
            travelMode: props.google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, (result, status) => {
            if (status === props.google.maps.DirectionsStatus.OK) {
                const pathCoordinates = result.routes[0].overview_path.map((point) => ({
                    lat: point.lat(),
                    lng: point.lng()
                }));
                setPath(pathCoordinates);
            }
        });
    };


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
                            {props.locations && props.locations.length > 1 &&
                                <Polyline
                                    path={path}
                                    strokeColor="#0000FF"
                                    strokeOpacity={1.0}
                                    strokeWeight={5}
                                    fillColor="#0000FF"
                                    fillOpacity={1.0}
                                />
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
                                    <div>
                                        Vĩ độ: {carInfo.lat}
                                    </div>
                                    <div>
                                        Kinh độ: {carInfo.lon}
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