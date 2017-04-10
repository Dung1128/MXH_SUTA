import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  AsyncStorage
} from 'react-native';
import Iconn from 'react-native-vector-icons/Ionicons';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
import Hr from 'react-native-hr';
import FBSDK, {LoginManager} from 'react-native-fbsdk';
import firebase from './api.js';
var items_rooms = [];
export default class accountManagerView extends Component{
  constructor(props){
    super(props);
    this.state={
      data: this.props.data
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

  async _removeStorage (){
   AsyncStorage.removeItem('user');
 }
 setOffline(){
   database = firebase.database();
   database.ref("rooms").once("value", (snap)=>{
       snap.forEach((data)=>{
         items_rooms.push({
           key: data.key,
           data: data.val(),
         });

       })
       for (var i = 0; i < items_rooms.length; i++) {
         if(items_rooms[i].data.user_1.id_user === this.state.data.id_user )
         {
           database.ref("rooms/" + items_rooms[i].key + "/user_1").update({
              "online": 0
           });
         }
         if(items_rooms[i].data.user_2.id_user === this.state.data.id_user)
         {
           database.ref("rooms/" + items_rooms[i].key + "/user_2").update({
              "online": 0
           });
         }
       }

   });
 }
 clearId(){
   LoginManager.logOut();
   this._removeStorage();
   this.redirect('login');
   this.setOffline();
   alert("Đăng xuất thành công!");
 }

  render(){
    //console.log(this.state.data);
    return(
      <View style={{flex:1}}>
        <View style={styles._toolbar}>
          <TouchableOpacity onPress={this.onBack.bind(this)}>
            <Iconn name="md-arrow-back" size={34} color="#F5F5F5"/>
          </TouchableOpacity>
          <Text style={{fontSize:18, fontWeight:'bold', paddingLeft:15, paddingTop:3, color:'#fff'}}> Quản lý tài khoản
          </Text>
        </View>

        <View style={styles._content}>
          <View style={{padding:10, }}>
            <TouchableOpacity onPress={this.redirect.bind(this,'changepass',this.state.data)}>
              <View style={{ flexDirection:'row', paddingBottom:10}}>
                <Text style={{paddingLeft:5, paddingTop:2,fontSize: 15, textAlign: 'left'}}> Đổi mật khẩu </Text>
                <TouchableOpacity onPress={this.redirect.bind(this,'changepass', this.state.data)}>
                  <Iconn name="ios-arrow-forward" size={25} color="#BDBDBD" style={{marginLeft: 217}}/>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            <Hr lineColor='#BDBDBD'/>

            <TouchableOpacity>
              <View style={{paddingBottom:5}}>
                  <View style={{ flexDirection:'row', paddingTop:10}}>
                    <Text style={{paddingLeft:5, paddingTop:2,fontSize: 15, textAlign: 'left'}}> Xóa tài khoản </Text>
                    <TouchableOpacity>
                      <Iconn name="ios-arrow-forward" size={25} color="#BDBDBD" style={{marginLeft:215}}/>
                    </TouchableOpacity>
                  </View>
                  <Text style={{fontSize:11, paddingLeft:5}}> Xóa vĩnh viễn tài khoản và dữ liệu của bạn
                  </Text>
              </View>
            </TouchableOpacity>
            <Hr lineColor='#BDBDBD'/>

            <TouchableOpacity onPress={()=>this.clearId()}>
              <View style={{paddingBottom:5}}>
                  <View style={{ flexDirection:'row', paddingTop:10}}>
                    <Text style={{paddingLeft:5, paddingTop:2,fontSize: 15, textAlign: 'left'}}> Đăng xuất </Text>
                    <TouchableOpacity onPress={()=>this.clearId()}>
                      <Iconn name="ios-arrow-forward" size={25} color="#BDBDBD" style={{marginLeft: 234}}/>
                    </TouchableOpacity>
                  </View>
                  <Text style={{fontSize:11, paddingLeft:5, paddingRight:5}}> Đăng xuất tài khoản của bạn. Bạn có thể đăng nhập bằng tài khoản khác.
                  </Text>
              </View>
            </TouchableOpacity>
            <Hr lineColor='#BDBDBD'/>
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
  }
})
