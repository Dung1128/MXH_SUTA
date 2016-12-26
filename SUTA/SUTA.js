import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Style from './src/Style.js';

class SUTA extends Component {
  render() {
    return (
      <View style={Style.container}>
        <Text style={Style.welcome}>
          ĐỒ ÁN
        </Text>
        <Text style={Style.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={Style.instructions}>
          Hello
        </Text>
      </View>
    );
  }
}


module.exports = SUTA;
