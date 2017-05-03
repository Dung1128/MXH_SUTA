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
  Modal
}from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MyStatusBar from './statusbar.js';
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
      username: '',
      password: '',
      phone: '',
      modalVisible: false,
      checkBox:require('./images/box.png')
    });
    console.disableYellowBox = true;
  }
  onBack(routeName,data){
    this.props.navigator.pop({
      name: routeName,
      passProps: {
      }
    })
  }
  setModalVisible() {
       if(this.state.modalVisible){
         this.setState({modalVisible: false});
       }else{
         this.setState({modalVisible: true});
       }
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
            if(this.state.username!=null){
              this.setState({warning_user: this.state.message});
            }else {
              this.setState({warning_user: "Bạn cần nhập tài khoản"});
            }

          } if(value=='phone'){
            if(this.state.username!=null){
              this.setState({warning_phone: this.state.message});
            }else {
              this.setState({warning_phone: "Bạn cần nhập số điện thoại"});
            }
          }

        //  console.log(this.state.message);
      } else {
          //Handle error

            if(value=='username')
            {
              if(this.state.username!=null){
                this.setState({warning_user: this.state.message});
              }else {
                this.setState({warning_user: "Bạn cần nhập tài khoản"});
              }

            } if(value=='phone'){
              if(this.state.username!=null){
                this.setState({warning_phone: this.state.message});
              }else {
                this.setState({warning_phone: "Bạn cần nhập số điện thoại"});
              }
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
      if(password!=null){
        if(password.length < 6)
        {
          this.setState({warning_pass: 'Mật khẩu cần lớn hơn 6 ký tự'});
        }else {
          this.setState({warning_pass: ''});
        }
      }else {
        this.setState({warning_pass: 'Bạn cần nhập mật khẩu'});
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

  test(){
      console.log('cái quái gì đây!');
  }

  async onRegisterPressed(){
    if( this.state.username != '' && this.state.password != ''
      && this.state.phone != ''  )
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
            console.log(res);
            var jsonResponse = JSON.parse(res);
            this.setState({
                code: jsonResponse['code'],
               message: jsonResponse['message'],
               result: jsonResponse['result']
            });
            console.log('b1');
            if (response.status >= 200 && response.status < 300 && jsonResponse['code'] == 0) {
                Alert.alert('Thông báo','Đăng kí thành công!');
                this.redirect('login','OK');
            } else {
                Alert.alert('Thông báo','Đăng kí không thành công, mật khẩu phải từ 6 kí tự trở lên!');
            }

          }catch(error) {
              console.log("error " + error);
          }

    }else {
      Alert.alert('Thông báo',"Bạn cần điền đúng thông tin.!");
    }

}

  navigate(routeName,data){
    this.props.navigator.push({
      name: routeName,
      passProps: {
      }
    })
  }
  _cancle(){
    this.setModalVisible();
    this.onBack('login');
  }

  _next(){
    Alert.alert(
   'Thông báo',
   'Đăng ký tài khoản đồng nghĩa với việc bạn đồng ý với các điều khoản của ứng dụng, bạn có đồng ý không?',
   [
     {text: 'Điều Khoản', onPress: () => {this.navigate('rules');}},
     {text: 'Không', onPress: () => {this._cancle();}},
     {text: 'Có', onPress: () => {this.onRegisterPressed();}}
   ],
   { cancelable: false }
  );
  }


  render(){
    return(

      <View style={{flex:1}}>
      <MyStatusBar backgroundColor="#8e178f"/>
      <Image source={require('./images/bgr2.png')} style={styles.container}>
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.back} onPress={this.onBack.bind(this)} >
          <Icon name="md-arrow-back" size={34} color="#F5F5F5"/>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView behavior="padding" style={{flex:1}}>
      <View style={styles.logo}>
        <Image
          style={{width: 145, height: 86}}
          source={require('./images/logo3.png')}
          />
      </View>

        <View style={styles.contentLogin}>
          <View style={{flex:5, flexDirection:'column'}}>
            <View style={{flexDirection:'row', justifyContent:'center',marginTop:-15}}>
              <View style={{flex:1,alignItems:'center'}}>
                <Icon name="md-contact" size={24} style={{marginTop:35}} color="#F5F5F5"/>
              </View>
              <View style={{flex:6,marginLeft:5}}>
                <TextField
                labelColor={'#F5F5F5'}
                label={'Tên tài khoản'}
                textColor={'#F5F5F5'}
                highlightColor={'#BDBDBD'}
                returnKeyType="next"

                onChangeText={(text) => {
                  this.state.username = text;
                }}
                onSubmitEditing={()=>this.phoneInput.focus()}
                dense={true}/>


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
                <TextField
                labelColor={'#F5F5F5'}
                label={'Số Điện Thoại'}
                textColor={'#F5F5F5'}
                highlightColor={'#BDBDBD'}
                returnKeyType="next"

                keyboardType="phone-pad"
                onChangeText={(text) => {
                  this.state.phone = text;
                }}


                ref={(input)=>this.phoneInput = input}
                onSubmitEditing={()=>this.passwordInput.focus()}
                dense={true}/>


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

                <TextField
                secureTextEntry
                labelColor={'#F5F5F5'}
                label={'Mật Khẩu'}
                textColor={'#F5F5F5'}
                highlightColor={'#BDBDBD'}
                returnKeyType="next"

                onChangeText={(text) => {
                  this.state.password = text;
                }}
                ref={(input)=>this.passwordInput = input}
                onSubmitEditing={()=>this.repasswordInput.focus()}
                dense={true}/>

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

                <TextField
                secureTextEntry
                labelColor={'#F5F5F5'}
                label={'Nhập Lại Mật Khẩu'}
                textColor={'#F5F5F5'}
                highlightColor={'#BDBDBD'}
                returnKeyType="next"

                onChangeText={(text) => {
                  this.state.repassword = text;
                }}
                ref={(input)=>this.repasswordInput = input}
                dense={true}/>


                <Text style={{color:'#F5F5F5', fontSize:10}}>
                  {this.state.warning_repass}
                </Text>
              </View>

            </View>

          </View>



        </View>
        </KeyboardAvoidingView>
        <View style={{flex:0.3,alignItems:'center'}}>
          <TouchableOpacity onPress={()=>
            this._next()}
           style={styles.button}>
            <Text style={{color:'#F5F5F5'}}>ĐĂNG KÝ</Text>
          </TouchableOpacity>
        </View>


      </Image>
      </View>


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
    flex:2,
    alignItems:'center',
    justifyContent:'center'
  },
  contentLogin:{
    flex:5,
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
