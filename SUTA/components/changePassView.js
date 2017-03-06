import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput
} from 'react-native';
import Iconn from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
import Hr from 'react-native-hr';
export default class accountManagerView extends Component{
  constructor(props){
    super(props);
  }
  onBack(routeName){
    this.props.navigator.pop({
      name: routeName,
      passProps: {

      }
    })
  }

  render(){
    return(
      <View style={{flex:1}}>
        <View style={styles._toolbar}>
          <TouchableOpacity onPress={this.onBack.bind(this)}>
            <Iconn name="md-arrow-back" size={34} color="#F5F5F5"/>
          </TouchableOpacity>
          <Text style={{fontSize:18, fontWeight:'bold', paddingLeft:15, paddingTop:3}}> Cập nhật mật khẩu
          </Text>
        </View>

        <View style={styles._content}>
          <View style={styles._inputChange}>
            <TextInput
            secureTextEntry
            underlineColorAndroid="#ffffff" placeholderTextColor= "#BDBDBD"
            style={{color:'#313231', paddingLeft:20}} placeholder='Mật khẩu đang dùng'/>
          </View>
          <View style={{marginTop:10}}>
          </View>
          <View style={styles._inputChange}>
            <TextInput
            secureTextEntry
            underlineColorAndroid="#ffffff" placeholderTextColor= "#BDBDBD"
            style={{color:'#313231',borderBottomWidth:0.5,borderBottomColor:'#dde9dc', paddingLeft:20}} placeholder='Mật khẩu mới'/>
          </View>
          <View style={styles._inputChange}>
            <TextInput
            secureTextEntry
            underlineColorAndroid="#ffffff" placeholderTextColor= "#BDBDBD"
            style={{color:'#313231', paddingLeft:20}} placeholder='Nhập lại mật khẩu'/>
          </View>

          <View style={{justifyContent:'center', paddingTop:20, alignItems:'center'}}>
            <TouchableOpacity style={styles._button}>
              <Text> CẬP NHẬT
              </Text>
            </TouchableOpacity>
          </View>

        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  _toolbar:{
    flex:1,
    backgroundColor:'yellow',
    paddingLeft:10,
    paddingTop: (deviceHeight/14)/4,
    flexDirection:'row'
  },
  _content:{
    flex:13,
    backgroundColor:'#dde9dc'
  },
  _inputChange:{
    backgroundColor:'#ffffff'
  },
  _button:{
    backgroundColor:'#80bcde',
    width:deviceWidth/2,
    height:40,
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 20
  }
})
