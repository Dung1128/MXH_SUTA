import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import Iconn from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
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

  async changePass(){
    this.clearText('pass');
    this.clearText('newpass');
    this.clearText('renewpass');
    if(this.state.newpass.length >=6){
      if(this.state.newpass == this.state.renewpass){
        let formdata = new FormData();
        formdata.append("id_user", this.state.data.id_user);
        formdata.append("password", this.state.renewpass);
        try {
          let response = await fetch('http://suta.esy.es/api/changepass.php', {
            method: 'post',
            headers: {
            'Content-Type': 'multipart/form-data',
            },
            body: formdata

          });
          let res = await response.text(); //tra lai json
           var jsonResponse = JSON.parse(res);
          this.setState({
            code: jsonResponse['code'],
            message: jsonResponse['message'],
          });

          if (response.status >= 200 && response.status < 300 && jsonResponse['code']==0) {
            alert('Đổi mật khẩu thành công!');
          }
        } catch(error) {
            console.log("error " + error);
          //  console.log(this.state.username + " & " + this.state.password);

        }
      }
      else {
        alert('Mật khẩu không trùng!');
      }
    }
    else {
      alert('Mật khẩu phải lớn hơn 6 kí tự!');
    }


  }

  async checkPass(){
    let formdata = new FormData();
    formdata.append("id_user", this.state.data.id_user);
    formdata.append("password", this.state.password);
    try {
      let response = await fetch('http://suta.esy.es/api/checkchangepass.php', {
        method: 'post',
        headers: {
        'Content-Type': 'multipart/form-data',
        },
        body: formdata

      });
      let res = await response.text(); //tra lai json
       var jsonResponse = JSON.parse(res);
      this.setState({
        code: jsonResponse['code'],
        message: jsonResponse['message'],
      });

      if (response.status >= 200 && response.status < 300 && jsonResponse['code']==0) {

        alert('đúng');
      }
      else {
        alert('Mật khẩu không đúng!');
      }
    } catch(error) {
        console.log("error " + error);
      //  console.log(this.state.username + " & " + this.state.password);

    }
  }

  render(){
    //console.log(this.state.data);
    return(
      <View style={{flex:1}}>

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
            ref={'pass'}
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
            onChangeText={(val) => this.setState({newpass: val})}
            ref={'newpass'}
            style={{color:'#313231',borderBottomWidth:0.5,borderBottomColor:'#dde9dc', paddingLeft:20}} placeholder='Mật khẩu mới'/>
          </View>
          <View style={styles._inputChange}>
            <TextInput
            secureTextEntry
            underlineColorAndroid="#ffffff" placeholderTextColor= "#BDBDBD"
            onChangeText={(val) => this.setState({renewpass: val})}
            returnKeyType="done"
            ref={'renewpass'}
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
