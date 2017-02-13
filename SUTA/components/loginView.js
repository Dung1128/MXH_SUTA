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
import Hr from 'react-native-hr';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
import Icon from 'react-native-vector-icons/Ionicons';

class loginView extends Component{
  constructor(props){
    super(props);
  }
  redirect(routeName,data){
  this.props.navigator.push({
    name: routeName,
    passProps: {
    }
  })
}
  render(){
    return(
<Image source={{uri:'https://mir-s3-cdn-cf.behance.net/project_modules/disp/496ecb14589707.562865d064f9e.png'}} style={styles.container}>
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
                <TextField labelColor={'#F5F5F5'} label={'Tên tài khoản'} textColor={'#F5F5F5'} highlightColor={'#BDBDBD'} />
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

          </View>
          <View style={{alignItems:'center'}}>
            <TouchableOpacity style={styles.button}>
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
        <TouchableOpacity onPress={this.redirect.bind(this,'register')}>
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
    padding:10
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
