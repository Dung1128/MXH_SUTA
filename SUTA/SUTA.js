import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator
} from 'react-native';

import Style from './src/Style.js';
import Login from './components/loginView.js';

class SUTA extends Component {
  renderScene(route, navigator){
    if(route.name == 'login'){
      return <Login navigator = {navigator}/>
    }
  }

  render(){
    return(
      <View style={style.container}>
        <Navigator
          initialRoute={{name: 'login'}}
          renderScene={this.renderScene.bind(this)}
        />
      </View>
    );
  }
}
var style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
})

module.exports = SUTA;
