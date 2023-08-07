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
import {useRecoilState, useRecoilValue} from "recoil";
import {collapsedState, driverDeliveryTypeState} from "../recoil.js";
import NavigationMobileDriver from "../DriverManage/NavigationMobileDriver.jsx";
import ManageUser from "../AdminManage/Component/User/ManageUser.jsx";
import HandleUser from "../AdminManage/Component/User/HandleUser.jsx";
import {popupState} from "../AdminManage/Component/User/recoil.js";

const {Header, Sider} = Layout;

const MainManage = ({loggedInUserObj}) => {
    const [collapsed, setCollapsed] = useRecoilState(collapsedState);
    const deliveryType = useRecoilValue(driverDeliveryTypeState);
    const [markers, setMarkers] = useState([]);
    const [markerStart, setMarkerStart] = useState([]);
    const [locations, setLocations] = useState([]);
    const [mode, setMode] = useState('');
    const [linkImage, setLinkImage] = useState('');
    const [isPopupNavigation, setIsPopupNavigation] = useState(false);
    const [errorImageUrl, setErrorImageUrl] = useState('');
    const role = auth.checkAdmin();
    const [popup, setPopup] = useRecoilState(popupState);

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

    const handlePopupNavigation = (value) => {
        setIsPopupNavigation(value)
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
        <>
            <Layout style={{minHeight: '100vh'}}>
                <Sider width="35%" style={{background: '#EDEDED'}}
                       collapsible collapsed={collapsed}
                       className="sider-mobile-hidden"
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
                                        {value: 'user', label: 'Quản lý người dùng'},
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
                                {mode === 'user' &&
                                    <HandleUser
                                    />
                                }
                            </div>
                        </>
                    }
                    {role !== "admin" &&
                        <div>
                            <DriverManage setLocation={(location) => handleSetLocation(location)}
                                          setMarkerStart={(markerStart) => handleSetMarkerStart(markerStart)}
                            />
                        </div>
                    }
                </Sider>
                <Layout>
                    <Header className="header-user" style={{padding: 0, background: colorBgContainer}}>
                        <div className="sider-mobile-main">
                            <div className="sider-mobile-show">
                                {role !== "admin" &&
                                    <NavigationMobileDriver setPopupNavigation={handlePopupNavigation}/>
                                }
                            </div>
                            <UserLogin loggedInUserObj={loggedInUserObj}/>
                        </div>
                    </Header>
                    {mode === 'image' &&
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
                        </div>
                    }
                    {mode === 'user' &&
                        <div style={{width: "100%"}}>
                            <ManageUser/>
                        </div>
                    }
                    {(mode !== 'image' && mode !== 'user') &&
                        <MapContainer markerStart={markerStart} markers={markers} locations={locations}/>
                    }
                </Layout>
            </Layout>
            {role !== "admin" &&
                <div className="sider-mobile-show">
                    <div className={isPopupNavigation ? "login-click" : "none-click-login"}>
                        <div className="popup-navigation">
                            <div className="title-exit-nagative">
                                <div style={{fontWeight: 500}}>
                                    {deliveryType === "NEW" && "Các đơn hàng mới:"}
                                    {deliveryType === "INPROGRESS" && "Các đơn hàng đang trong quá trình vận chuyển:"}
                                    {deliveryType === "COMPLETED" && "Các đơn hàng đã hoàn thành:"}
                                    {deliveryType === "CANCELED" && "Các đơn hàng đã bị huỷ:"}
                                </div>
                                <div onClick={() => handlePopupNavigation(false)} className="title-exit-3">+</div>
                            </div>
                            <DriverManage setLocation={(location) => handleSetLocation(location)}
                                          isPopupNavigation={isPopupNavigation}
                                          setMarkerStart={(markerStart) => handleSetMarkerStart(markerStart)}
                            />
                        </div>
                    </div>
                </div>
            }
            {role !== "admin" &&
                <div className={popup ? "login-click" : "none-click-login"}>
                    <>
                        <div className="main-login">
                            <div className="body-popup-1">
                                <div className="title-popup">
                                    <div className="title-popup-1">Bạn đã lái xe 8 tiếng liên tục!</div>
                                    <div className="title-popup-1">Vui lòng nghỉ ngơi</div>
                                </div>
                                <div className="div-btn-popup" style={{justifyContent: "center"}}>
                                    <button onClick={() => setPopup(false)}
                                            className="btn-popup">
                                        XÁC NHẬN
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                </div>}
        </>

    );
};

export default MainManage;
