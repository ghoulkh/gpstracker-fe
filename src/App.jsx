import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Component} from "react";
import Header from "./Page/Header.jsx";
import Body from "./Page/Body.jsx";
import Footer from "./Page/Footer.jsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import SearchOrder from "./Page/Order/SearchOrder.jsx";
import auth from "./API/AuthService.js";
import {LoginNotFound} from "./Page/LoginNotFound.jsx";
import MainManage from "./Page/Manage/MainManage.jsx";
import PositionLogDeliveryOrder from "./Page/Order/PositionLogDeliveryOrder.jsx";

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
                                           <MainManage loginProp={this.setLoggedInUser}
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
                        {this.state.isAdmin === 'anonymous' ?
                            <Route path="/restpassword"
                                   element={
                                       <>
                                           <Header loginProp={this.setLoggedInUser}
                                                   loggedInUserObj={this.state.loggedInUserObj}/>
                                           <Body/>
                                           <Footer/>
                                       </>

                                   }/> :
                            <Route path="/restpassword" element={<LoginNotFound/>}/>
                        }
                        {this.state.isAdmin === 'anonymous' ?
                            <Route path="/checking/order/log"
                                   element={
                                       <>
                                           <PositionLogDeliveryOrder/>
                                       </>

                                   }/> :
                            <Route path="/checking/order/" element={<LoginNotFound/>}/>
                        }
                    </Routes>
                </BrowserRouter>
                <ToastContainer/>
            </div>
        );
    }
}
