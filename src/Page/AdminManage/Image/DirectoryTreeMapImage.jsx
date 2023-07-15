import CustomTreeView from "./CustomTreeView.jsx";
import {useEffect, useState} from "react";
import service from "../../../API/Service.js";

function DirectoryTreeMapImage(props) {
    const [dataFromAPI, setDataFromAPI] = useState([])
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        service.getImage().then(data => setDataFromAPI(data))
    }, []);

    const getLinkImage = (params) => {
        service.showImage(params).then((data) => {
            if (data) {
                const url = URL.createObjectURL(data);
                setImageUrl(url);
                props.setLinkImage(url)
                console.log(url)
            }
        })
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }

    return (
        <div style={{marginTop:"1rem"}}>
            <CustomTreeView data={dataFromAPI} getLinkImage={getLinkImage}/>
        </div>
    );
}

export default DirectoryTreeMapImage;