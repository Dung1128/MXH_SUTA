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
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
export default class imageView extends Component{
  constructor(props){
    super(props);
    console.disableYellowBox = true;
  }

  render(){
    return(
      <View style={{flex:1}}>
          <Text style={Style.title}>
            IMG
          </Text>
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
