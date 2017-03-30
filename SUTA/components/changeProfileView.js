import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  AsyncStorage,
  Image,
  TextInput
} from 'react-native';
import Iconn from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
import Hr from 'react-native-hr';
export default class changeProfileView extends Component{
  constructor(props){
    super(props);
    this.state={
      user: this.props.data,
      phone: this.props.data.phone,
      email: this.props.data.email,
      address: this.props.data.address,
      gender: this.props.data.gender,
      dob: this.props.data.dob,
    }
  }

  redirect(routeName,data){
    this.props.navigator.push({
      name: routeName,
      passProps: {
        data: data
      }
    })
  }
  onBack(routeName){
    this.props.navigator.pop({
      name: routeName,
      passProps: {

      }
    })
  }


  render(){
    return(
      <View style={{flex:1}}>
        <View style={styles._toolbar}>
          <TouchableOpacity onPress={this.onBack.bind(this)}>
            <Iconn name="md-arrow-back" size={34} color="#F5F5F5"/>
          </TouchableOpacity>
          <Text style={{fontSize:18,
            fontWeight:'bold',
            paddingLeft:15,
            paddingTop:3,
            color:'#fff'}}> Chỉnh sửa thông tin
          </Text>
        </View>

        <View style={styles._content}>
          <View style={{padding:10, flexDirection:'row', flex: 1}}>
            <View style={{flex: 1.3, alignItems:'center'}}>
              <Image style={{width:80, height:80,borderRadius:200}} source={{uri: this.state.user.avatar}}/>
            </View>

            <View style={{flex: 2.5}}>
              <TextInput style={styles._input} value = {this.state.phone}/>
            </View>


          </View>
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
    backgroundColor:'rgb(255, 255, 255)'
  },
  _input:{
    height: 40,
    width: null
  }
})
