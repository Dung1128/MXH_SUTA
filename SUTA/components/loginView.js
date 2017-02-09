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
                <Image style={{marginTop:10}}
                  source={require('../images/phone_2_24.png')}
                  />
              </View>
              <View style={{flex:6}}>
              <TextInput autoFocus={true} style={{height: 40,}}
               underlineColorAndroid="#acacac" placeholderTextColor= "#acacac" placeholder='Số điện thoại'/>
              </View>

            </View>
            <View style={{flexDirection:'row', justifyContent:'center'}}>
              <View style={{flex:1,alignItems:'center'}}>
                <Image style={{marginTop:10}}
                  source={require('../images/key_24.png')}
                  />
              </View>
              <View style={{flex:6}}>
              <TextInput autoFocus={true} style={{height: 40,}}
               underlineColorAndroid="#acacac" placeholderTextColor= "#acacac" placeholder='Mật khẩu'/>
              </View>

            </View>
          </View>
          <View style={{flex:1, alignItems:'center'}}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.text}>ĐĂNG NHẬP</Text>
            </TouchableOpacity>
          </View>
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
    margin:10
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
      width:deviceWidth/1.5,
      backgroundColor: '#0057a7',
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius:20
    },
});
module.exports = loginView;
