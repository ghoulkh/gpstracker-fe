import {Map, Marker, InfoWindow, GoogleApiWrapper, Polyline} from 'google-maps-react';
import {useEffect, useState} from "react";
import {API_KEY} from "../../Const/ActionType.js";
import PropTypes from "prop-types";
import iconMaker from '../../Image/icon-marker.png';
import iconOrder from '../../Image/iconOrder.png';
import iconOffice from '../../Image/icon-office.png';
import notice from "../../Utils/Notice.js";


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
    const [markerStart, setMarkerStart] = useState([]);
    const [deliveryInfo, setDeliveryInfo] = useState({});
    const [officeInfo, setOfficeInfo] = useState({});
    const [isMarkerStart, setIsmarkerStart] = useState(false);
    const [addressOffice, setAddressOffice] = useState("");

    useEffect(() => {
        setMarkers(props.markers)
    }, [props.markers])

    useEffect(() => {
        console.log(props.markerStart)
        setMarkerStart(props.markerStart)
    }, [props.markerStart])

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
        }).catch(() => {
            notice.inf("Không có kết quả nào phù hợp");
            setPath([])
        });
    };


    const onMarkerClick = (props, marker) => {
        setActiveMarker(marker);
        setShowingInfoWindow(true);
        setCurrentLocation(props.position);
        setCarInfo(marker.carInfo);
        setDeliveryInfo(marker.deliveryInfo);
        setIsmarkerStart(marker.isMarkerStart);
        setOfficeInfo(marker.officeInfo);
    };

    const handleMarkerClick = () => {
        setShowingInfoWindow(false)
    };

    const positionMarkerStart = () => {
        if (markerStart.length > 0) {
            console.log(markerStart)
            const pointStart = markerStart[0];
            const position = {lat: pointStart.lat, lng: pointStart.lon};
            return (
                <Marker
                    isMarkerStart={true}
                    position={position}
                    deliveryInfo={pointStart}
                    onClick={onMarkerClick}
                    onClose={handleMarkerClick}
                    icon={iconMaker}
                />
            )
        }
    }

    useEffect(() => {
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${21.0072824},${105.8426416}&key=${API_KEY}`, {
            method: 'GET',
        }).then(response => response.json()).then(data => {
            if (data.results.length > 0) {
                setAddressOffice(data.results[0].formatted_address);
            } else {
                notice.inf("Vui lòng chọn chia sẻ vị trí.");
            }
        }).catch(() => {
            notice.inf("Vui lòng chọn chia sẻ vị trí.")
        })
    }, []);

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
                            {positionMarkerStart()}
                            <Marker
                                position={{lat: 21.0072824, lng: 105.8426416}}
                                officeInfo={{
                                    info: addressOffice,
                                    lat: 21.0072824,
                                    lon: 105.8426416
                                }}
                                onClick={onMarkerClick}
                                onClose={handleMarkerClick}
                                icon={iconOffice}
                            />
                            {markerStart && markerStart.map((data, index) => {
                                if (data) {
                                    const position = {lat: data.toLat, lng: data.toLon};
                                    return (
                                        <Marker
                                            key={index}
                                            position={position}
                                            deliveryInfo={data}
                                            onClick={onMarkerClick}
                                            onClose={handleMarkerClick}
                                            icon={iconOrder}
                                        />
                                    )
                                }
                            })
                            }
                            {markers && markers.map((data, index) => {
                                if (data) {
                                    const position = {lat: data.lat, lng: data.lon};
                                    return (
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
                                {carInfo &&
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
                                }
                                {deliveryInfo && !isMarkerStart &&
                                    <div className="map-info-in">
                                        <div>
                                            Mã vận đơn: {deliveryInfo.id}
                                        </div>
                                        <div>
                                            Người nhận: {deliveryInfo.fullNameReceiver}
                                        </div>
                                        <div>
                                            Liên hệ: {deliveryInfo.emailReceiver}
                                        </div>
                                        <div>
                                            Địa chỉ: {deliveryInfo.toAddress}
                                        </div>
                                        <div>
                                            Trạng thái: {deliveryInfo.deliveryStatus}
                                        </div>
                                    </div>
                                }
                                {deliveryInfo && isMarkerStart &&
                                    <div className="map-info-in">
                                        <div>
                                            RFID: {deliveryInfo.rfid}
                                        </div>
                                        <div>
                                            Tốc độ: {deliveryInfo.speed}
                                        </div>
                                        <div>
                                            Vĩ độ: {deliveryInfo.lat}
                                        </div>
                                        <div>
                                            Kinh độ: {deliveryInfo.lon}
                                        </div>
                                    </div>
                                }
                                {officeInfo &&
                                    <div className="map-info-in">
                                        <div>
                                            Địa chỉ chi nhánh: {officeInfo.info}
                                        </div>
                                        <div>
                                            Vĩ độ: {officeInfo.lat}
                                        </div>
                                        <div>
                                            Kinh độ: {officeInfo.lon}
                                        </div>
                                    </div>
                                }
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