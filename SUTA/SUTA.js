import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Style from './src/Style.js';
import Login from './components/loginView.js';
import Register from './components/registerView.js';
import Profile from './components/profileView.js';
import Home from './components/homeView.js';
class SUTA extends Component {
  renderScene(route, navigator){
    if(route.name == 'home'){
      return <Home navigator = {navigator} {...route.passProps}/>
    }
    if(route.name == 'login'){
      return <Login navigator = {navigator} {...route.passProps}/>
    }
    if(route.name == 'register'){
      return <Profile navigator = {navigator} {...route.passProps}/>
    }

  }

  render() {
    return (
      <View style={style.container}>
        <Navigator
          initialRoute={{name:'login'}}
          renderScene={this.renderScene.bind(this)}
        />
      </View>
    );
  }
}


module.exports = SUTA;
