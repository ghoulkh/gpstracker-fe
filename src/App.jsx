import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Component} from "react";
import Header from "./Page/Header.jsx";
import Body from "./Page/Body.jsx";
import Footer from "./Page/Footer.jsx";
import Manager from "./Page/Manager.jsx";

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
        console.log(this.state.loggedInUserObj)
        return (
            <div className="App">
                <BrowserRouter>
                    <Routes>
                        <Route path="/"
                               element={
                                   <>
                                       <Header loginProp={this.setLoggedInUser}
                                               loggedInUserObj={this.state.loggedInUserObj}/>
                                       <Body/>
                                       <Footer/>
                                   </>
                               }>

                        </Route>
                        <Route>
                            <Route path="/location"
                                   element={
                                       <>
                                           <Header loginProp={this.setLoggedInUser}
                                                   loggedInUserObj={this.state.loggedInUserObj}/>
                                           <Manager></Manager>
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
