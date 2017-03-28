import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator
} from 'react-native';
import Style from './src/Style.js';

import Home from './components/homeView.js';
import Login from './components/loginView.js';
import Register from './components/registerView.js';
import Profile from './components/profileView.js';
import AccountManagerView from './components/accountManagerView.js';
import ChangePass from './components/changePassView.js';
import ChangeProfile from './components/changeProfileView.js';

class SUTA extends Component {
  renderScene(route, navigator){
    if(route.name == 'home'){
      return <Home navigator = {navigator} {...route.passProps}/>
    }
    if(route.name == 'login'){
      return <Login navigator = {navigator} {...route.passProps}/>
    }
    if(route.name == 'register'){
      return <Register navigator = {navigator} {...route.passProps}/>
    }
    if(route.name == 'profile'){
      return <Profile navigator = {navigator} {...route.passProps}/>
    }
    if(route.name == 'accountManager'){
      return <AccountManagerView navigator = {navigator} {...route.passProps}/>
    }
    if(route.name == 'changepass'){
      return <ChangePass navigator = {navigator} {...route.passProps}/>
    }
    if(route.name == 'changeprofile'){
      return <ChangeProfile navigator = {navigator} {...route.passProps}/>
    }
  }

  render() {
    return (
      <View style={Style.container}>
        <Navigator
          initialRoute={{name:'login'}}
          renderScene={this.renderScene.bind(this)}
        />
      </View>

    );
  }
}

module.exports = SUTA;
