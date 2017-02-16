import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Anonymous from './anonymousView.js';
import Public from './publicView.js';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
export default class Menu extends Component{
  constructor(props){
    super(props);
    this.state = ({

    });
  }

  render(){
    return(
      <View style={{flex:1}}>

      <View style={Style.toolbar}>
        <View style={{flex:1,alignItems:'center'}}>
          <Text style={Style.title}>
            MENU
          </Text>
        </View>

      </View>
      </View>
    );
  }
}
var Style = StyleSheet.create({
  title: {
    color:'white',
    fontSize: 16,
  },
  toolbar: {
    height:45,
    width: null,
    backgroundColor: "#8e44ad",
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'space-between',
  },
});
