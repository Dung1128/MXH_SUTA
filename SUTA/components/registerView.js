'use strict'
import React, {Component} from 'react';
import{
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  TextInput,
  Dimensions,
  ScrollView,
  AsyncStorage,
}from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import TextField from 'react-native-md-textinput';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

class loginView extends Component{
  constructor(props){
    super(props);
    this.state=({
      warning_user: '',
      warning_phone:'',
      warning_pass: '',
      warning_repass: '',
    });
  }
  onBack(routeName,data){
    this.props.navigator.pop({
      name: routeName,
      passProps: {
      }
    })
  }

  redirect(routeName,data){
    this.props.navigator.replace({
      name: routeName,
      passProps: {
        data:data
      }
    })
  }

  async checkvalue(value){
    let formdata = new FormData();
    formdata.append("username", this.state.username);
    formdata.append("phone", this.state.phone);
    formdata.append("value", value);
    try {
      let response = await fetch('http://suta.esy.es/api/checkvalue.php',{
        method: 'post',
        headers: {
        'Content-Type': 'multipart/form-data',
        },
        body: formdata
      });
      let res = await response.text();
      var jsonResponse = JSON.parse(res);
      this.setState({
        code: jsonResponse['code'],
         message: jsonResponse['message'],

      });


      if (response.status >= 200
        && response.status < 300
        && jsonResponse['code']==0) {
          // show alert & moving screen
          //alert(this.state.message);
          if(value=='username')
          {
            this.setState({warning_user: ''});
          } if(value=='phone'){
             this.setState({warning_phone: ''})
          }

        //  console.log(this.state.message);
      } else {
          //Handle error

          if(value=='username')
          {
            this.setState({warning_user: this.state.message});
            console.log(this.state.message);
          } if(value=='phone'){
             this.setState({warning_phone: this.state.message});
             console.log(this.state.message);
          }
          let error = res;
          throw error;
      }
    }
    catch(error)
    {
      //console.log(error);
    }
  }
  checkpass(value){
    var password = this.state.password;
    if(value == 'password')
    {
      if(password.length < 6)
      {
        this.setState({warning_pass: 'Mật khẩu cần lớn hơn 6 ký tự'});
      }else {
        this.setState({warning_pass: ''});
      }
    }else {
      if(this.state.repassword != this.state.password)
      {
        this.setState({warning_repass: 'Bạn cần nhập lại đúng mật khẩu'});
      }else {
        this.setState({warning_repass: ''});
      }
    }

  }
  async onRegisterPressed(){
    if(this.state.warning_user=='' && this.state.warning_phone==''
      && this.state.warning_pass=='' && this.state.warning_repass=='')
    {
          let formdata = new FormData();
          formdata.append("username", this.state.username);
          formdata.append("password", this.state.password);
          formdata.append("phone", this.state.phone);
          try {
            let response = await fetch('http://suta.esy.es/api/register.php',{
              method: 'post',
              headers: {
              'Content-Type': 'multipart/form-data',
              },
              body: formdata
            });
            let res = await response.text();
            var jsonResponse = JSON.parse(res);
            this.setState({
              code: jsonResponse['code'],
               message: jsonResponse['message'],
               result: jsonResponse['result']

            });
            // alert(this.state.message);
            if (this.state.code==0) {
                // show alert & moving screen
               Alert.alert('Thông báo',this.state.message);
                this.redirect('login','OK');
            } else {
                //Handle error
                Alert.alert('Thông báo',this.state.message);
                let error = res;
                throw error;
            }
          }
          catch(error)
          {
          //  console.log(error);
          }


    }else {
      Alert.alert('Thông báo',"Bạn cần điền đúng thông tin.!");
    }


  }
  render(){
    return(
      <Image source={require('../images/bgr2.png')} style={styles.container}>
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.back} onPress={this.onBack.bind(this,'login')} >
          <Icon name="md-arrow-back" size={34} color="#F5F5F5"/>
        </TouchableOpacity>
      </View>
      <View style={styles.logo}>
        <Image
          style={{width: 145, height: 86}}
          source={require('../images/logo3.png')}
          />
      </View>

        <View style={styles.contentLogin}>
          <View style={{flex:2, flexDirection:'column'}}>
            <View style={{flexDirection:'row', justifyContent:'center',marginTop:-15}}>
              <View style={{flex:1,alignItems:'center'}}>
                <Icon name="md-contact" size={24} style={{marginTop:35}} color="#F5F5F5"/>
              </View>
              <View style={{flex:6,marginLeft:5}}>
              <TextInput
              underlineColorAndroid="#F5F5F5"
              placeholderTextColor= "#BDBDBD"
              onEndEditing={()=>{this.checkvalue('username')}}
              onChangeText={(val) => this.setState({username: val})}
              style={{color:'#F5F5F5', marginTop:10}}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              placeholder='Tên Tài Khoản'/>
                <Text style={{color:'#F5F5F5', fontSize:10}}>
                  {this.state.warning_user}
                </Text>
              </View>
            </View>

            <View style={{flexDirection:'row', justifyContent:'center',marginTop:-15}}>
              <View style={{flex:1,alignItems:'center'}}>
                <Icon name="md-call" size={24} color="#F5F5F5" style={{marginTop:35}}/>
              </View>
              <View style={{flex:6,marginLeft:5}}>
              <TextInput
              underlineColorAndroid="#F5F5F5"
              placeholderTextColor= "#BDBDBD"
              onEndEditing={()=>{this.checkvalue('phone')}}
              onChangeText={(val) => this.setState({phone: val})}
              style={{color:'#F5F5F5', marginTop:10}}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              placeholder='Số Điện Thoại'/>

              <Text style={{color:'#F5F5F5', fontSize:10}}>
                {this.state.warning_phone}
              </Text>
              </View>

            </View>

            <View style={{flexDirection:'row', justifyContent:'center',marginTop:-15}}>
              <View style={{flex:1,alignItems:'center'}}>
                <Icon name="md-key" size={24} color="#F5F5F5" style={{marginTop:35}} />
              </View>
              <View style={{flex:6, marginLeft:5}}>
                <TextInput
                secureTextEntry
                underlineColorAndroid="#F5F5F5"
                placeholderTextColor= "#BDBDBD"
                onEndEditing={()=>{this.checkpass('password')}}
                onChangeText={(val) => this.setState({password: val})}
                style={{color:'#F5F5F5', marginTop:10}}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                placeholder='Mật Khẩu'/>
                <Text style={{color:'#F5F5F5', fontSize:10}}>
                  {this.state.warning_pass}
                </Text>
              </View>

            </View>

            <View style={{flexDirection:'row', justifyContent:'center',marginTop:-15}}>
              <View style={{flex:1,alignItems:'center'}}>
                <Icon name="md-key" size={24} color="#F5F5F5" style={{marginTop:35}} />
              </View>
              <View style={{flex:6, marginLeft:5}}>
                <TextInput
                secureTextEntry
                underlineColorAndroid="#F5F5F5"
                placeholderTextColor= "#BDBDBD"
                onEndEditing={()=>{this.checkpass('repassword')}}
                onChangeText={(val) => this.setState({repassword: val})}
                style={{color:'#F5F5F5', marginTop:10}}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                placeholder='Nhập Lại Mật Khẩu'/>
                <Text style={{color:'#F5F5F5', fontSize:10}}>
                  {this.state.warning_repass}
                </Text>
              </View>

            </View>

          </View>
          <View style={{flex:1, alignItems:'center'}}>
            <TouchableOpacity onPress={()=>this.onRegisterPressed()} style={styles.button}>
              <Text style={{color:'#F5F5F5'}}>ĐĂNG KÝ</Text>
            </TouchableOpacity>
            </View>

        </View>

      </Image>
    );
  }

}
// loginView.propType = {
//   data: React.PropTypes.arrayOf(React.PropTypes.object)
// }
const styles = StyleSheet.create({
  container:{
    flex: 1,
    padding:10,
    width:deviceWidth
  },
  logo:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  contentLogin:{
    flex:2,
  },
  button: {
      marginTop:10,
      width:deviceWidth/2,
      borderColor: '#F5F5F5',
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius:20,
      borderWidth:1
    },
});
module.exports = loginView;
