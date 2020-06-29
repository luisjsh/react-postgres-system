import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'

import homepage from './page/homepage/homepage'
import Nav from './component/Navbar/navbar'
import LogIn from './page/login/login';
import profilePage from './page/profile/profilePage';
import Addpage from './page/add/add-page'
import signup from './page/sign-up/sign-up';
import itempage from './page/item/itempage';
import infocard from './page/info-card/info-card';
import Configuration from './page/configuration/configurationpage'
import ChangePassword from './component/change-password/changepassword';

export default class App extends Component {
    render(){
        return (
            <div>
                <Nav/>
                <Switch>
                    <Route exact path='/' component={homepage} />
                    <Route exact path='/login' component={LogIn}/>
                    <Route path='/profile' component={profilePage}/>
                    <Route path='/add-res' component={Addpage}/>
                    <Route exact path='/signup' component={signup}/>
                    <Route path='/item/:id' component={itempage}/>
                    <Route exact path='/infocard' component={infocard}/>
                    <Route exact path='/configuration' component={Configuration}/>
                    <Route exact path='/changepassword' component={ChangePassword}/>
                </Switch>
            </div>
            )
        }

};



