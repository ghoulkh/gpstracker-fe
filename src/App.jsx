import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Component, useState} from "react";
import Header from "./Page/Header.jsx";
import Body from "./Page/Body.jsx";
import Footer from "./Page/Footer.jsx";
import Manager from "./Page/AdminManage/Manager.jsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import SearchOrder from "./Page/Order/SearchOrder.jsx";
import auth from "./API/AuthService.js";
import {LoginNotFound} from "./Page/LoginNotFound.jsx";
import DriverManager from "./Page/UserManage/DriverManager.jsx";

export default class HouseManagement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: !!JSON.parse(localStorage.getItem('USER')),
            loggedInUserObj: JSON.parse(localStorage.getItem('USER')) ? {username: JSON.parse(localStorage.getItem('USER'))['userInfo']} : {},
            isAdmin: auth.checkAdmin()
        }
        this.setLoggedInUser = this.setLoggedInUser.bind(this)
    }


    setLoggedInUser(loggedInUserObj) {
        this.setState({isLoggedIn: true, loggedInUserObj: {...loggedInUserObj}})
    }

    render() {
        const role = this.state.isAdmin
        console.log(role)
        return (
            <div className="App">
                <BrowserRouter>
                    <Routes>
                        {this.state.isAdmin !== 'anonymous' ?
                            <Route path="/"
                                   element={
                                       <>
                                           <DriverManager loginProp={this.setLoggedInUser}
                                                          loggedInUserObj={this.state.loggedInUserObj}/>
                                       </>
                                   }/> :
                            <Route path="/"
                                   element={
                                       <>
                                           <Header loginProp={this.setLoggedInUser}
                                                   loggedInUserObj={this.state.loggedInUserObj}/>
                                           <Body/>
                                           <Footer/>
                                       </>
                                   }/>
                        }
                        <Route path="/"
                               element={
                                   <>
                                       <Header loginProp={this.setLoggedInUser}
                                               loggedInUserObj={this.state.loggedInUserObj}/>
                                       <Body/>
                                       <Footer/>
                                   </>
                               }/>
                        {this.state.isAdmin === 'anonymous' ?
                            <Route path="/checking/order"
                                   element={
                                       <>
                                           <Header loginProp={this.setLoggedInUser}
                                                   loggedInUserObj={this.state.loggedInUserObj}/>
                                           <SearchOrder/>
                                           <Footer/>
                                       </>

                                   }/> :
                            <Route path="/checking/order" element={<LoginNotFound/>}/>
                        }
                        {this.state.isAdmin === 'admin' ?
                            <Route path="/admin/manager"
                                   element={
                                       <>
                                           <Header loginProp={this.setLoggedInUser}
                                                   loggedInUserObj={this.state.loggedInUserObj}/>
                                           <Manager></Manager>
                                           <Footer/>
                                       </>

                                   }/> :
                            <Route path="/admin/manager" element={<LoginNotFound/>}/>
                        }
                    </Routes>
                </BrowserRouter>
                <ToastContainer/>
            </div>
        );
    }
}
