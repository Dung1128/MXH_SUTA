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
  KeyboardAvoidingView
}from 'react-native';
import TextField from 'react-native-md-textinput';
import Hr from 'react-native-hr';
import SplashScreen from './splashScreen.js';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
import Icon from 'react-native-vector-icons/Ionicons';

class loginView extends Component{
  constructor(props){
    super(props);
    this.state=({
      warning_user: '',
      warning_pass: '',
    });
  }
  redirect(routeName,data){
    this.props.navigator.push({
      name: routeName,
      passProps: {
      }
    })
  }

  navigate(routeName,data){
    this.props.navigator.push({
      name: routeName,
      passProps: {
      }
    })
  }

  async onLoginPressed(){
    let formdata = new FormData();
    formdata.append("username", this.state.username);
    formdata.append("password", this.state.password);
    try {
      let response = await fetch('http://suta.esy.es/api/login.php', {
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
        result: jsonResponse['result'],

      });

      if (response.status >= 200 && response.status < 300 && jsonResponse['code']==0) {
          //Handle success
          //On success we will store the access_token in the AsyncStorage
          this.redirect('home');

      }else {
          Alert.alert('Thông báo',this.state.message);
      }
    } catch(error) {
        //console.log("error " + error);
      //  console.log(this.state.username + " & " + this.state.password);

    }
  }
  render(){
    return(
      <SplashScreen duration={3000} backgroundColor={'blue'}>


      <Image source={require('../images/bgr2.png')} style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={{flex:1}}>
        <View style={styles.logo}>
          <Image
            style={{width: 145, height: 86}}
            source={require('../images/logo3.png')}
            />
        </View>
        <View style={styles.contentLogin}>
          <View>
            <View style={{flexDirection:'row', justifyContent:'center',marginTop:-15}}>
              <View style={{flex:1,alignItems:'center'}}>
                <Icon name="md-contact" size={24} style={{marginTop:35}} color="#F5F5F5"/>
              </View>
              <View style={{flex:6,marginLeft:5}}>
              <TextInput
              underlineColorAndroid="#F5F5F5"
              placeholderTextColor= 'rgba(255,255,255,0.7)'
              onChangeText={(val) => this.setState({username: val})}
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={()=>this.passwordInput.focus()}
              placeholder='Tên Tài Khoản'/>

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
                placeholderTextColor= 'rgba(255,255,255,0.7)'
                onChangeText={(val) => this.setState({password: val})}
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                ref={(input)=>this.passwordInput = input}
                placeholder='Mật Khẩu'/>
              </View>
            </View>

          </View>
          <View style={{alignItems:'center'}}>
            <TouchableOpacity onPress={()=>this.onLoginPressed()} style={styles.button}>
              <Text style={{color:'#F5F5F5'}}>ĐĂNG NHẬP</Text>
            </TouchableOpacity>
          </View>

          <View style={{padding:20}}>
            <Hr lineColor='#BDBDBD' text='OR' textColor='#F5F5F5'/>
          </View>

          <TouchableOpacity>
            <View style={{flexDirection:'row', justifyContent:'center'}}>
                <Icon name="logo-facebook" size={22} color="#F5F5F5" style={{marginTop:-1}} />
                <Text style={{color:'#F5F5F5', fontWeight:'bold', paddingLeft:5}} >
                  Đăng nhập bằng Facebook
                </Text>
            </View>
          </TouchableOpacity>

        </View>

        <View style={{alignItems:'center'}}>
        <TouchableOpacity onPress={this.navigate.bind(this,'register')}>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <Text style={{color:'#F5F5F5'}}>
                  Bạn chưa có tài khoản?
            </Text>
            <Text style={{color:'#F5F5F5', fontWeight:'bold', paddingLeft:5}} >
              Đăng ký.
            </Text>
          </View>

          </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
      </Image>

      </SplashScreen>
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
  input: {
    height:40,
    backgroundColor:'rgba(255,255,255,0.2)',
    color:'#FFF',
    paddingHorizontal:10,
    marginTop:25,
  }
});
module.exports = loginView;
