import {useState} from "react";
import notice from "../../../../Utils/Notice.js";
import service from "../../../../API/Service.js";
import {useRecoilState} from "recoil";
import {adminState, driverState, pageIndexState, pageSizeState, usernameState, userState} from "./recoil.js";
import {Input} from "antd";

const HandleUser = () => {
    const { Search } = Input;
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useRecoilState(usernameState);
    const [pageIndex, setPageIndex] = useRecoilState(pageIndexState);
    const [pageSize, setPageSize] = useRecoilState(pageSizeState);
    const [user, setUser] = useRecoilState(userState);
    const [driver, setDriver] = useRecoilState(driverState);
    const [admin, setAdmin] = useRecoilState(adminState);

    const handleSearchClick = (event) => {
        setIsLoading(true);
        service.getUserInfo(event, pageIndex, pageSize).then(data => {
            let listUser = [];
            let listDriver = [];
            let listAdmin = [];

            data.forEach(dataSearch => {
                const role = dataSearch.authorities;
                if (role && role.length > 0) {
                    let isAdmin = false;
                    let isDriver = false;
                    role.forEach(dataRole => {
                        if (dataRole.role === "ROLE_ADMIN") {
                            listAdmin.push(dataSearch);
                            isAdmin = true;
                        } else if (dataRole.role === "ROLE_DRIVER") {
                            listDriver.push(dataSearch);
                            isDriver = true;
                        }
                    });

                    if (!isAdmin && !isDriver) {
                        listUser.push(dataSearch);
                    }
                }
            });

            setUser(listUser);
            setAdmin(listAdmin);
            setDriver(listDriver);
            setIsLoading(false)
        });
    };

    return (
        <>
            <div style={{width:"100%"}}>
                {isLoading ?
                    <Search placeholder="Nhập username cần tìm kiếm" enterButton="Search" size="large" loading/>
                    :
                    <Search placeholder="Nhập username cần tìm kiếm" enterButton="Search" size="large" onSearch={handleSearchClick}/>
                }
            </div>
        </>
    )
}

export default HandleUser