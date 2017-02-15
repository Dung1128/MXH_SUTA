import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
export default class NewFeed extends Component{
  constructor(props){
    super(props);
    this.state = ({

    });
  }

  render(){
    return(
      <View style={Style.toolbar}>
        <TouchableOpacity style={{flex:1,alignItems:'center'}}>
          <Icon name="md-notifications" size={24} color="#F5F5F5" style={Style.ico}/>
        </TouchableOpacity>
        <View style={{flex:5,alignItems:'center'}}>
          <Text style={Style.title}>
            NHẬT KÝ
          </Text>
        </View>

        <TouchableOpacity style={{flex:1,alignItems:'center'}}>
          <Icon name="md-create" size={24} color="#F5F5F5" style={Style.ico}/>
        </TouchableOpacity>
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
