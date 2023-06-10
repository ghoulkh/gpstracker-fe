import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Component} from "react";
import {LoginNotFound} from "./Page/LoginNotFound.jsx";
import Header from "./Page/Header.jsx";
import Body from "./Page/Body.jsx";
import Footer from "./Page/Footer.jsx";
import Login from "./Page/Login.jsx";
import MapContainer from "./Page/MapContainer.jsx";

export default class HouseManagement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: !!JSON.parse(localStorage.getItem('USER')),
            loggedInUserObj: JSON.parse(localStorage.getItem('USER')) ? {username: JSON.parse(localStorage.getItem('USER'))['userInfo']} : {},
        }
        this.setLoggedInUser = this.setLoggedInUser.bind(this)
    }


    setLoggedInUser(loggedInUserObj) {
        this.setState({isLoggedIn: true, loggedInUserObj: {...loggedInUserObj}})
    }

    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <Routes>
                        <Route path="/"
                               element={
                                   <>
                                       <Header loggedInUserObj={this.state.loggedInUserObj}/>
                                       <Body/>
                                       <Footer/>
                                   </>
                               }>

                        </Route>
                        <Route>
                            <Route path="/location"
                                   element={
                                       <>
                                           <Header loggedInUserObj={this.state.loggedInUserObj}/>
                                           <MapContainer></MapContainer>
                                           <Footer/>
                                       </>

                                   }/>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </div>
        );
    }
}
