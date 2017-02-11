import React, {Component} from 'react';
import {
  View, Text,
  Dimensions,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,

} from 'react-native';
// import Style from 'Style.js';
export default class Chat extends Component {

  onBack(routeName){
    this.props.navigator.pop({
      name: routeName,
      passProps: {

      }
    })
  }

  navigate(routeName, data){
    this.props.navigator.push({
      name: routeName,
      passProps: {
        data: data
      }
    })
  }

  render(){
    return(
      <View>
        <Text>
         OK
        </Text>
      </View>
    )
  }
}
