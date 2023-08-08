import {useState} from "react";
import {Autocomplete} from "@react-google-maps/api";
import notice from "../../Utils/Notice.js";

function AddressInput2(props) {
    const [searchResult, setSearchResult] = useState("Result: none");

    function onLoad(autocomplete) {
        if (autocomplete) {
            setSearchResult(autocomplete);
        }
    }

    async function onPlaceChanged() {
        if (searchResult != null) {
            const place = searchResult.getPlace();
            const name = place.name;
            const status = place.business_status;
            const formattedAddress = place.formatted_address;
            if(place.geometry === undefined) {
                return;
            }
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            console.log(place);
            console.log(`Name: ${name}`);
            console.log(`Business Status: ${status}`);
            console.log(`Formatted Address: ${formattedAddress}`);
            console.log(`Latitude: ${lat}`);
            console.log(`Longitude: ${lng}`);
            if (typeof props.onFromAddressChanged === "function") {
                await props.onFromAddressChanged(lat, lng, formattedAddress);
            }
        } else {
            notice.err("Không bỏ trống trường này");
        }
    }

    return (
        <div className="App">
            <div className="searchColumn">
                <Autocomplete
                    className="Autocomplete"
                    onPlaceChanged={onPlaceChanged}
                    onLoad={onLoad}
                    options={{componentRestrictions: {country: "vn"}, strictBounds: true}}>
                    <input
                        type="text"
                        placeholder="Chọn vị trí"
                        style={{
                            boxSizing: `border-box`,
                            width: `240px`,
                            height: `32px`,
                            padding: `4px 12px`,
                            borderRadius: `6px`,
                            border: `1px #d9d9d9 solid`,
                            fontSize: `14px`,
                            outline: `none`,
                            textOverflow: `ellipses`
                        }}
                    />
                </Autocomplete>
            </div>
        </div>
    );
}

export default AddressInput2;
