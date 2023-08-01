import {useEffect, useState} from "react";
import service from "../../../API/Service.js";

const ManageUser = () => {
    const [username, setUsername] = useState("");
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [user, setUser] = useState([]);
    const [driver, setDriver] = useState([]);
    const [admin, setAdmin] = useState([]);

    useEffect(() => {
        service.getUserInfo(username, pageIndex, pageSize).then(data => {
            const listUser = []
            const listDriver = []
            const listAdmin = []
            data.map(dataSearch => {
                const role = dataSearch.authorities;
                role && role.length > 0 && role.map(dataRole => {
                    if (dataRole.role === "ROLE_ADMIN") {
                        listAdmin.push(dataSearch)
                        setAdmin(listAdmin);
                    } else if (dataRole.role === "ROLE_DRIVER") {
                        listDriver.push(dataSearch)
                        setDriver(listDriver);
                    } else if (dataRole.role === "ROLE_USER") {
                        listUser.push(dataSearch)
                        setUser(listUser);
                    }
                })
            })
        })
    }, [pageSize]);

    const User = () => {
        console.log(user)
        return (
            user.length > 0 && user.map((data, index) => {
                return (
                    <div key={index}>
                        <div>
                            Họ và tên: {data.fullName}
                        </div>
                    </div>
                )
            })
        )
    }

    const Driver = () => {
        return (
            driver.length > 0 && driver.map((data, index) => {
                console.log(data)
                return (
                    <div key={index}>
                        <div>
                            Họ và tên: {data.fullName}
                        </div>
                    </div>
                )
            })
        )
    }

    const Admin = () => {
        return (
            admin.length > 0 && admin.map((data, index) => {
                return (
                    <div key={index}>
                        <div>
                            Họ và tên: {data.fullName}
                        </div>
                    </div>
                )
            })
        )
    }

    return (
        <>
            <div>
                <User />
            </div>
            <div>
                <Driver />
            </div>
            <div>
                <Admin />
            </div>
        </>
    )
}

export default ManageUser