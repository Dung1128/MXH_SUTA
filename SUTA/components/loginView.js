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
  KeyboardAvoidingView,
  Keyboard,
  Modal
}from 'react-native';
import TextField from 'react-native-md-textinput';
import Hr from 'react-native-hr';
import SplashScreen from './splashScreen.js';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
import Icon from 'react-native-vector-icons/Ionicons';
import FBSDK, {LoginManager} from 'react-native-fbsdk'
const {
  LoginButton,
  AccessToken
} = FBSDK;
var datafb = '';
class loginView extends Component{
  constructor(props){
    super(props);
    this.state=({
      warning_user: '',
      warning_pass: '',
      username:'',
      password:'',
      modalVisible: false,
      checkBox:require('../images/box.png')
    });
    console.disableYellowBox = true;
  }
  redirect(routeName,data){
    this.props.navigator.push({
      name: routeName,
      passProps: {
        data: data
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
  componentWillMount(){
    AsyncStorage.getItem("user").then((value)=>{
      if(value !=null)
      {
        this.setState({user:value});
        this.redirect('home',value);
      }

    }).done();
  }
  async _fbAuth(){
     let that = this;
    LoginManager.logInWithReadPermissions(['public_profile']).then(function(result) {
      if(result.isCancelled){
        console.log('Login was cancelled');
      }else {
        AccessToken.getCurrentAccessToken().then(
          (data) => {
            // console.log(data.accessToken.toString());
            fetch('https://graph.facebook.com/v2.8/me?fields=id,name,gender,birthday,email,link,locale,picture,cover&access_token=' + data.accessToken.toString())
            .then((response) => response.json())
            .then((json) => that.loginFB(json))
            .catch(() => {
              console.log('ERROR GETTING DATA FROM FACEBOOK');
            })
          }
        )

      }
    },function(error) {
      console.log('An error occured' + error);
    })
  }

  async loginFB(json){
    let formdata = new FormData();
    formdata.append("id", json.id);
    formdata.append("name", json.name);
    formdata.append("email", json.email);
    formdata.append("gender", json.gender);
    formdata.append("dob", json.birthday);
    formdata.append("avatar", json.picture.data.url);
    formdata.append("background", json.cover.source);

    try {
      let response = await fetch('http://suta.esy.es/api/login_fb.php',{
        method: 'post',
        headers: {
        'Content-Type': 'multipart/form-data',
        },
        body: formdata
      });
      let res = await response.text();
      var jsonResponse = JSON.parse(res);
      this.redirect('home',JSON.stringify(jsonResponse['result']));
      AsyncStorage.setItem("user",JSON.stringify(jsonResponse['result']));
    }
    catch(error)
    {
    //  console.log(error);
    }
  }
  async onLoginPressed(){

    Keyboard.dismiss();
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
        id: jsonResponse['result'].id_user
      });

      if (response.status >= 200 && response.status < 300 && jsonResponse['code']==0) {
          //Handle success
          //On success we will store the access_token in the AsyncStorage
          this.redirect('home',JSON.stringify(jsonResponse['result']));
          AsyncStorage.setItem("user",JSON.stringify(jsonResponse['result']));


      }else {
          Alert.alert('Thông báo',this.state.message);
      }
    } catch(error) {
        //console.log("error " + error);
      //  console.log(this.state.username + " & " + this.state.password);

    }
  }
  test(){
    alert(this.state.username +"-"+ this.state.password);
  }

  setModalVisible() {
       if(this.state.modalVisible){
         this.setState({modalVisible: false});
       }else{
         this.setState({modalVisible: true});
       }
     }

  _cancle(){
    this.setModalVisible();
  }

  _next(){
    if(this.state.checkBox == require('../images/ico_tick.png')){
      this.setModalVisible();
      this._fbAuth();
    }
  }

  checkOk(){
    if(this.state.checkBox == require('../images/box.png')){
      this.setState({ checkBox: require('../images/ico_tick.png')})
    }
    else{
      this.setState({ checkBox: require('../images/box.png')})
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
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{flex:1,alignItems:'center'}}>
              <Icon name="md-contact" size={24} style={{marginTop:35}} color="#F5F5F5"/>
            </View>
            <View style={{flex:6,marginLeft:5}}>
              <TextField
              labelColor={'#F5F5F5'}
              label={'Tên tài khoản'}
              textColor={'#F5F5F5'}
              autoCapitalize="none"
              autoCorrect={false}
              highlightColor={'#BDBDBD'}
              returnKeyType="next"
              onChangeText={(text) => {
                this.state.username = text;
              }}
              onSubmitEditing={()=>this.passwordInput.focus()}
              dense={true}/>
            </View>
          </View>

          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{flex:1,alignItems:'center'}}>
              <Icon name="md-key" size={24} color="#F5F5F5" style={{marginTop:35}} />
            </View>
            <View style={{flex:6, marginLeft:5}}>
            <TextField
            label={'Mật khẩu'}
            labelColor={'#F5F5F5'}
            textColor={'#F5F5F5'}
            autoCapitalize="none"
            autoCorrect={false}
            highlightColor={'#BDBDBD'}
            onChangeText={(text) => {
            this.state.password = text;
          }}
          dense={true}
            ref={(input)=>this.passwordInput = input}
            secureTextEntry= {true}/>
            </View>
          </View>

        </View>
          <View style={{alignItems:'center'}}>
            <TouchableOpacity onPress={()=>this.onLoginPressed()} style={styles.button}>
              <Text style={{color:'#F5F5F5'}}>ĐĂNG NHẬP</Text>
            </TouchableOpacity>
          </View>

          <View style={{padding:15}}>
            <Hr lineColor='#BDBDBD' text='OR' textColor='#F5F5F5'/>
          </View>

          <TouchableOpacity onPress={()=>this.setModalVisible()}>
            <View style={{flexDirection:'row', justifyContent:'center'}}>
                <Icon name="logo-facebook" size={22} color="#F5F5F5" style={{marginTop:-1}} />
                <Text style={{color:'#F5F5F5', fontWeight:'bold', paddingLeft:5}} >
                  Đăng nhập bằng Facebook
                </Text>
            </View>
          </TouchableOpacity>


        </View>


        </KeyboardAvoidingView>
        <View style={{alignItems:'center'}}>
        <TouchableOpacity>
          <View style={{justifyContent:'center', alignItems:'center', paddingTop: 20}}>
              <Text style={{color:'#F5F5F5', paddingLeft:5,paddingBottom:10}} >
                Quên mật khẩu?
              </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.navigate.bind(this,'register')}>
          <View style={{flexDirection:'row',
            justifyContent:'center',
            width: deviceWidth,
        }}>
            <Text style={{color:'#F5F5F5'}}>
                  Bạn chưa có tài khoản?
            </Text>
            <Text style={{color:'#F5F5F5', fontWeight:'bold', paddingLeft:5}} >
              Đăng ký.
            </Text>
          </View>

