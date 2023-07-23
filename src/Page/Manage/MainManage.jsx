import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Layout, Select, theme} from 'antd';
import "../../CSS/driver-manager.css";
import UserLogin from "../UserLogin.jsx";
import MapContainer from "../Map/MapContainer.jsx";
import Manage from "../AdminManage/Component/Manage.jsx";
import TimeSlider from "../AdminManage/Component/TimeSlider.jsx";
import DirectoryTreeMapImage from "../AdminManage/Component/Image/DirectoryTreeMapImage.jsx";
import imageNotFound from "../../Image/imageNotFound.png";
import auth from "../../API/AuthService.js";
import AdminOrder from "../AdminManage/Component/Order/AdminOrder.jsx";
import DriverManage from "../DriverManage/DriverManage.jsx";

const {Header, Sider} = Layout;

const MainManage = ({loggedInUserObj}) => {
    const [collapsed, setCollapsed] = useState(false);
    const [markers, setMarkers] = useState([]);
    const [markerStart, setMarkerStart] = useState([]);
    const [locations, setLocations] = useState([]);
    const [mode, setMode] = useState('');
    const [linkImage, setLinkImage] = useState('');
    const [errorImageUrl, setErrorImageUrl] = useState('');
    const role = auth.checkAdmin();

    const chooseMode = (value) => {
        setMode(value)
        if (value === 'none') {
            setMode('');
        }
        setLinkImage('');
        setErrorImageUrl('');
        setMarkers([]);
        setMarkerStart([]);
        setLocations([]);
    }

    const handleImageError = () => {
        setErrorImageUrl("error")
    };

    const handleSetLocation = (locations) => {
        setLocations(locations)
    }

    const handleSetLinkImage = (link) => {
        setLinkImage(link);
        setErrorImageUrl("");
    }

    const handleSetMarker = (markers) => {
        setMarkers(markers)
    }

    const handleSetMarkerStart = (markerStart) => {
        setMarkerStart(markerStart)
    }

    const {
        token: {colorBgContainer},
    } = theme.useToken();

    useEffect(() => {
        console.log(collapsed)
    }, [collapsed]);

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider width="30rem" style={{background: '#EDEDED'}} collapsible collapsed={collapsed}
                   onCollapse={(value) => setCollapsed(value)}>
                <Link to="/" className="user-logo-header">
                    <div className="logo-header-1">
                        <div className={!collapsed ? "HUST-header" : "HUST-header-v2"}>HUST</div>
                        {!collapsed && <div className="tracking-header">TRACKING</div>}
                    </div>
                </Link>
                {role === "admin" &&
                    <>
                        <div style={{padding: "0 1rem"}}>
                            <Select
                                defaultValue="none"
                                style={{width: "100%"}}
                                onChange={chooseMode}
                                allowClear
                                options={[
                                    {value: 'none', label: 'Chọn...', disabled: true},
                                    {value: 'manage', label: 'Giám sát'},
                                    {value: 'video', label: 'Xem lại hành trình'},
                                    {value: 'image', label: 'Hình ảnh'},
                                    {value: 'order', label: 'Lên đơn hàng'},
                                ]}
                            />
                        </div>
                        <div className="choose-menu-items">
                            {mode === 'manage' &&
                                <Manage setMarker={(marker) => handleSetMarker(marker)}/>}
                            {mode === 'video' &&
                                <TimeSlider setLocation={(location) => handleSetLocation(location)}
                                            setMarker={(marker) => handleSetMarker(marker)}/>}
                            {mode === 'image' &&
                                <DirectoryTreeMapImage setLinkImage={(url) => handleSetLinkImage(url)}/>}
                            {mode === 'order' &&
                                <AdminOrder setLocation={(location) => handleSetLocation(location)}
                                            setMarkerStart={(markerStart) => handleSetMarkerStart(markerStart)}
                                />
                            }
                        </div>
                    </>
                }
                {role !== "admin" &&
                    <DriverManage/>
                }
            </Sider>
            <Layout>
                <Header className="header-user" style={{padding: 0, background: colorBgContainer}}>
                    <UserLogin loggedInUserObj={loggedInUserObj}/>
                </Header>
                {mode === 'image' ?
                    <div style={{width: "100%"}}>
                        <div>
                            {linkImage ? (
                                !errorImageUrl &&
                                <img style={{width: "100%"}} src={linkImage}
                                     onError={handleImageError}/>
                            ) : (
                                <img style={{width: "100%"}} src={imageNotFound} onError={handleImageError}/>
                            )}
                        </div>
                        <div>
                            {errorImageUrl && (
                                <img style={{width: "100%"}} src={imageNotFound} alt="Fallback Image"/>
                            )}
                        </div>
                    </div> :
                    <MapContainer markerStart={markerStart} markers={markers} locations={locations}/>
                }
            </Layout>
        </Layout>
    );
};

export default MainManage;
