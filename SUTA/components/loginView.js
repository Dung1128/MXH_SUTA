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
import TextField from 'react-native-md-textinput';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

class loginView extends Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <View style={styles.container}>
        <View style={styles.logo}>
          <Image
            style={{width: 150, height: 150}}
            source={require('../images/logo.png')}
            />
        </View>
        <View style={styles.contentLogin}>
          <View style={{flex:1}}>
            <View style={{flexDirection:'row', justifyContent:'center'}}>
              <View style={{flex:1,alignItems:'center'}}>
                <Image style={{marginTop:30}}
                  source={require('../images/phone_5_32.png')}
                  />
              </View>
              <View style={{flex:6,marginLeft:5}}>
              <TextField label={'Số điện thoại'} highlightColor={'#333333'}/>
              </View>

            </View>
            <View style={{flexDirection:'row', justifyContent:'center'}}>
              <View style={{flex:1,alignItems:'center'}}>
                <Image style={{marginTop:30}}
                  source={require('../images/lock_2_32.png')}
                  />
              </View>
              <View style={{flex:6, marginLeft:5}}>
              <TextField label={'Mật khẩu'} highlightColor={'#333333'} secureTextEntry= {true}/>
              </View>

            </View>
          </View>
          <View style={{flex:1, alignItems:'center',marginTop:50}}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.text}>ĐĂNG NHẬP</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={{marginTop:5}}>
                Đăng nhập bằng facebook?
              </Text>
            </TouchableOpacity>
            </View>

        </View>
        <View style={{alignItems:'center'}}>
        <TouchableOpacity>
          <Text>
                Bạn chưa có tài khoản? Đăng ký
          </Text>
          </TouchableOpacity>
        </View>
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
    margin:20
  },
  logo:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  contentLogin:{
    flex:1,
  },
  button: {
      marginTop:10,
      width:deviceWidth/2,
      borderColor: '#333333',
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius:20,
      borderWidth:1
    },
});
module.exports = loginView;
