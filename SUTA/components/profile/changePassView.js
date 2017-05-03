import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import Iconn from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
import MyStatusBar from '../statusbar.js';
import Hr from 'react-native-hr';
export default class accountManagerView extends Component{
  constructor(props){
    super(props);
    this.state={
      data: this.props.data
    }
  }
  onBack(routeName){
    this.props.navigator.pop({
      name: routeName,
      passProps: {

      }
    })
  }
  clearText(fieldName) {
    this.refs[fieldName].setNativeProps({text: ''});
  }

  changePass(){
    this.clearText('password');
    this.clearText('newpassword');
    this.clearText('renewpassword');
    if(this.state.newpassword.length >=6){
      if(this.state.newpassword == this.state.renewpassword){
        let formdata = new FormData();
        formdata.append("id_user", this.state.data.id_user);
        formdata.append("password", this.state.password);
        formdata.append("newpassword", this.state.newpassword);

        fetch('http://suta.esy.es/api/changepass.php', {
            method: 'post',
            headers: {
            'Content-Type': 'multipart/form-data',
            },
            body: formdata

          })
          .then((response)=>response.json())
          .then((responseJson)=>{
            console.log('okok, changepass');
            if (responseJson['code']==0) {
              Alert.alert('Thông báo','Đổi mật khẩu thành công!');
            }
            else {
              Alert.alert('Thông báo','Mật khẩu hiện tại không chính xác!');
            }
          })
          .catch(error=>{
            console.log(error);
          });

      }
      else {
        alert('Mật khẩu không trùng!');
      }
    }
    else {
      alert('Mật khẩu phải lớn hơn 6 kí tự!');
    }


  }

  render(){
    //console.log(this.state.data);
    return(

      <View style={{flex:1}}>
      <MyStatusBar backgroundColor="#8e178f"/>
        <View style={styles._toolbar}>
          <TouchableOpacity onPress={this.onBack.bind(this)}>
            <Iconn name="md-arrow-back" size={34} color="#F5F5F5"/>
          </TouchableOpacity>
          <Text style={{fontSize:18, fontWeight:'bold', paddingLeft:15, paddingTop:3, color:'#fff'}}> Cập nhật mật khẩu
          </Text>
        </View>

        <View style={styles._content}>
        <KeyboardAvoidingView behavior="padding" style={{flex:1}}>
          <View style={styles._inputChange}>
            <TextInput
            secureTextEntry
            underlineColorAndroid="#ffffff" placeholderTextColor= "#BDBDBD"
            style={{color:'#313231', paddingLeft:20}} placeholder='Mật khẩu đang dùng'
            returnKeyType="next"
            ref={'password'}
            onChangeText={(val) => this.setState({password: val})}
            />
          </View>
          <View style={{marginTop:10}}>
          </View>
          <View style={styles._inputChange}>
            <TextInput
            secureTextEntry
            returnKeyType="next"
            underlineColorAndroid="#ffffff" placeholderTextColor= "#BDBDBD"
            onChangeText={(val) => this.setState({newpassword: val})}
            ref={'newpassword'}
            style={{color:'#313231',borderBottomWidth:0.5,borderBottomColor:'#dde9dc', paddingLeft:20}} placeholder='Mật khẩu mới'/>
          </View>
          <View style={styles._inputChange}>
            <TextInput
            secureTextEntry
            underlineColorAndroid="#ffffff" placeholderTextColor= "#BDBDBD"
            onChangeText={(val) => this.setState({renewpassword: val})}
            returnKeyType="done"
            ref={'renewpassword'}
            style={{color:'#313231', paddingLeft:20}} placeholder='Nhập lại mật khẩu'/>
          </View>

          <View style={{justifyContent:'center', paddingTop:20, alignItems:'center'}}>
            <TouchableOpacity style={styles._button} onPress={()=>this.changePass()}>
              <Text style={{color:'white'}}> CẬP NHẬT
              </Text>
            </TouchableOpacity>
          </View>
          </KeyboardAvoidingView>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  _toolbar:{
    flex:1,
    backgroundColor:'#8e44ad',
    paddingLeft:10,
    paddingTop: (deviceHeight/14)/4,
    flexDirection:'row'
  },
  _content:{
    flex:13,
    backgroundColor:'#F5F5F5'
  },
  _inputChange:{
    backgroundColor:'#ffffff'
  },
  _button:{
    backgroundColor:'#8e44ad',
    width:deviceWidth/2,
    height:40,
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 20
  }
})