          </TouchableOpacity>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible}>
            <TouchableOpacity activeOpacity={1}

                  style={{backgroundColor: 'rgba(0,0,0,.8)',flex:1,justifyContent:'center',alignItems:'center'}} >
              <TouchableOpacity activeOpacity={1} style={{
                width:300,

                backgroundColor:'white',
              }}>

              <View style={{padding: 10}}>
                <View style={{alignItems:'center'}}>
                  <Text style ={{ fontWeight: 'bold'}}> ĐIỀU KHOẢN MẠNG XÃ HỘI SUTA
                  </Text>
                </View>
                <View style={{marginTop: 10}}>
                  <Text>Mạng xã hội tâm sự SUTA là nơi để bày tỏ cảm xúc cá nhân....
                  </Text>
                </View>
                <View style={{marginTop: 10, flexDirection:'row'}}>
                  <TouchableOpacity onPress={()=>this.checkOk()} >
                    <Image
                      style={{width: 15, height: 15, marginTop: 2}}
                      source={this.state.checkBox}
                      />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this.checkOk()} >
                    <Text style={{paddingLeft: 5}}>Tôi đồng ý
                    </Text>
                    </TouchableOpacity>
                </View>

                <View style={{marginTop: 10, flexDirection: 'row'}}>
                  <TouchableOpacity onPress={()=> this._cancle()}>
                    <Text style={{fontWeight: 'bold'}}> CANCLE
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={{paddingLeft: 20}} onPress={()=> this._next()}>
                    <Text style={{color:'#8e44ad', fontWeight: 'bold'}}> NEXT
                    </Text>
                  </TouchableOpacity>
                </View>

              </View>

              </TouchableOpacity>


            </TouchableOpacity>
          </Modal>
        </View>

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
