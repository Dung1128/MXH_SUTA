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
  }
  onBack(routeName,data){
    this.props.navigator.pop({
      name: routeName,
      passProps: {
      }
    })
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
                <TextField labelColor={'#F5F5F5'} label={'Tên tài khoản'} textColor={'#F5F5F5'} highlightColor={'#BDBDBD'} />
              </View>
            </View>

            <View style={{flexDirection:'row', justifyContent:'center',marginTop:-15}}>
              <View style={{flex:1,alignItems:'center'}}>
                <Icon name="md-call" size={24} color="#F5F5F5" style={{marginTop:35}}/>
              </View>
              <View style={{flex:6,marginLeft:5}}>
              <TextField label={'Số điện thoại'} textColor={'#F5F5F5'} labelColor={'#F5F5F5'} highlightColor={'#BDBDBD'} />
              </View>

            </View>

            <View style={{flexDirection:'row', justifyContent:'center',marginTop:-15}}>
              <View style={{flex:1,alignItems:'center'}}>
                <Icon name="md-key" size={24} color="#F5F5F5" style={{marginTop:35}} />
              </View>
              <View style={{flex:6, marginLeft:5}}>
              <TextField label={'Mật khẩu'} labelColor={'#F5F5F5'} textColor={'#F5F5F5'} highlightColor={'#BDBDBD'} secureTextEntry= {true}/>
              </View>

            </View>

            <View style={{flexDirection:'row', justifyContent:'center',marginTop:-15}}>
              <View style={{flex:1,alignItems:'center'}}>
                <Icon name="md-key" size={24} color="#F5F5F5" style={{marginTop:35}} />
              </View>
              <View style={{flex:6, marginLeft:5}}>
              <TextField label={'Nhập lại mật khẩu'} labelColor={'#F5F5F5'} textColor={'#F5F5F5'} highlightColor={'#BDBDBD'} secureTextEntry= {true} />
              </View>

            </View>

          </View>
          <View style={{flex:1, alignItems:'center'}}>
            <TouchableOpacity style={styles.button}>
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
